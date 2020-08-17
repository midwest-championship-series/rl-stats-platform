const ballchasing = require('./services/ballchasing')
const { Model: Players } = require('./model/mongodb/players')
const { Model: Teams } = require('./model/mongodb/teams')
const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const { Model: Leagues } = require('./model/mongodb/leagues')
const teamGames = require('./model/sheets/team-games')
const playerGames = require('./model/sheets/player-games')
const processMatch = require('./producers')
const { getPlayerTeamsAtDate } = require('./producers/common')
const { RecoverableError, UnRecoverableError } = require('./util/errors')

const validateFilters = ({ league_id, match_id, game_ids }) => {
  if (match_id) return
  if (!league_id || !game_ids)
    throw new UnRecoverableError('INVALID_CRITERIA', 'no league id or game ids passed for new match')
}

const getEarliestGameDate = games => new Date(games.sort((a, b) => (a.date > b.date ? 1 : -1))[0].date)

const getUniqueGamePlayers = games => {
  return games
    .reduce((result, game) => {
      return result.concat(
        ['blue', 'orange'].reduce((players, color) => {
          return players.concat(game[color].players)
        }, []),
      )
    }, [])
    .reduce((result, item) => {
      if (!result.some(r => r.id.platform === item.id.platform && r.id.id === item.id.id)) {
        result.push(item)
      }
      return result
    }, [])
}

const getUnlinkedPlayers = (linked, all) => {
  const linkedAccounts = linked.reduce((result, player) => {
    return result.concat(player.accounts)
  }, [])
  return all
    .map(p => ({ name: p.name, platform: p.id.platform, platform_id: p.id.id }))
    .filter(p => !linkedAccounts.some(acc => p.platform === acc.platform && p.platform_id === acc.platform_id))
}

/**
 * takes games from ballchasing and returns a mongodb query for all of the players' ids
 */
const buildPlayersQuery = games => {
  return {
    $or: getUniqueGamePlayers(games).map(player => ({
      accounts: {
        $elemMatch: {
          platform: player.id.platform,
          platform_id: player.id.id,
        },
      },
    })),
  }
}

const buildTeamsQueryFromPlayers = (players, matchDate) => {
  const teamIds = players.reduce((result, player) => {
    if (player.team_history && player.team_history.length > 0) {
      result.push(...getPlayerTeamsAtDate(player, matchDate).map(item => item.team_id.toHexString()))
    }
    return result
  }, [])
  const unique = [...new Set(teamIds)]
  return { $or: unique.map(id => ({ _id: id })) }
}

const buildMatchesQuery = teams => {
  return { $and: teams.map(t => ({ team_ids: t._id })), status: 'open' }
}

const getMatchInfoById = async matchId => {
  const match = await Matches.findById(matchId)
    .populate('games')
    .populate('teams')
    .populate({
      path: 'season',
      populate: { path: 'league' },
    })
  return { match, teams: match.teams, season: match.season, league: match.season.league }
}

const getMatchInfoByPlayers = async (leagueId, players, matchDate) => {
  const league = await Leagues.findById(leagueId).populate('current_season')
  const seasonTeams = league.current_season.team_ids
  const teams = (await Teams.find(buildTeamsQueryFromPlayers(players, matchDate))).filter(team =>
    seasonTeams.some(id => id.equals(team._id)),
  )
  if (teams.length !== 2) {
    let errMsg = `expected to process match between two teams but got ${teams.length}.`
    if (teams.length > 0) errMsg += ` Teams: ${teams.map(t => t._id.toHexString()).join(', ')}.`
    throw new UnRecoverableError('MATCH_TEAM_COUNT', errMsg)
  }
  const matches = await Matches.find(buildMatchesQuery(teams))
    .populate('games')
    .populate({
      path: 'season',
      populate: { path: 'league' },
    })
  if (matches.length !== 1) {
    const errMsg = `expected to get one match but got ${matches.length} for teams: ${teams.map(t =>
      t._id.toHexString(),
    )}`
    throw new UnRecoverableError('INCORRECT_MATCH_COUNT', errMsg)
  }

  const match = matches[0]
  return { match, teams, season: match.season, league: match.season.league }
}

/**
 * takes a match and game ids and updates stat data
 * @param {{ match_id, game_ids }} matchInfo match_id can be undefined, game_ids are the ballchasing game ids
 */
module.exports = async filters => {
  validateFilters(filters)
  const { league_id, match_id, game_ids } = filters
  let reportGames
  try {
    reportGames = await ballchasing.getReplays({ game_ids })
  } catch (err) {
    throw new RecoverableError(err.message)
  }
  const players = await Players.find(buildPlayersQuery(reportGames))
  if (players.length < 1) {
    const errMsg = `no players found for games: ${game_ids.join(', ')}`
    throw new UnRecoverableError('NO_IDENTIFIED_PLAYERS', errMsg)
  }

  const { league, season, match, teams } = await (match_id
    ? getMatchInfoById(match_id) // this is a reprocessed match
    : getMatchInfoByPlayers(league_id, players, getEarliestGameDate(reportGames))) // this is a new match
  let games
  if (!match.games || match.games.length < 1) {
    // create games
    games = reportGames.map(g => new Games({ ballchasing_id: g.id, status: 'closed', date_time_played: g.date }))
    // update match
    match.game_ids = games.map(g => g._id)
  } else {
    games = match.games
  }
  const { teamStats, playerStats, playerTeamMap } = processMatch(reportGames, {
    league,
    season,
    match,
    games,
    teams,
    players,
  })
  try {
    await Promise.all([teamGames.upsert({ data: teamStats }), playerGames.upsert({ data: playerStats })])
  } catch (err) {
    throw new RecoverableError(err.message)
  }

  for (let game of games) {
    game.date_time_processed = Date.now()
    await game.save()
  }
  match.players_to_teams = playerTeamMap
  match.team_ids = teams.map(t => t._id)
  await match.save()

  const unlinkedPlayers = getUnlinkedPlayers(players, getUniqueGamePlayers(reportGames))
  return {
    match_id: match._id.toHexString(),
    game_ids: games.map(({ _id }) => _id.toHexString()),
    league,
    season,
    match,
    games,
    teams,
    players,
    unlinkedPlayers,
    teamStats,
    playerStats,
    playerTeamMap,
  }
}

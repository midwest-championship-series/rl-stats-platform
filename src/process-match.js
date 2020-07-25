const ballchasing = require('./services/ballchasing')
const { Model: Players } = require('./model/mongodb/players')
const { Model: Teams } = require('./model/mongodb/teams')
const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const { Model: Leagues } = require('./model/mongodb/leagues')
const teamGames = require('./model/sheets/team-games')
const playerGames = require('./model/sheets/player-games')
const processMatch = require('./producers')

const validateFilters = ({ league_id, match_id, game_ids }) => {
  if (match_id) return
  if (!league_id || !game_ids) throw new Error('no league id passed for new match')
}

const getEarliestGameDate = games => new Date(games.sort((a, b) => (a.date > b.date ? 1 : -1))[0].date)

/**
 * takes games from ballchasing and returns a mongodb query for all of the players' ids
 */
const buildPlayersQuery = games => {
  return {
    $or: games
      .reduce((result, game) => {
        return result.concat(
          ['blue', 'orange'].reduce((players, color) => {
            return players.concat(game[color].players)
          }, []),
        )
      }, [])
      .map(({ id }) => ({ platform: id.platform, platform_id: id.id }))
      .reduce((result, item) => {
        if (!result.some(r => r.platform === item.platform && r.platform_id === item.platform_id)) {
          result.push(item)
        }
        return result
      }, [])
      .map(item => ({ accounts: { $elemMatch: item } })),
  }
}

const buildTeamsQueryFromPlayers = (players, matchDate) => {
  /**
   * @todo for any players which played but do not have a mapped team, push alert to discord
   */
  for (let player of players) {
    const currentTeam = player.team_history.find(
      item => item.date_joined < matchDate && (!item.date_left || item.date_left > matchDate),
    )
    if (currentTeam) {
      player.team_id = currentTeam.team_id
    }
  }
  const teamIds = players.reduce((result, player) => {
    if (player.team_history && player.team_history.length > 0) {
      result.push(
        ...player.team_history
          .filter(item => item.date_joined < matchDate && (!item.date_left || item.date_left > matchDate))
          .map(item => item.team_id.toHexString()),
      )
    }
    return result
  }, [])
  const unique = [...new Set(teamIds)]
  return { $or: unique.map(id => ({ _id: id })) }
}

const buildMatchesQuery = teams => {
  return { $and: teams.map(t => ({ team_ids: t._id })) }
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
  const league = await Leagues.findById(leagueId).populate('current_season_object')
  const seasonTeams = league.current_season_object.team_ids
  const teams = (await Teams.find(buildTeamsQueryFromPlayers(players, matchDate))).filter(team =>
    seasonTeams.id(team._id),
  )
  if (teams.length !== 2) {
    throw new Error(
      `expected to process match between two teams but got ${teams.length}. Teams: ${teams
        .map(t => t._id.toHexString())
        .join(', ')}.`,
    )
  }
  const matches = await Matches.find(buildMatchesQuery(teams))
    .populate('games')
    .populate({
      path: 'season',
      populate: { path: 'league' },
    })
  if (matches.length !== 1)
    throw new Error(
      `expected to get one match but got ${matches.length} for teams: ${teams.map(t => t._id.toHexString())}`,
    )
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
  const reportGames = await ballchasing.getReplays({ game_ids })
  const players = await Players.find(buildPlayersQuery(reportGames))
  if (players.length < 1) throw new Error(`no players found for games: ${game_ids.join(', ')}`)

  const { league, season, match, teams } = await (match_id
    ? getMatchInfoById(match_id) // this is a reprocessed match
    : getMatchInfoByPlayers(league_id, players, getEarliestGameDate(reportGames))) // this is a new match
  let games
  if (!match.games || match.games.length < 1) {
    // create games
    games = reportGames.map(g => new Games({ ballchasing_id: g.id, status: 'closed' }))
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
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })

  for (let game of games) {
    game.date_time_processed = Date.now()
    await game.save()
  }
  match.players_to_teams = playerTeamMap
  await match.save()
  return { match_id: match._id.toHexString(), game_ids: games.map(({ _id }) => _id.toHexString()) }
}

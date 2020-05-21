const ballchasing = require('./services/ballchasing')
const { Model: Players } = require('./model/mongodb/players')
const { Model: Teams } = require('./model/mongodb/teams')
const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const { Model: Seasons } = require('./model/mongodb/seasons')
const teamGames = require('./model/sheets/team-games')
const playerGames = require('./model/sheets/player-games')
const processMatch = require('./producers')

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
        if (!result.some(r => r.platform === item.platform && r.id === item.platform_id)) {
          result.push(item)
        }
        return result
      }, [])
      .map(item => ({ accounts: { $elemMatch: item } })),
  }
}

const buildTeamsQuery = teamIds => {
  const unique = [...new Set(teamIds)]
  if (unique.length !== 2)
    throw new Error(`expected to process match between 2 teams but got ${unique.length}. Teams: ${unique.join(', ')}`)
  return { $or: unique.map(id => ({ _id: id })) }
}

const buildMatchesQuery = (matchId, teams) => {
  let query
  if (matchId) {
    query = { _id: matchId }
  } else {
    query = { $and: teams.map(t => ({ team_ids: t._id })) }
  }
  query
  return query
}

/**
 * takes a match and game ids and updates stat data
 * @param {{ match_id, game_ids }} matchInfo match_id can be undefined, game_ids are the ballchasing game ids
 */
module.exports = async ({ match_id, game_ids }) => {
  const reportGames = await ballchasing.getReplays({ game_ids })
  const players = await Players.find(buildPlayersQuery(reportGames))
  const teams = await Teams.find(buildTeamsQuery(players.map(({ team_id }) => team_id.toHexString())))
  const matches = await Matches.find(buildMatchesQuery(match_id, teams))
    .populate('games')
    .populate({
      path: 'season',
      populate: { path: 'league' },
    })
  if (matches.length !== 1)
    throw new Error(
      `expected to get one match but got ${matches.length} for query: ${buildMatchesQuery(match_id, teams)}`,
    )
  const match = matches[0]
  // const season = await Seasons.findOne({ match_ids: match._id })
  let games
  if (!match.games || match.games.length < 1) {
    // create games
    games = reportGames.map(g => new Games({ ballchasing_id: g.id, status: 'closed' }))
    // update match
    match.game_ids = games.map(g => g._id)
  } else {
    games = match.games
  }
  /** @todo remove await here after processMatch is synchronous */
  const { teamStats, playerStats } = await processMatch(reportGames, { match, games, teams, players })
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })
  return { match_id: match._id.toHexString(), game_ids: games.map(({ _id }) => _id.toHexString()) }
}

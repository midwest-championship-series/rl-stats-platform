const { Model: Players } = require('./model/mongodb/players')
const { Model: Matches } = require('./model/mongodb/matches')
const { Model: Seasons } = require('./model/mongodb/seasons')
const { Model: Leagues } = require('./model/mongodb/leagues')
const { eventBridge } = require('./services/aws')

const reduceArray = (docs, prop) => {
  return docs.reduce((result, item) => {
    result.push(...item[prop])
    return result
  }, [])
}

const matchGetters = {
  matches: (criteria) => {
    return Matches.find({
      $or: [
        { 'game_ids.0': { $exists: true }, ...criteria },
        { forfeited_by_team: { $exists: true }, ...criteria },
      ],
    }).populate('games')
  },
  seasons: (criteria) => {
    return Seasons.find({ ...criteria })
      .populate({
        path: 'matches',
        populate: { path: 'games' },
      })
      .then((seasons) => reduceArray(seasons, 'matches'))
  },
  leagues: (criteria) => {
    return Leagues.find({ ...criteria })
      .populate({
        path: 'seasons',
        populate: {
          path: 'matches',
          populate: { path: 'games' },
        },
      })
      .then((leagues) => reduceArray(leagues, 'seasons'))
      .then((seasons) => reduceArray(seasons, 'matches'))
  },
  players: (criteria) => {
    return Players.find({ ...criteria }).then((players) => {
      return Matches.find({
        'players_to_teams.player_id': { $in: players.map((p) => p._id) },
      }).populate('games')
    })
  },
}

module.exports = async (collection, criteria) => {
  if (!matchGetters[collection]) throw new Error(`no query implemented for collection: ${collection}`)
  const messages = (await matchGetters[collection](criteria))
    .filter((match) => (match.games && match.games.length > 0) || match.forfeited_by_team)
    .map((match) => {
      const detail = {
        match_id: match._id.toHexString(),
        replays: match.games.map((game) => {
          return {
            bucket: {
              key: game.replay_origin.key,
              source: game.replay_origin.source,
            },
          }
        }),
      }
      return {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail,
      }
    })
  return eventBridge.emitEvents(messages)
}

const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const sqs = require('./services/aws').sqs

module.exports = async ({ match_id, game_ids }) => {
  const gameIdsToProcess = []
  // validate that all games for a match are being reported
  if (match_id) {
    const match = await Matches.findById(match_id).exec()
    if (!match) throw new Error(`no match found for id: ${match_id}`)
    if (!match.game_ids || match.game_ids.length < 1) throw new Error(`no game_ids found for match_id: ${match_id}`)
    gameIdsToProcess.push(...match.game_ids.map(id => id.toHexString()))
  } else if (game_ids && game_ids.length > 0) {
    /**
     * games could be mis-reported in 3 ways:
     * 1) games from different matches are reported together
     * 2) the games have already been processed, but only part of them are being reprocessed
     * 3) someone is attempting to add a new game to a match that already exists
     */
    const matches = await Matches.find({ game_ids: { $in: game_ids } }).exec()
    // const reportedGameMatchIds = [
    //   ...new Set(allGames.filter(g => game_ids.some(id => g.game_id === id)).map(g => g.match_id)),
    // ]
    if (matches.length > 1)
      // validate against case 1
      throw new Error(
        `cannot report games from multiple matches at once: ${matches.map(m => m._id.toHexString()).join(', ')}`,
      )
    const match = matches[0]
    // validate match games are correct with known matches
    if (match) {
      // covers case 2
      if (match.game_ids.length !== game_ids.length)
        throw new Error(
          `expected same number of games to be reported as games in match: ${match._id.toHexString()}, expected ${
            match.game_ids.length
          } but got ${game_ids.length}`,
        )
      // covers case 3
      if (!match.game_ids.every(id => game_ids.includes(id.toHexString())))
        throw new Error(`reported games_ids do not match game_ids for match ${match._id.toHexString()}`)
    }
    gameIdsToProcess.push(...game_ids)
  } else {
    throw new Error('expected match_id or game_ids[] in request body')
  }
  await sqs.sendMessage(process.env.GAMES_QUEUE_URL, { game_ids: gameIdsToProcess, match_id })
  return { recorded_ids: gameIdsToProcess }
}

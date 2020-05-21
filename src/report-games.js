const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const sqs = require('./services/aws').sqs

module.exports = async ({ match_id, game_ids }) => {
  const gameIdsToProcess = []
  // validate that all games for a match are being reported
  if (match_id) {
    const match = await Matches.findById(match_id).populate('games')
    if (!match) throw new Error(`no match found for id: ${match_id}`)
    if (!match.games || match.games.length < 1) throw new Error(`no games found for match_id: ${match_id}`)
    gameIdsToProcess.push(...match.games.map(game => game.ballchasing_id))
  } else if (game_ids && game_ids.length > 0) {
    /**
     * if games with these ballchasing ids have already been reported, throw an error - we only want new games to
     * be reported with this mechanism. all other games should go through the reprocess-games function.
     */
    const games = await Games.find({ ballchasing_id: { $in: game_ids } })
    if (games.length > 0) {
      throw new Error('games have already been reported - please use the !reprocess command')
    }
    gameIdsToProcess.push(...game_ids)
  } else {
    throw new Error('expected match_id or game_ids[] in request body')
  }
  await sqs.sendMessage(process.env.GAMES_QUEUE_URL, { game_ids: gameIdsToProcess, match_id })
  return { recorded_ids: gameIdsToProcess }
}

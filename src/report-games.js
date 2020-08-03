const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const sqs = require('./services/aws').sqs

module.exports = async ({ league_id, game_ids }) => {
  if (!league_id || !game_ids || game_ids.length < 1) throw new Error('request requires league_id and game_ids')
  /**
   * if games with these ballchasing ids have already been reported, throw an error - we only want new games to
   * be reported with this mechanism. all other games should go through the reprocess-games function.
   */
  const games = await Games.find({ ballchasing_id: { $in: game_ids } })
  if (games.length > 0) {
    throw new Error('games have already been reported - please use the !reprocess command')
  }
  const gameIdsToProcess = [...new Set(game_ids)]
  await sqs.sendMessage(process.env.GAMES_QUEUE_URL, { game_ids: gameIdsToProcess, league_id })
  return { recorded_ids: gameIdsToProcess }
}

const { Model: Games } = require('./model/mongodb/games')
const sqs = require('./services/aws').sqs

module.exports = async ({ league_id, game_ids, reply_to_channel }) => {
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
  const queueData = { game_ids: gameIdsToProcess, league_id }
  if (reply_to_channel) queueData.reply_to_channel = reply_to_channel
  await sqs.sendMessage(process.env.GAMES_QUEUE_URL, queueData)
  return { recorded_ids: gameIdsToProcess }
}

const { Model: Games } = require('./model/mongodb/games')
const sqs = require('./services/aws').sqs

module.exports = async (params) => {
  const { league_id, urls, reply_to_channel } = params
  const game_ids = urls.map((url) => url.split('?')[0].split('/').slice(-1)[0])
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

const { Model: Games } = require('./model/mongodb/games')
const { eventBridge, s3 } = require('./services/aws')
const { getReplayStream } = require('./services/ballchasing')
const wait = require('./util/wait')

const replayBucket = process.env.REPLAY_FILES_BUCKET

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
  const replays = []
  for (let id of gameIdsToProcess) {
    const uploadSource = 'ballchasing'
    const key = `${uploadSource}:${id}.replay`
    const replayData = await getReplayStream(id)
    await wait(1.5)
    await s3.upload(replayBucket, key, replayData)
    replays.push({
      id,
      upload_source: uploadSource,
      bucket: {
        source: replayBucket,
        key,
      },
    })
  }
  const detail = { game_ids: gameIdsToProcess, league_id, reply_to_channel }
  await eventBridge.emitEvent({
    type: 'MATCH_PROCESS_INIT',
    detail,
  })

  return { replays }
}

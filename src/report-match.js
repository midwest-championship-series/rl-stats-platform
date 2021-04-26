const { Model: Games } = require('./model/mongodb/games')
const { eventBridge, s3 } = require('./services/aws')
const { getReplayStream, getReplayIdsFromGroup } = require('./services/ballchasing')

const replayBucket = process.env.REPLAY_FILES_BUCKET

const getGameIds = async (urls) => {
  const gameIds = []
  for (let url of urls.map((url) => url.split('?')[0])) {
    if (url.match(/\/group\//g)) {
      const groupId = url.split('/group/')[1].split('/')[0]
      const ids = await getReplayIdsFromGroup(groupId)
      gameIds.push(...ids)
    } else if (url.match(/\/replay\//g)) {
      gameIds.push(url.split('/replay/')[1].split('/')[0])
    }
  }
  return gameIds
}

module.exports = async (params) => {
  const options = { urls: [], manual_reports: [] }
  const { league_id, urls, reply_to_channel, mentioned_team_ids } = { ...options, ...params }
  const manualReports = params.manual_reports || []
  const gameIds = await getGameIds(urls)
  const gameIdsToProcess = [...new Set(gameIds)]
  /**
   * if games with these ballchasing ids have already been reported, throw an error - we only want new games to
   * be reported with this mechanism. all other games should go through the reprocess-games function.
   */
  const replays = []
  for (let id of gameIdsToProcess) {
    /** @todo remove hardcoded ballchasing */
    const uploadSource = 'ballchasing'
    const key = `${uploadSource}:${id}.replay`
    const replayData = await getReplayStream(id)
    await s3.upload(replayBucket, key, replayData)
    replays.push({
      bucket: {
        source: replayBucket,
        key,
      },
      id,
      upload_source: uploadSource,
    })
  }
  replays.push(...manualReports.map((r) => ({ ...r, report_type: 'MANUAL_REPORT' })))
  const detail = {
    league_id,
    reply_to_channel,
    mentioned_team_ids,
    replays,
  }
  await eventBridge.emitEvent({
    type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
    detail,
  })
  if (gameIdsToProcess.length > 0) {
    /** @todo remove hardcoded ballchasing */
    /** @todo use rocket_league_id to dedup */
    /** @todo move this validation above the replay download/upload */
    const games = await Games.find({
      $or: gameIdsToProcess.map((id) => ({
        'replay_origin.source': 'ballchasing',
        'replay_origin.key': id,
      })),
    })
    if (games.length > 0) {
      throw new Error('games have already been reported - please use the !reprocess command')
    }
  }

  return detail
}

const reprocessGames = require('../src/reprocess-games')
const { reportError, sendToChannel } = require('../src/services/rl-bot')
require('../src/model/mongodb')

const handler = async (event) => {
  const { collection, params, reply_to_channel } = event.detail
  try {
    const res = await reprocessGames(collection, params)
    if (reply_to_channel) {
      await sendToChannel(reply_to_channel, `queued ${res.succeeded} matches for reprocessing`)
    }
  } catch (err) {
    console.error(err)
    await reportError(err, `error while reprocessing ${collection}`)
  }
}

module.exports = { handler }

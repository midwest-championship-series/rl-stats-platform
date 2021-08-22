const { s3 } = require('../src/services/aws')
const { sendToChannel } = require('../src/services/rl-bot')
const messageProcessor = require('../src/schemas/live-events')

const handler = async (trigger) => {
  const { LIVE_STATS_BUCKET, LIVE_STATS_CHANNEL_ID } = process.env
  for (let event of trigger.detail.events) {
    if (event.event === 'game:statfeed_event') {
      const message = messageProcessor(event)
      if (message) {
        await sendToChannel(LIVE_STATS_CHANNEL_ID, message)
      }
    }
  }
  await s3.uploadJSON(LIVE_STATS_BUCKET, `${Date.now()}.json`, trigger.detail)
}

module.exports = { handler }

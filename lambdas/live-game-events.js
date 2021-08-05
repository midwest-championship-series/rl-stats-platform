const { s3 } = require('../src/services/aws')
const { sendToChannel } = require('../src/services/rl-bot')
const messageProcessor = require('../src/schemas/live-events')

const handler = async (trigger) => {
  const { LIVE_STATS_BUCKET } = process.env
  const liveChannelId = '872581326832799786'
  for (let event of trigger.detail.events) {
    console.log('yyy', event)
    if (event.event === 'game:statfeed_event') {
      console.log('thing happened', event)
      await sendToChannel(liveChannelId, messageProcessor(event))
    }
  }
  await s3.uploadJSON(LIVE_STATS_BUCKET, `${Date.now()}.json`, trigger.detail)
  console.log('xxx', trigger)
}

module.exports = { handler }

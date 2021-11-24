require('../src/model/mongodb')
const reportGames = require('../src/report-match')
const { sendToChannel, reportError } = require('../src/services/rl-bot')

const handler = async (event) => {
  let messages
  if (event.Records) {
    messages = event.Records.map((r) => (typeof r.body === 'string' ? JSON.parse(r.body) : r.body))
  } else {
    messages = [event]
  }
  for (let data of messages) {
    try {
      console.info('processing report', data)
      const reportedGames = await reportGames(data)
      if (data.reply_to_channel) {
        const message = `${reportedGames.replays.length} games queued for processing`
        console.info(message)
        await sendToChannel(data.reply_to_channel, message)
      }
    } catch (err) {
      console.error(err)
      console.error('messages: ', JSON.stringify(messages))
      await reportError(err, 'error caught on initial match report', data.reply_to_channel)
    }
  }
}

module.exports = { handler }

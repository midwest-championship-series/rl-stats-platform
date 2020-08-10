require('../src/model/mongodb')
const processMatch = require('../src/process-match')
const { sendToChannel, reportError } = require('../src/services/rl-bot')
const { RecoverableError } = require('../src/util/errors')

const handler = async event => {
  const messages = event.Records.map(r => (typeof r.body === 'string' ? JSON.parse(r.body) : r.body))
  for (let message of messages) {
    try {
      const { match, teams } = await processMatch(message)
      const reportMessage = `successfully processed week ${match.week} match between ${teams
        .map(t => t.name)
        .join(' and ')}`
      if (message.reply_to_channel) {
        await sendToChannel(message.reply_to_channel, reportMessage)
      }
    } catch (err) {
      console.error(`error occurred while processing message:`, message, err)
      if (err instanceof RecoverableError) {
        throw err // this will put the message back on the queue for re-processing
      } else {
        if (!err.code) {
          // this is an error which we have not planned for
          await reportError(err)
        }
        if (message.reply_to_channel) {
          await sendToChannel(message.reply_to_channel, err.message)
        }
      }
    }
  }
}

module.exports = { handler }

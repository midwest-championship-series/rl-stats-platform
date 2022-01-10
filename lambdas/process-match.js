require('../src/model/mongodb')
const processMatch = require('../src/process-match')
const { sendToChannel, sendEmbedToChannel, reportError } = require('../src/services/rl-bot')
const { RecoverableError } = require('../src/util/errors')
const getSummary = require('../src/match-summary')
const stage = process.env.SERVERLESS_STAGE
const errorChannelId = process.env.ERROR_CHANNEL_ID

const handler = async (event) => {
  console.info('event', JSON.stringify(event))
  let messages
  if (event.Records) {
    messages = event.Records.map((r) => (typeof r.body === 'string' ? JSON.parse(r.body) : r.body))
  } else {
    messages = [event]
  }
  for (let message of messages) {
    try {
      const data = await processMatch(message)
      if (message.reply_to_channel) {
        await sendToChannel(
          message.reply_to_channel,
          `match ${data.match._id.toString()} processed successfully - match results posted to ${data.league.report_channel_ids
            .map((c) => `<#${c}>`)
            .join(', ')}`,
        )
        for (let channel of data.league.report_channel_ids) {
          if (stage === 'prod') {
            await sendEmbedToChannel(channel, getSummary(data))
          } else {
            console.info('stubbing embed send')
          }
        }
      }
    } catch (err) {
      const errContext = `encountered error while processing match with message: ${JSON.stringify(message, null, 2)}`
      console.error(`error occurred while processing message:`, errContext, err)
      if (err instanceof RecoverableError) {
        if (err.notice) {
          await sendToChannel(errorChannelId, err.notice)
        }
        throw err // this will put the message back on the queue for re-processing
      } else {
        await reportError(err, errContext, message.reply_to_channel)
      }
    }
  }
}

module.exports = { handler }

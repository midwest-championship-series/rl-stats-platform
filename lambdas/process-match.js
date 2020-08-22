require('../src/model/mongodb')
const processMatch = require('../src/process-match')
const { sendToChannel, sendEmbedToChannel, reportError } = require('../src/services/rl-bot')
const { RecoverableError } = require('../src/util/errors')
const getSummary = require('../src/match-summary')
const stage = process.env.SERVERLESS_STAGE

const handler = async event => {
  const messages = event.Records.map(r => (typeof r.body === 'string' ? JSON.parse(r.body) : r.body))
  for (let message of messages) {
    try {
      const data = await processMatch(message)
      if (message.reply_to_channel) {
        await sendToChannel(
          message.reply_to_channel,
          `match processed successfully - match results posted to ${data.league.report_channel_ids
            .map(c => `<#${c}>`)
            .join(', ')}`,
        )
        for (let channel of data.league.report_channel_ids) {
          if (stage === 'prod') {
            await sendEmbedToChannel(channel, getSummary(data))
          } else {
            console.log('stubbing embed send')
          }
        }
      }
      if (data.unlinkedPlayers.length > 0) {
        const { unlinkedPlayers, teams, match, league } = data
        let unlinkedPlayerReport = `unlinked players found in ${league.name} week ${
          match.week
        } match between ${teams.map(t => t.name).join(' and ')} match id: ${match._id}`
        unlinkedPlayers.forEach(p => {
          unlinkedPlayerReport += `\nname: ${p.name} !linkplayer ${p.platform}:${p.platform_id}`
        })
        await reportError(unlinkedPlayerReport)
      }
    } catch (err) {
      console.error(`error occurred while processing message:`, message, err)
      if (err instanceof RecoverableError) {
        throw err // this will put the message back on the queue for re-processing
      } else {
        if (!err.code || !message.reply_to_channel) {
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

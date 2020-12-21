require('../src/model/mongodb')
const reportGames = require('../src/report-games')
const { sendToChannel } = require('../src/services/rl-bot')

const handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body)
    console.info('processing report', data)
    const reportedGames = await reportGames(data)
    if (data.reply_to_channel) {
      const message = data.forfeit_team_id
        ? 'forfeit queued for processing'
        : `${reportedGames.recorded_ids.length} games queued for processing`
      await sendToChannel(data.reply_to_channel, message)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(reportedGames),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}

module.exports = { handler }

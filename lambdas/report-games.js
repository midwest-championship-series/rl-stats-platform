const reportGames = require('../src/report-games')
require('../src/model/mongodb')

const handler = async (event, context) => {
  try {
    const reportedGames = await reportGames(JSON.parse(event.body))
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

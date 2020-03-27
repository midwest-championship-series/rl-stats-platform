const reportGames = require('../src/report-games')

const handler = async (event, context) => {
  try {
    const games = await reportGames(JSON.parse(event.body))
    return {
      statusCode: 200,
      body: JSON.stringify(games),
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

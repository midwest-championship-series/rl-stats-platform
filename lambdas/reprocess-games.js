const reprocessGames = require('../src/reprocess-games')

const handler = async event => {
  try {
    const { queryStringParameters } = event
    const reportedGames = await reprocessGames(queryStringParameters)
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

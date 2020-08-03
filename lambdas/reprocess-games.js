const reprocessGames = require('../src/reprocess-games')
require('../src/model/mongodb')

const handler = async event => {
  try {
    const {
      queryStringParameters,
      pathParameters: { collection },
    } = event
    const reportedGames = await reprocessGames(collection, queryStringParameters)
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

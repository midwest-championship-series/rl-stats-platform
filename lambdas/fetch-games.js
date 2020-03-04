const fetchGames = require('../src/fetch-games')

const handler = async (event, context) => {
  const ranks = await fetchGames(event.queryStringParameters)
  return {
    statusCode: 200,
    body: JSON.stringify(ranks),
  }
}

module.exports = { handler }

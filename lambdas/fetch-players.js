const fetchPlayers = require('../src/fetch-players')

const handler = async (event, context) => {
  console.log('event', event.queryStringParameters)
  try {
    const players = await fetchPlayers(event.queryStringParameters)
    return {
      statusCode: 200,
      body: JSON.stringify(players),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    }
  }
}

module.exports = { handler }

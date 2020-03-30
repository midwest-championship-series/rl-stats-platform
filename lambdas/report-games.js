const reportGames = require('../src/report-games')
const games = require('../src/model/games')

const handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body)
    if (body.match_id) {
      body.game_ids = (await games.get({ criteria: { match_id: body.match_id } })).map(game => game.game_id)
    }
    const reportedGames = await reportGames(body)
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

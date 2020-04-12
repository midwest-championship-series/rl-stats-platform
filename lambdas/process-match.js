const processMatch = require('../src/process-match')

const handler = async event => {
  const messages = event.Records.map(r => JSON.parse(r.body))
  for (let message of messages) {
    const { match_id, game_ids } = await processMatch(message)
    console.log(`processed match: ${match_id}, games: ${game_ids.join(', ')}`)
  }
}

module.exports = { handler }

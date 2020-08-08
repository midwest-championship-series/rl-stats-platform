const processMatch = require('../src/process-match')
require('../src/model/mongodb')

const handler = async event => {
  const messages = event.Records.map(r => (typeof r.body === 'string' ? JSON.parse(r.body) : r.body))
  for (let message of messages) {
    const { match_id, game_ids } = await processMatch(message)
    console.log(`processed match: ${match_id}, games: ${game_ids.join(', ')}`)
  }
}

module.exports = { handler }

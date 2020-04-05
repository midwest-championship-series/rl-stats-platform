const processMatch = require('../src/process-match')

const handler = async event => {
  const messages = event.Records.map(r => JSON.parse(r.body))
  for (let message of messages) {
    const processedIds = await processMatch(message)
    console.log(`processed match: ${message.match_id}, games: ${processedIds.join(', ')}`)
  }
}

module.exports = { handler }

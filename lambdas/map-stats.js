const { reportError } = require('../src/services/rl-bot')
const { s3 } = require('../src/services/aws')
const map = require('../src/map')

const handler = async (event) => {
  try {
    const { parsed_replays } = event.detail
    const games = []
    for (let replay of parsed_replays) {
      const { source, key } = replay.bucket
      const { Body } = await s3.get(source, key)
      games.push(JSON.parse(Body))
    }
    await map(games)
  } catch (err) {
    console.error(err)
    await reportError(err, 'mapping match stats')
    throw err
  }
}

module.exports = { handler }

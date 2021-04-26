const reprocessGames = require('../src/reprocess-games')
const { reportError } = require('../src/services/rl-bot')
require('../src/model/mongodb')

const handler = async (event) => {
  const { collection, params } = event.detail
  try {
    await reprocessGames(collection, params)
  } catch (err) {
    console.error(err)
    await reportError(err, `error while reprocessing ${collection}`)
  }
}

module.exports = { handler }

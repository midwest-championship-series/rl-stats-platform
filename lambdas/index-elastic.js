const { indexDocs } = require('../src/services/elastic')
const aws = require('../src/services/aws')
const { reportError } = require('../src/services/rl-bot')
const schemas = require('../src/schemas')
const conform = require('../src/util/conform-schema')
const stage = process.env.SERVERLESS_STAGE
const indexes = [
  { name: 'team_games', keys: ['team_id', 'game_id_total'] },
  { name: 'player_games', keys: ['player_id', 'game_id_total'] },
]

const handler = async event => {
  let currentKey, currentSource
  try {
    const { key, source } = event.detail.bucket
    currentKey = key
    currentSource = source
    const s3Data = await aws.s3.get(source, key)
    const stats = JSON.parse(s3Data.Body)
    const { processedAt } = stats
    const responses = await Promise.all(
      indexes.map(({ name, keys }) => {
        const indexName = `${stage}_stats_${name}`
        const loadData = stats[name].map(s => {
          return { epoch_processed: processedAt, ...conform(s, schemas[name]) }
        })
        return indexDocs(loadData, indexName, keys)
      }),
    )
    const errors = responses.flatMap(item => item.errors || [])
    if (errors.length > 1) {
      console.error(errors)
      throw new Error(`${errors.length} errors occurred while indexing into elastic`)
    }
  } catch (err) {
    console.error(err)
    await reportError(
      err,
      `encountered error while indexing stats to elastic. key: ${currentKey}, source: ${currentSource}`,
    )
  }
}

module.exports = { handler }

const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '.google.creds.json')

const { query, load } = require('../src/services/bigquery')
const aws = require('../src/services/aws')
const { reportError } = require('../src/services/rl-bot')
const schemas = require('../src/schemas')
const conform = require('../src/util/conform-schema')
const tables = ['player_games', 'team_games']

const handler = async (event) => {
  let currentKey, currentSource
  try {
    const { key, source } = event.detail.bucket
    currentKey = key
    currentSource = source
    const s3Data = await aws.s3.get(source, key)
    const stats = JSON.parse(s3Data.Body)
    const { processedAt, matchId } = stats

    const responses = await Promise.all(
      tables.map((name) => {
        const loadData = stats[name].map((s) => {
          return { epoch_processed: processedAt, ...conform(s, schemas[name]) }
        })
        return load(loadData, name)
      }),
    )
    const errors = responses.flatMap((item) => item.errors || [])
    if (errors.length > 1) {
      console.error(errors)
      throw new Error(`${errors.length} errors occurred while indexing into bigquery`)
    }
    await Promise.all([
      tables.map((name) => {
        const where = `epoch_processed < ${processedAt} AND match_id = '${matchId}'`
        return query('DELETE', name, where)
      }),
    ])
    await aws.eventBridge.emitEvent({
      type: 'MATCH_BIGQUERY_STATS_LOADED',
      detail: { match_id: matchId },
    })
  } catch (err) {
    console.error(err)
    await reportError(
      err,
      `encountered error while indexing stats to bigquery. key: ${currentKey}, source: ${currentSource}`,
    )
  }
}

module.exports = { handler }

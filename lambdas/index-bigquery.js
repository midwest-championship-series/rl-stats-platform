const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '.google.creds.json')

const { query, load } = require('../src/services/bigquery')
const aws = require('../src/services/aws')
const { reportError } = require('../src/services/rl-bot')
const schemas = require('../src/schemas')
const conform = require('../src/util/conform-schema')
const { getS3Location } = require('../src/util/events/s3')

const handler = async event => {
  let currentKey, currentSource
  try {
    for (let record of event.Records) {
      const { key, source } = getS3Location(record)
      currentKey = key
      currentSource = source
      const s3Data = await aws.s3.get(source, key)
      const stats = JSON.parse(s3Data.Body)
      const { processedAt, matchId } = stats

      const tables = ['player_games', 'team_games']
      const [res1, res2] = await Promise.all(
        tables.map(name => {
          const loadData = stats[name].map(s => {
            return { epoch_processed: processedAt, ...conform(s, schemas[name]) }
          })
          return load(loadData, name)
        }),
      )
      const errors = []
        .concat(res1.errors)
        .concat(res2.errors)
        .filter(i => !!i)
      if (errors.length > 1) {
        console.error(errors)
        throw new Error(`${errors.length} errors occurred while indexing into bigquery`)
      }
      await Promise.all([
        tables.map(name => {
          const where = `epoch_processed < ${processedAt} AND match_id = '${matchId}'`
          return query('DELETE', name, where)
        }),
      ])
    }
  } catch (err) {
    console.error(err)
    await reportError(
      err,
      `encountered error while indexing stats to bigquery. key: ${currentKey}, source: ${currentSource}`,
    )
  }
}

module.exports = { handler }

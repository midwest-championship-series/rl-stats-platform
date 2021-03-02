const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '.google.creds.json')
const stage = process.env.SERVERLESS_STAGE
const datasetName = `${stage}_stats`

const aws = require('../src/services/aws')
const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()
const dataset = bigquery.dataset(datasetName)
const { reportError } = require('../src/services/rl-bot')
const { player_games, team_games } = require('../src/schemas')
const conform = require('../src/util/conform-schema')

const handler = async event => {
  let currentKey, currentSource
  try {
    for (let record of event.Records) {
      const source = record.s3.bucket.name
      // got the following line from: https://github.com/serverless/examples/blob/master/aws-node-s3-file-replicator/handler.js#L32
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
      currentKey = key
      currentSource = source
      const s3Data = await aws.s3.get(source, key)
      const stats = JSON.parse(s3Data.Body)
      const { playerStats, teamStats } = stats
      const tables = [
        {
          name: 'player_games',
          stats: playerStats,
          schema: player_games,
        },
        {
          name: 'team_games',
          stats: teamStats,
          schema: team_games,
        },
      ]
      return Promise.all(
        tables.map(config => {
          const table = dataset.table(config.name)
          const insert = config.stats.map(s => conform(s, config.schema))
          return table.insert(insert)
        }),
      ).then(([res1, res2]) => {
        const errors = [].concat(res1.errors).concat(res2.errors)
        if (errors.length > 1) {
          throw new Error(`${errors.length} errors occurred while indexing into bigquery`)
        }
      })
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

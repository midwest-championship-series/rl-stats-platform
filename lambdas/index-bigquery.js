const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '.google.creds.json')

const { query, load } = require('../src/services/bigquery')
const aws = require('../src/services/aws')
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
      const { playerStats, teamStats, processedAt, matchId } = stats

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
      const [res1, res2] = await Promise.all(
        tables.map(config => {
          const loadData = config.stats.map(s => {
            return { epoch_processed: processedAt, ...conform(s, config.schema) }
          })
          return load(loadData, config.name)
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
        tables.map(config => {
          const where = `epoch_processed < ${processedAt} AND match_id = '${matchId}'`
          return query('DELETE', config.name, where)
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

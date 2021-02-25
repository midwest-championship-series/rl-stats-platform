const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '.google.creds.json')

const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()
const dataset = bigquery.dataset('prod_stats')
const table = dataset.table('player_games')

const handler = async () => {
  const rows = await table.getRows()
  console.log(rows)
  await table.insert([{ player_id: '123' }])
  // const sets = await bigquery.getDatasets()
  // console.log(sets)
  // const tables = await sets[0].getTables()
  // console.log(await dataset.getTables())
}

module.exports = { handler }

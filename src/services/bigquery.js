const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '..', '.google.creds.json')

const writeNdJson = require('../util/ndjson')
const googleProjectId = process.env.GOOGLE_PROJECT_ID
const dataSetId = `${process.env.SERVERLESS_STAGE}_stats`
const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()
const dataset = bigquery.dataset(dataSetId)

const createTableName = (table) => {
  return [googleProjectId, dataSetId, table].join('.')
}

const query = (command, tableId, query) => {
  const refId = createTableName(tableId)
  const statement = `${command.toUpperCase()} FROM ${refId} WHERE ${query}`
  console.info('running query', statement)
  return dataset.query(statement)
}

const load = async (data, tableName) => {
  const table = dataset.table(tableName)
  const fileName = `/tmp/${Date.now()}.json`
  await writeNdJson(fileName, data)
  return table.load(fileName)
}

module.exports = {
  bigquery,
  dataset,
  dataSetId,
  query,
  load,
}

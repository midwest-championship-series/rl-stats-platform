const path = require('path')
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '..', '..', '.google.creds.json')

const dataSetId = `${process.env.SERVERLESS_STAGE}_stats`
const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()
const dataset = bigquery.dataset(dataSetId)

module.exports = {
  bigquery,
  dataset,
  dataSetId,
}

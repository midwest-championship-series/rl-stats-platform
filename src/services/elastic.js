const elastic = require('elasticsearch')

const connectionParams = {
  host: process.env[`STATS_ELASTIC_URL_${process.env.SERVERLESS_STAGE}`],
  apiVersion: '7.2',
  compression: 'gzip',
}
let connection

const getConnection = async () => {
  if (!connection) {
    connection = new elastic.Client({ ...connectionParams })
  }
  try {
    await connection.ping({ requestTimeout: 3000 })
  } catch (err) {
    connection = new elastic.Client({ ...connectionParams })
  }
  return connection
}

const indexDocs = async (documents, indexName) => {
  if (!documents || documents.length < 1) throw new Error('no documents to index')
  if (!indexName) throw new Error('indexDocs needs an index name')
  const indexCall = documents.reduce((acc, doc) => {
    const indexer = [{ index: { _index: indexName } }, doc]
    if (doc._id) {
      indexer[0].index._id = doc._id
    }
    return acc.concat(indexer)
  }, [])
  const conn = await getConnection()
  return conn.bulk(indexCall)
}

module.exports = {
  indexDocs,
}

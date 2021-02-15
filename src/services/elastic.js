const elastic = require('elasticsearch')

const connectionParams = {
  host: process.env.ELASTIC_HOST,
  apiVersion: '7.2',
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

const indexDocs = async (documents, indexName, idKeys) => {
  if (!documents || documents.length < 1) throw new Error('no documents to index')
  if (!indexName) throw new Error('indexDocs needs an index name')
  if (!idKeys || idKeys.length < 1) throw new Error('no id keys passed to elastic call')
  const body = documents.reduce((acc, doc) => {
    const _id = idKeys.map(key => doc[key]).join(':')
    console.log('indexing with', {
      index: { _id, _index: indexName },
    })
    const indexer = [
      {
        index: { _id, _index: indexName },
      },
      doc,
    ]
    return acc.concat(indexer)
  }, [])
  const conn = await getConnection()
  console.info(`indexing ${documents.length} documents to ${indexName} index`)
  return conn.bulk({ body })
}

module.exports = {
  indexDocs,
}

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
    const _id = idKeys
      .reduce((acc, key) => {
        if (!doc[key]) throw new Error(`document has no key: ${key}`)
        return acc.concat([key, doc[key]])
      }, [])
      .join(':')
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
  return conn.bulk({ refresh: true, body })
}

const search = async (index, body) => {
  try {
    const conn = await getConnection()
    const { hits: results, aggregations } = await conn.search(
      {
        index,
        body,
      },
      {
        ignore: [404],
        maxRetries: 3,
      },
    )
    return {
      total: results.total.value,
      returned: results.hits.length,
      hits: results.hits && results.hits.map(h => h._source),
      aggregations,
    }
  } catch (err) {
    throw formatError(err)
  }
}

const formatError = err => {
  return {
    source: 'elastic',
    statusCode: err.statusCode,
    message: err.message,
  }
}

const deleteByQuery = async query => {
  try {
    const conn = await getConnection()
    return conn.deleteByQuery({
      refresh: true,
      index: `${process.env.SERVERLESS_STAGE}_stats_*`,
      body: query,
    })
  } catch (err) {
    throw formatError(err)
  }
}

module.exports = {
  deleteByQuery,
  formatError,
  indexDocs,
  search,
}

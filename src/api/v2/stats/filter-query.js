const stage = process.env.SERVERLESS_STAGE

const { search } = require('../../../services/elastic')

module.exports = indexName => {
  return async (req, res, next) => {
    const params = req.query
    const query = {
      query: {
        bool: {
          filter: Object.entries(params).map(([key, value]) => {
            return { term: { [key]: value } }
          }),
        },
      },
    }
    console.log('query', query.query.bool)
    req.context = await search(`${stage}_stats_${indexName}`, query)
    next()
  }
}

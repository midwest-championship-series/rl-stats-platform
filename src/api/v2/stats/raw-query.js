const stage = process.env.SERVERLESS_STAGE

const { search } = require('../../../services/elastic')

module.exports = (indexName) => {
  return async (req, res, next) => {
    req.context = await search(`${stage}_stats_${indexName}`, req.body)
    next()
  }
}

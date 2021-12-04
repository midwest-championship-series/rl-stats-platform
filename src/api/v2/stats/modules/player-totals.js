const addLeagueFilters = require('./league-filters')
const { search } = require('../../../../services/elastic')
const stage = process.env.SERVERLESS_STAGE

module.exports = async (req, res, next) => {
  const filters = await addLeagueFilters(req.body)
  const groupings = req.body.groupings
  const stats = req.body.stats
  req.context = await search(`${stage}_stats_player_games`, buildQuery(filters, groupings, stats))
  next()
}

const buildQuery = (filters, groupings, stats) => {
  const aggs = stats.reduce((result, item) => {
    result[item] = { stats: { field: item } }
    return result
  }, {})
  return {
    size: 0,
    query: {
      bool: {
        filter: Object.entries(filters).map(([key, value]) => ({ term: { [key]: value } })),
      },
    },
    aggs,
  }
}

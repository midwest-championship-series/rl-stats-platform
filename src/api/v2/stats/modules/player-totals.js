const addLeagueFilters = require('./league-filters')
const { search } = require('../../../../services/elastic')
const stage = process.env.SERVERLESS_STAGE

module.exports = async (req, res, next) => {
  // console.log('query', req.query)
  console.log('body', req.body)
  const query = await addLeagueFilters(req.body)
  // console.log(query)
  req.context = await search(`${stage}_stats_player_games`, buildQuery(query))
  next()
}

const buildQuery = (filters) => {
  return {
    size: 0,
    query: {
      bool: {
        filter: Object.entries(filters).map(([key, value]) => ({ term: { [key]: value } })),
      },
    },
    aggs: {
      goals: {
        stats: {
          field: 'goals',
        },
      },
      assists: {
        stats: {
          field: 'assists',
        },
      },
      saves: {
        stats: {
          field: 'saves',
        },
      },
    },
  }
}

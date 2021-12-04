const { Teams } = require('../../../../model/mongodb')
const { search } = require('../../../../services/elastic')
const stage = process.env.SERVERLESS_STAGE

const returnFields = [
  { key: 'match_played', name: 'Matches Played', abbreviation: 'MP' },
  { key: 'match_wins', name: 'Match Wins', abbreviation: 'MW' },
  { key: 'match_losses', name: 'Matches Lost', abbreviation: 'ML' },
  { key: 'game_played', name: 'Games Played', abbreviation: 'GP' },
  { key: 'game_wins', name: 'Games Won', abbreviation: 'GW' },
  { key: 'game_losses', name: 'Games Lost', abbreviation: 'GL' },
  { key: 'game_diff', name: 'Game Diff', abbreviation: 'GaD' },
  { key: 'goal_for', name: 'Goals For', abbreviation: 'GF' },
  { key: 'goal_against', name: 'Goals Against', abbreviation: 'GA' },
  { key: 'goal_diff', name: 'Goal Diff', abbreviation: 'GoD' },
]

module.exports = async (req, res, next) => {
  const { season_id } = req.query
  if (!season_id) throw new Error('query parameter season_id is required')
  const results = await search(`${stage}_stats_team_games`, buildQuery(season_id))
  const teamResults = results.aggregations.standings.buckets
  const teams = await Teams.find({ _id: { $in: teamResults.map((t) => t.key) } })
  req.context = teamResults.map((r) => {
    const matchTeam = teams.find((t) => t._id.equals(r.key))
    if (!matchTeam) throw new Error(`no team found for id: ${r.key}`)
    return {
      team: matchTeam,
      stats: returnFields.reduce((result, field) => {
        return [
          ...result,
          {
            ...field,
            value: r[field.key].value,
          },
        ]
      }, []),
    }
  })
  next()
}

const buildQuery = (seasonId) => {
  return {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              'match_type.keyword': 'REG',
            },
          },
          {
            term: {
              'season_id.keyword': seasonId,
            },
          },
        ],
      },
    },
    aggs: {
      standings: {
        terms: {
          field: 'team_id.keyword',
          size: 100,
        },
        aggs: {
          match_played: {
            cardinality: {
              field: 'match_id.keyword',
              precision_threshold: 100000,
            },
          },
          match_wins: {
            cardinality: {
              field: 'match_id_win.keyword',
              precision_threshold: 100000,
            },
          },
          match_losses: {
            bucket_script: {
              buckets_path: {
                matchesPlayed: 'match_played',
                matchesWon: 'match_wins',
              },
              script: 'params.matchesPlayed - params.matchesWon',
            },
          },
          game_played: {
            cardinality: {
              field: 'game_id_total.keyword',
              precision_threshold: 100000,
            },
          },
          game_wins: {
            cardinality: {
              field: 'game_id_win_total.keyword',
              precision_threshold: 100000,
            },
          },
          game_losses: {
            bucket_script: {
              buckets_path: {
                gamesWon: 'game_wins',
                gamesPlayed: 'game_played',
              },
              script: 'params.gamesPlayed - params.gamesWon',
            },
          },
          game_diff: {
            bucket_script: {
              buckets_path: {
                gamesWon: 'game_wins',
                gamesLost: 'game_losses',
              },
              script: 'params.gamesWon - params.gamesLost',
            },
          },
          goal_for: {
            sum: {
              field: 'goals',
            },
          },
          goal_against: {
            sum: {
              field: 'goals_against',
            },
          },
          goal_diff: {
            bucket_script: {
              buckets_path: {
                goalsFor: 'goal_for',
                goalsAgainst: 'goal_against',
              },
              script: 'params.goalsFor - params.goalsAgainst',
            },
          },
          standings_sort: {
            bucket_sort: {
              sort: [
                { match_wins: { order: 'desc' } },
                { game_diff: { order: 'desc' } },
                { goal_diff: { order: 'desc' } },
              ],
            },
          },
        },
      },
    },
  }
}

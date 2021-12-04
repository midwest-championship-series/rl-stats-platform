const { Players, Leagues, Seasons, Matches, Games, Teams } = require('../../../../model/mongodb')

const keywords = [
  { key: 'league', model: Leagues, filter: 'league_id' },
  { key: 'season', model: Seasons, filter: 'season_id' },
  { key: 'match', model: Matches, filter: 'match_id' },
  { key: 'game', model: Games, filter: 'game_id' },
  { key: 'team', model: Teams, filter: 'team_id' },
  { key: 'player', model: Players, filter: 'player_id' },
]

module.exports = async (query) => {
  const { builtQuery, leagueQuery } = query.filters.reduce(
    (result, { property, value }) => {
      const keywordMatch = keywords.find((kw) => property.includes(`${kw.key}.`))
      if (keywordMatch) {
        if (!result.leagueQuery[keywordMatch.key]) result.leagueQuery[keywordMatch.key] = {}
        result.leagueQuery[keywordMatch.key][property.substr(keywordMatch.key.length + 1)] = value
      } else {
        result.builtQuery[property] = value
      }
      return result
    },
    { builtQuery: {}, leagueQuery: {} },
  )
  for (let kw of keywords) {
    if (!leagueQuery[kw.key]) continue
    const leagueDocs = await kw.model.find(leagueQuery[kw.key])
    if (leagueDocs.length > 1) {
      throw new Error(`multiple ${kw.key} found for query ${JSON.stringify(leagueQuery[kw.key])}`)
    }
    if (leagueDocs.length < 1) {
      throw new Error(`no ${kw.key} found for query ${JSON.stringify(leagueQuery[kw.key])}`)
    }
    builtQuery[kw.filter] = leagueDocs[0]._id.toHexString()
  }
  return builtQuery
}

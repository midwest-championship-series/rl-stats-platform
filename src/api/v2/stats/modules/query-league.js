const { Players } = require('../../../../model/mongodb')

const keywords = [{ key: 'player', model: Players, filter: 'player_id' }]

module.exports = async (query) => {
  const { builtQuery, leagueQuery } = Object.entries(query).reduce(
    (result, [key, value]) => {
      const keywordMatch = keywords.find((kw) => key.includes(`${kw.key}.`))
      if (keywordMatch) {
        if (!result.leagueQuery[keywordMatch.key]) result.leagueQuery[keywordMatch.key] = {}
        result.leagueQuery[keywordMatch.key][key.substr(keywordMatch.key.length + 1)] = value
      } else {
        result.builtQuery[key] = value
      }
      return result
    },
    { builtQuery: {}, leagueQuery: {} },
  )
  for (let kw of keywords) {
    if (!leagueQuery[kw.key]) return
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

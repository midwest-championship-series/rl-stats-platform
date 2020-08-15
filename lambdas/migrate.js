require('../src/model/mongodb')
const { Players, Teams, Games, Leagues, Matches } = require('../src/model/mongodb')

const unsetProperties = async (Model, properties) => {
  const $or = properties.map(p => ({ [p]: { $exists: true } }))
  const $unset = properties.reduce((result, property) => {
    result[property] = ''
    return result
  }, {})
  const { nModified } = await Model.update(
    {
      $or,
    },
    {
      $unset,
    },
    { multi: true, strict: false },
  )
  return nModified
}

const handler = async () => {
  const playersUpdated = await unsetProperties(Players, [
    'old_id',
    'old_league_id',
    'old_team_id',
    'league_id',
    'team_id',
  ])
  const gamesUpdated = await unsetProperties(Games, ['old_id', 'old_match_id'])
  const leaguesUpdated = await unsetProperties(Leagues, ['current_season'])
  const matchesModified = await unsetProperties(Matches, ['old_id', 'old_team_ids'])
  const teamsModified = await unsetProperties(Teams, ['league_id', 'old_id', 'old_league_id', 'league'])
  return { playersUpdated, gamesUpdated, leaguesUpdated, matchesModified, teamsModified }
}

module.exports = { handler }

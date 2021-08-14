const { Teams } = require('../model/mongodb')
const { getPlayerTeamsAtDate } = require('./common')
const { UnRecoverableError } = require('../util/errors')

const buildTeamsQueryFromPlayers = (players, matchDate) => {
  const teamIds = players.reduce((result, player) => {
    if (player.team_history && player.team_history.length > 0) {
      result.push(...getPlayerTeamsAtDate(player, matchDate).map((item) => item.team_id.toHexString()))
    }
    return result
  }, [])
  const unique = [...new Set(teamIds)]
  return { $or: unique.map((id) => ({ _id: id })) }
}

module.exports = async (players, matchDate) => {
  const teams = await Teams.find(buildTeamsQueryFromPlayers(players, matchDate))
  if (teams.length !== 2) {
    let errMsg = `expected to process match between two teams but got ${teams.length}.`
    if (teams.length > 0) errMsg += ` Teams:\n${teams.map((t) => `${t._id.toHexString()} ${t.name}`).join('\n')}`
    throw new UnRecoverableError('MATCH_TEAM_COUNT', errMsg)
  }
  return teams
  // return teams.filter((team) => seasonTeams.some((id) => id.equals(team._id)))
}

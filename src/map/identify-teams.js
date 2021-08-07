const { Teams } = require('../model/mongodb')
const { getPlayerTeamsAtDate } = require('./common')

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
  return teams
  // return teams.filter((team) => seasonTeams.some((id) => id.equals(team._id)))
}

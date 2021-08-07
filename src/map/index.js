const identifyPlayers = require('./identify-players')
const identifyTeams = require('./identify-teams')

module.exports = async (games) => {
  const context = {}
  context.players = await identifyPlayers(games)
  context.teams = await identifyTeams(context.players)
}

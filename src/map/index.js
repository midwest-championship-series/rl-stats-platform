const identifyPlayers = require('./identify-players')

module.exports = async (games) => {
  const dbPlayers = await identifyPlayers(games)
}

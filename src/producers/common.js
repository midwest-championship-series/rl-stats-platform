const combineStats = stats => ({
  ...stats.core,
  ...stats.boost,
  ...stats.movement,
  ...stats.positioning,
  ...stats.demo,
})

const getTeam = game => {
  return color => game[color]
}

const getTeamStats = (game, color) => {
  return combineStats(getTeam(game)(color).stats)
}

const getPlayerStats = player => combineStats(player.stats)

const reduceStats = ({ ownStats, game, modifiers, opponentStats }) => {
  return Object.keys(ownStats).reduce((memo, prop) => {
    let { inName, outName, out } = modifiers.find(m => m.inName === prop) || { inName: prop, outName: prop }
    if (!out) out = value => value
    memo[outName] = out(ownStats[inName], game)
    if (opponentStats) memo[`opponent_${outName}`] = out(opponentStats[inName], game)
    return memo
  }, {})
}

module.exports = { getTeamStats, getPlayerStats, reduceStats }

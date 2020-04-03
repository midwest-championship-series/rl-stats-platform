const { getTeamStats, reduceStats } = require('./common')

const processTeam = (game, color) => {
  const opponentColor = color === 'blue' ? 'orange' : 'blue'
  const ownStats = getTeamStats(game, color)
  const opponentStats = getTeamStats(game, opponentColor)
  const modifiers = [
    { inName: 'inflicted', outName: 'demos_inflicted' },
    { inName: 'taken', outName: 'demos_taken' },
    { inName: 'time_full_boost', outName: 'ms_full_boost', out: value => value * 1000 },
    { inName: 'time_zero_boost', outName: 'ms_zero_boost', out: value => value * 1000 },
  ]
  const stats = reduceStats({ ownStats, game, modifiers, opponentStats })
  return {
    team_id: game[color].team_id,
    opponent_team_id: game[opponentColor].team_id,
    team_color: color,
    match_id: game.match_id,
    game_id: game.id,
    wins: stats.goals > stats.opponent_goals ? 1 : 0,
    match_id_win: game[color].match_id_win,
    game_id_win: stats.goals > stats.opponent_goals ? game.id : undefined,
    ms_played: game.duration * 1000,
    ...stats,
  }
}

/**
 * processes each game to return stats for each team
 * returns stats for teams [blue, red] for a single game
 */
module.exports = game => {
  return ['blue', 'orange'].map(color => processTeam(game, color))
}

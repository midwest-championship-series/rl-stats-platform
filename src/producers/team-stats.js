const { getTeamStats, reduceStats } = require('./common')

const processTeam = (game, color) => {
  const opponentColor = color === 'blue' ? 'orange' : 'blue'
  const ownStats = getTeamStats(game, color)
  const opponentStats = getTeamStats(game, opponentColor)
  const modifiers = [
    { inName: 'inflicted', outName: 'demos_inflicted' },
    { inName: 'taken', outName: 'demos_taken' },
  ]
  const stats = reduceStats({ ownStats, game, modifiers, opponentStats })
  return {
    team_id: game[color].team_id,
    opponent_team_id: game[opponentColor].team_id,
    team_color: color,
    league_id: game.league_id,
    match_id: game.match_id,
    match_type: game.match_type,
    season: game.season,
    season_id: game.season_id,
    week: game.week,
    game_id: game.game_id,
    game_date: game.date,
    game_number: game.game_number.toString(),
    map_name: game.map_name,
    wins: stats.goals > stats.opponent_goals ? 1 : 0,
    match_id_win: game[color].match_id_win,
    game_id_win: stats.goals > stats.opponent_goals ? game.game_id : undefined,
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

const processTeam = (game, color) => {
  const opponentColor = color === 'blue' ? 'orange' : 'blue'
  const own = game[color].stats.core
  const opponentStats = game[opponentColor].stats.core
  return {
    team_id: game[color].team_id,
    opponent_team_id: game[opponentColor].team_id,
    team_color: color,
    match_id: game.match_id,
    game_id: game.id,
    wins: own.goals > own.goals_against ? 1 : 0,
    shots: own.shots,
    opponent_shots: own.shots_against,
    goals: own.goals,
    opponent_goals: own.goals_against,
    saves: own.saves,
    opponent_saves: opponentStats.saves,
    assists: own.assists,
    opponent_assists: opponentStats.assists,
    score: own.score,
    opponent_score: opponentStats.score,
  }
}

/**
 * processes each game to return stats for each team
 * returns stats for teams [blue, red] for a single game
 */
module.exports = game => {
  return ['blue', 'orange'].map(color => processTeam(game, color))
}

const processTeam = (game, color) => {
  const opponentColor = color === 'blue' ? 'orange' : 'blue'
  const own = game[color].stats
  const opponent = game[opponentColor].stats
  return {
    team_id: game[color].team_id,
    opponent_team_id: game[opponentColor].team_id,
    team_color: color,
    match_id: game.match_id,
    game_id: game.id,
    wins: own.core.goals > own.core.goals_against ? 1 : 0,
    match_id_win: game[color].match_id_win,
    game_id_win: own.core.goals > own.core.goals_against ? game.id : undefined,
    shots: own.core.shots,
    opponent_shots: own.core.shots_against,
    goals: own.core.goals,
    opponent_goals: own.core.goals_against,
    saves: own.core.saves,
    opponent_saves: opponent.core.saves,
    assists: own.core.assists,
    opponent_assists: opponent.core.assists,
    score: own.core.score,
    opponent_score: opponent.core.score,
    demos_inflicted: own.demo.inflicted,
    demos_taken: own.demo.taken,
  }
}

/**
 * processes each game to return stats for each team
 * returns stats for teams [blue, red] for a single game
 */
module.exports = game => {
  return ['blue', 'orange'].map(color => processTeam(game, color))
}

const processPlayer = (game, player) => {
  const core = player.stats.core
  const teamStats = game[player.team_color].stats.core
  const opponentTeamStats = game[player.opponent_color].stats.core
  return {
    player_id: player.league_id,
    screen_name: player.name,
    team_id: player.team_id,
    team_color: player.team_color,
    opponent_team_id: player.opponent_team_id,
    match_id: game.match_id,
    game_id: game.id,
    match_id_win: game[player.team_color].match_id_win,
    wins: teamStats.goals > opponentTeamStats.goals ? 1 : 0,
    shots: core.shots,
    goals: core.goals,
    saves: core.saves,
    assists: core.assists,
    score: core.score,
    // mvps: core.mvp ? 1 : 0,
  }
}

module.exports = game =>
  ['blue', 'orange'].reduce(
    (result, color) =>
      result.concat(
        game[color].players
          .filter(player => !!player.league_id)
          .map(player => {
            player.team_color = color
            player.opponent_color = color === 'blue' ? 'orange' : 'blue'
            return processPlayer(game, player)
          }),
      ),
    [],
  )

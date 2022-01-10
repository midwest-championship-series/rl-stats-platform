const { getPlayerStats, getTeamStats, reduceStats, getMatchGameId } = require('./common')

const processPlayer = (game, player, processedAt) => {
  const ownStats = getPlayerStats(player)
  const modifiers = [
    { inName: 'inflicted', outName: 'demos_inflicted' },
    { inName: 'taken', outName: 'demos_taken' },
  ]
  const opponentStats = getTeamStats(game, player.opponent_team_color)
  const stats = reduceStats({ ownStats, game, modifiers, opponentStats })
  const playerTeamWon = game.winning_team_id.equals(player.team_id)
  return {
    epoch_processed: processedAt,
    player_id: player.league_id,
    player_name: player.name,
    player_platform: player.id.platform,
    player_platform_id: player.id.id,
    screen_name: player.name,
    team_id: player.team_id,
    team_name: player.team_name,
    team_color: player.team_color,
    opponent_team_id: player.opponent_team_id,
    opponent_team_name: player.opponent_team_name,
    opponent_team_color: player.opponent_team_color,
    league_name: game.league_name,
    league_id: game.league_id,
    match_id: game.match_id,
    match_type: game.match_type,
    season_name: game.season_name,
    season_id: game.season_id,
    week: game.week,
    games_played: 1,
    game_id: game.game_id,
    game_number: game.game_number.toString(),
    game_date: game.date,
    map_name: game.map_name,
    match_id_win: game[player.team_color].match_id_win,
    game_id_total: getMatchGameId(game.match_id, game.game_number),
    game_id_win_total: playerTeamWon ? getMatchGameId(game.match_id, game.game_number) : undefined,
    game_id_win: playerTeamWon ? game.game_id : undefined,
    game_id_overtime_game: game.overtime ? game.game_id : undefined,
    overtime_seconds_played: game.overtime && game.overtime_seconds > 0 ? game.overtime_seconds : undefined,
    wins: playerTeamWon ? 1 : 0,
    ms_played: (player.end_time - player.start_time) * 1000,
    ...stats,
  }
}

module.exports = (game, processedAt) => {
  if (game.report_type === 'MANUAL_REPORT') return []
  const gameData = game.raw_data
  // assign stats to each player
  const colors = ['blue', 'orange']
  const playerStats = colors.reduce(
    (result, color) =>
      result.concat(
        gameData[color].players.map((player) => {
          player.team_color = color
          player.opponent_team_color = player.team_color === 'blue' ? 'orange' : 'blue'
          return processPlayer(gameData, player, processedAt)
        }),
      ),
    [],
  )
  // assign match mvp
  const winners = playerStats.filter((p) => p.wins > 0)
  const mvpScore = Math.max(...winners.map((p) => p.score))
  playerStats.forEach((p) => {
    if (p.wins > 0) {
      p.mvps = p.score === mvpScore ? 1 : 0
    } else {
      p.mvps = 0
    }
  })
  // console.log(playerStats.map((s) => s.opponent_goals))
  // return only players which have ids in our system
  return playerStats
}

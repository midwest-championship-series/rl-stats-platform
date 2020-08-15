const { getTeamStats, getPlayerStats, reduceStats } = require('./common')

const processPlayer = (game, player) => {
  const teamStats = getTeamStats(game, player.team_color)
  const opponentTeamStats = getTeamStats(game, player.opponent_color)
  const ownStats = getPlayerStats(player)
  const modifiers = [
    { inName: 'inflicted', outName: 'demos_inflicted' },
    { inName: 'taken', outName: 'demos_taken' },
  ]
  const stats = reduceStats({ ownStats, game, modifiers })
  return {
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
    league_id: game.league_id,
    match_id: game.match_id,
    match_type: game.match_type,
    season: game.season,
    season_id: game.season_id,
    week: game.week,
    game_id: game.game_id,
    game_number: game.game_number.toString(),
    game_date: game.date,
    map_name: game.map_name,
    match_id_win: game[player.team_color].match_id_win,
    game_id_win: game.winning_team_id.equals(player.team_id) ? game.game_id : undefined,
    wins: game.winning_team_id.equals(player.team_id) ? 1 : 0,
    ms_played: (player.end_time - player.start_time) * 1000,
    ...stats,
  }
}

module.exports = game => {
  // assign stats to each player
  const colors = ['blue', 'orange']
  const playerStats = colors.reduce(
    (result, color) =>
      result.concat(
        game[color].players.map(player => {
          player.team_color = color
          player.opponent_color = color === 'blue' ? 'orange' : 'blue'
          return processPlayer(game, player)
        }),
      ),
    [],
  )
  // assign match mvp
  const winners = playerStats.filter(p => p.wins > 0)
  const mvpScore = Math.max(...winners.map(p => p.score))
  playerStats.forEach(p => {
    if (p.wins > 0) {
      p.mvps = p.score === mvpScore ? 1 : 0
    } else {
      p.mvps = 0
    }
  })
  // return only players which have ids in our system
  return playerStats
}

const { getTeamStats, reduceStats, getMatchGameId } = require('./common')

const processTeam = (game, color, time) => {
  const opponentColor = color === 'blue' ? 'orange' : 'blue'
  const ownStats = getTeamStats(game, color)
  const opponentStats = getTeamStats(game, opponentColor)
  const modifiers = [
    { inName: 'inflicted', outName: 'demos_inflicted' },
    { inName: 'taken', outName: 'demos_taken' },
  ]
  const stats = reduceStats({ ownStats, game, modifiers, opponentStats })
  const teamWon = game.winning_team_id.equals(game[color].team._id)
  return {
    epoch_processed: time,
    team_id: game[color].team._id.toHexString(),
    team_name: game[color].team.name,
    opponent_team_id: game[opponentColor].team._id.toHexString(),
    opponent_team_name: game[opponentColor].team.name,
    team_color: color,
    league_name: game.league_name,
    league_id: game.league_id,
    match_id: game.match_id,
    match_type: game.match_type,
    season_name: game.season_name,
    season_id: game.season_id,
    week: game.week,
    game_id: game.game_id,
    games_played: 1,
    game_date: game.date,
    game_number: game.game_number.toString(),
    map_name: game.map_name,
    wins: teamWon ? 1 : 0,
    match_id_win: game[color].match_id_win,
    game_id_win: teamWon ? game.game_id : undefined,
    game_id_total: getMatchGameId(game.match_id, game.game_number),
    game_id_win_total: teamWon ? getMatchGameId(game.match_id, game.game_number) : undefined,
    game_id_overtime_game: game.overtime ? game.game_id : undefined,
    overtime_seconds_played: game.overtime && game.overtime_seconds > 0 ? game.overtime_seconds : undefined,
    ms_played: game.duration * 1000,
    ...stats,
  }
}

/**
 * processes each game to return stats for each team
 * returns stats for teams [blue, red] for a single game
 */
module.exports = (game, processedAt) => {
  return ['blue', 'orange'].map(color => processTeam(game, color, processedAt))
}

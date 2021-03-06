const { getPlayerTeamsAtDate, getMatchGameId } = require('./common')

module.exports = (params, processedAt) => {
  const { league, season, match, teams, players, forfeit_date } = params
  const context = {
    epoch_processed: processedAt,
    league_id: league._id.toHexString(),
    league_name: league.name,
    season_id: season._id.toHexString(),
    season_name: season.name,
    match_type: season.season_type,
    match_id: match._id.toHexString(),
    week: match.week,
    game_id: undefined,
    game_id_win: undefined,
    game_date: forfeit_date.toISOString(),
    game_number: undefined,
    map_name: undefined,
    games_played: undefined,
  }
  const teamStats = genTeamStats(params, context)

  return {
    teamStats,
    playerStats: genPlayerStats(forfeit_date, teamStats, players),
  }
}

const genTeamStats = (params, context) => {
  const { match, teams, forfeit_team_id } = params
  const teamStats = []
  /**
   * best of condition ensures that there are 2 team-game records per game, one for each team, and that
   * the number of forfeited games is correct
   */
  const bestOfCondition = Math.ceil(match.best_of / 2) * 2
  for (let i = 0; i < bestOfCondition; i++) {
    const team = teams[i % 2]
    const opponent = teams[(i + 1) % 2]
    const gameNumber = Math.floor(i / 2) + 1
    const forfeitId = getMatchGameId(match._id.toHexString(), gameNumber)
    teamStats.push({
      ...context,
      team_id: team._id.toHexString(),
      team_name: team.name,
      opponent_team_id: opponent._id.toHexString(),
      opponent_team_name: opponent.name,
      match_id_win: team._id.toHexString() !== forfeit_team_id ? match._id.toHexString() : undefined,
      game_id_total: forfeitId,
      game_id_forfeit_win: team._id.toHexString() !== forfeit_team_id ? forfeitId : undefined,
      game_id_win_total: team._id.toHexString() !== forfeit_team_id ? forfeitId : undefined,
      wins: team._id.toHexString() === forfeit_team_id ? 0 : 1,
    })
  }
  return teamStats
}

const genPlayerStats = (forfeit_date, teamStats, players) => {
  const playerStats = []
  teamStats.forEach(teamStat => {
    players.forEach(player => {
      if (getPlayerTeamsAtDate(player, forfeit_date).some(history => history.team_id.equals(teamStat.team_id))) {
        playerStats.push({
          ...teamStat,
          player_id: player._id.toHexString(),
          player_name: player.screen_name,
        })
      }
    })
  })
  return playerStats
}

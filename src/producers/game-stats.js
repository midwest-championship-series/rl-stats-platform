module.exports = game => ({
  game_id: game.id,
  match_id: game.match_id,
  league_id: game.league_id,
  date_time_played: game.date,
  date_time_processed: new Date().toISOString(),
})

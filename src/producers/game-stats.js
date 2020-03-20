module.exports = game => ({
  game_id: game.id,
  date_time_played: game.date,
  date_time_processed: new Date().toISOString(),
})

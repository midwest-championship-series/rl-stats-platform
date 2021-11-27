module.exports = (game, { league, season, match }) => {
  game.raw_data.game_id = game._id.toHexString()
  game.raw_data.match_id = match._id.toHexString()
  game.raw_data.match_type = match.match_type
  game.raw_data.week = match.week
  game.raw_data.season_name = match.season.name
  game.raw_data.season_id = season._id.toHexString()
  game.raw_data.league_name = league.name
  game.raw_data.league_id = league._id.toHexString()
  game.raw_data.report_type = game.report_type || 'REPLAY_LINK'

  if (!game.raw_data.orange || !game.raw_data.blue) {
    game.raw_data.orange = {}
    game.raw_data.blue = {}
  }
  return
}

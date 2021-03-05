const types = require('../types')

module.exports = [
  { name: 'epoch_processed', type: types.INT, skipOpponent: true },
  { name: 'league_name', type: types.STR, skipOpponent: true },
  { name: 'league_id', type: types.STR, skipOpponent: true },
  { name: 'match_id', type: types.STR, skipOpponent: true },
  { name: 'match_type', type: types.STR, skipOpponent: true },
  { name: 'season_name', type: types.STR, skipOpponent: true },
  { name: 'season_id', type: types.STR, skipOpponent: true },
  { name: 'week', type: types.INT, skipOpponent: true },
  { name: 'game_id', type: types.STR, skipOpponent: true },
  { name: 'game_date', type: types.TIME, skipOpponent: true },
  { name: 'game_number', type: types.STR, skipOpponent: true },
  { name: 'map_name', type: types.STR, skipOpponent: true },
  { name: 'game_id_total', type: types.STR, skipOpponent: true },
  { name: 'match_id_win', type: types.STR },
  { name: 'game_id_win', type: types.STR },
  { name: 'game_id_forfeit_win', type: types.STR },
  { name: 'game_id_forfeit_loss', type: types.STR },
]

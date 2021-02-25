const types = require('./types')

module.exports = [
  { name: 'team_id', type: types.STR },
  { name: 'team_name', type: types.STR },
  { name: 'team_color', type: types.STR },
  { name: 'league_name', type: types.STR },
  { name: 'league_id', type: types.STR },
  { name: 'match_id', type: types.STR },
  { name: 'match_type', type: types.STR },
  { name: 'season_name', type: types.STR },
  { name: 'season_id', type: types.STR },
  { name: 'week', type: types.INT },
  { name: 'game_id', type: types.STR },
  { name: 'game_date', type: types.TIME },
  { name: 'game_number', type: types.STR },
  { name: 'map_name', type: types.STR },
  { name: 'match_id_win', type: types.STR },
  { name: 'game_id_win', type: types.STR },
  { name: 'game_id_forfeit_win', type: types.STR },
  { name: 'game_id_forfeit_loss', type: types.STR },
]

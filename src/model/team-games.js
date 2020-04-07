const Table = require('../services/google')
const { MNCS } = require('./constants')()

module.exports = new Table('teamGames', MNCS.spreadsheetId, MNCS.teamGames, ['team_id', 'game_id'])

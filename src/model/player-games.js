const Table = require('../services/google')
const { MNCS } = require('./constants')()

module.exports = new Table('playerGames', MNCS.spreadsheetId, MNCS.playerGames, ['player_id', 'game_id'])

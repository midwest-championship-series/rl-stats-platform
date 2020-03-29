const Table = require('../services/google')
const { MNCS } = require('./constants')

module.exports = new Table('games', MNCS.spreadsheetId, MNCS.games, ['game_id'])

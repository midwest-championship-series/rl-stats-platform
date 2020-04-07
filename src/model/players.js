const Table = require('../services/google')
const { MNCS } = require('./constants')()

module.exports = new Table('players', MNCS.spreadsheetId, MNCS.players)

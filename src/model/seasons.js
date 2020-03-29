const Table = require('../services/google')
const { MNCS } = require('./constants')

module.exports = new Table('seasons', MNCS.spreadsheetId, MNCS.seasons)

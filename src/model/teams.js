const Table = require('../services/google')
const { MNCS } = require('./constants')

module.exports = new Table('teams', MNCS.spreadsheetId, MNCS.teams)

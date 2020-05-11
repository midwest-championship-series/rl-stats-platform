const Table = require('../../services/google')
const { MNCS } = require('./constants')()

module.exports = new Table('schedule', MNCS.spreadsheetId, MNCS.schedule)

const Table = require('../../services/google')
const { MNRL } = require('./constants')()

module.exports = new Table('members', MNRL.spreadsheetId, MNRL.members)

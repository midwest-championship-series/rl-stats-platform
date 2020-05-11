const Table = require('../../services/google')
const { MNCS } = require('./constants')()

const leagues = new Table('games', MNCS.spreadsheetId, MNCS.leagues)
leagues.addPopulation({ table: 'schedules', localField: 'id', foreignField: 'league_id', as: 'schedule' })

module.exports = leagues

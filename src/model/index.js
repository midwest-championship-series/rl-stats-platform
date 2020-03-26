const { registerModel, tables } = require('../services/google')

const MNCS = {
  spreadsheetId: process.env.MNCS_STAT_SHEET_ID,
  teams: '1167027768',
  players: '494574480',
  games: '628902249',
  teamGames: '966495728',
  playerGames: '1992851802',
}

const MNRL = {
  spreadsheetId: process.env.MNRL_SHEET_ID,
  members: '427844088',
  apiKeys: '1197702560',
}

registerModel('teams', MNCS)
registerModel('players', MNCS)
registerModel('games', MNCS)
registerModel('teamGames', MNCS)
registerModel('playerGames', MNCS)
registerModel('members', MNRL)

module.exports = tables

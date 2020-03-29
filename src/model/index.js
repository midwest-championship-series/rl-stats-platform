const Table = require('../services/google')

const MNCS = {
  spreadsheetId: process.env.MNCS_STAT_SHEET_ID,
  teams: '1167027768',
  players: '494574480',
  games: '628902249',
  schedule: '1647203076',
  teamGames: '966495728',
  playerGames: '1992851802',
  matchGames: '1364518865',
  seasons: '465615763',
}

const MNRL = {
  spreadsheetId: process.env.MNRL_SHEET_ID,
  members: '427844088',
  apiKeys: '1197702560',
}

const registerModel = (name, tableRegistry) => new Table(name, tableRegistry.spreadsheetId, tableRegistry[name])

module.exports = {
  teams: registerModel('teams', MNCS),
  players: registerModel('players', MNCS),
  games: registerModel('games', MNCS),
  teamGames: registerModel('teamGames', MNCS),
  playerGames: registerModel('playerGames', MNCS),
  matchGames: registerModel('matchGames', MNCS),
  schedule: registerModel('schedule', MNCS),
  seasons: registerModel('seasons', MNCS),
  members: registerModel('members', MNRL),
}

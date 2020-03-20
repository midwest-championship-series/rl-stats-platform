const { registerModel, tables } = require('../services/google')

registerModel('teams', '1167027768')
registerModel('players', '494574480')
registerModel('games', '628902249')
registerModel('teamGames', '966495728')
registerModel('playerGames', '1992851802')

module.exports = tables

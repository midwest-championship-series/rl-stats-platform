const { Players } = require('../model/mongodb')

module.exports = async (games) => {
  const accountIds = new Set([
    ...games.flatMap((game) => {
      return game.players.map((player) => player.id.id)
    }),
  ])
  console.log(accountIds)
}

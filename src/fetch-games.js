const ballchasing = require('./services/ballchasing')

module.exports = async query => {
  const { list } = await ballchasing.getReplays(query)

  return list.filter(game => {
    const players =
      game.blue &&
      game.blue.players &&
      game.orange &&
      game.orange.players &&
      game.blue.players.concat(game.orange.players)
    /** @TODO need to improve this filter to make sure all players have a match with our schedule */

    return players && players.some(p => p.id.platform === 'xbox')
  })
}

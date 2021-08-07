const { Players } = require('../model/mongodb')

module.exports = (games) => {
  const accounts = games
    .flatMap((game) => {
      return game.players
    })
    .reduce((result, player) => {
      const platform = player.id.platform.toLowerCase()
      const platform_id = player.id.id
      if (!result.find((p) => p.platform === platform && p.platform_id === platform_id)) {
        result.push({ platform, platform_id, name: player.name })
      }
      return result
    }, [])
  const query = {
    $or: accounts.map((p) => {
      return { accounts: { $elemMatch: p } }
    }),
  }
  return Players.find(query)
}

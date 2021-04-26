require('../src/model/mongodb')
const { Games } = require('../src/model/mongodb')

const handler = async () => {
  const games = await Games.find({ ballchasing_id: { $exists: true } })
  games.forEach((game) => {
    game.replay_origin = {
      source: 'ballchasing',
      key: game.ballchasing_id,
    }
  })
  for (let game of games) {
    await game.save()
  }
  console.log(`saved ${games.length} games`)
}

module.exports = { handler }

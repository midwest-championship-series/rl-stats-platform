const fs = require('fs')
const path = require('path')
const { Games } = require('../src/model/mongodb')
const { getReplayData } = require('../src/services/ballchasing')
const wait = require('../src/util/wait')

const handler = async () => {
  const games = await Games.find({ 'replay_origin.key': { $exists: true }, rl_game_id: { $exists: false } })
  for (let game of games) {
    try {
      const [data] = await getReplayData([game.replay_origin.key])
      await game.update({ $set: { rl_game_id: data.rocket_league_id } })
      console.log(`updated game ${game._id}`)
      await wait(1)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = { handler }

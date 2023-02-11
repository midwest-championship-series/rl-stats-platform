const fs = require('fs')
const path = require('path')
const { Players } = require('../../src/model/mongodb')

const handler = async () => {
  const players = await Players.find({
    team_history: { $elemMatch: { date_joined: { $exists: true }, date_left: { $exists: false } } },
  })
  for (let player of players) {
    player.team_history.forEach((history) => {
      if (!history.date_left) {
        history.date_left = new Date()
      }
    })
    console.info('saving', player.screen_name)
    await player.save()
  }
}

module.exports = { handler }

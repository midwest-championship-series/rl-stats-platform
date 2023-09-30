const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players } = require('../src/model/mongodb')

const handler = async () => {
  const players = await Players.find({
    team_history: {
      $elemMatch: {
        date_left: { $exists: false },
      },
    },
  })

  console.log('modifying players:', players.length)
  for (let player of players) {
    player.team_history.forEach((item) => {
      if (!item.date_left) {
        item.date_left = new Date('2023-08-01T06:00:00.535+00:00')
      }
    })

    await player.save()
  }
  console.log('DONE!')
}

module.exports = { handler }

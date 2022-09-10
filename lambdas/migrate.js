const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players } = require('../src/model/mongodb')

const handler = async () => {
  const minDate = new Date('2022-06-15T22:22:17.938+00:00')
  const players = await Players.find({
    'team_history.date_joined': { $gte: minDate },
  })
  console.log('players', players.length)
  for (let player of players) {
    const historyToUpdate = player.team_history.filter((h) => h.date_joined > minDate)
    historyToUpdate.forEach((item) => {
      item.date_joined = new Date('2022-07-20T22:22:17.938+00:00')
    })
    await player.save()
  }
}

module.exports = { handler }

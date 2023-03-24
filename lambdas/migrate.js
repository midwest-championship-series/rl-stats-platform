const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players } = require('../src/model/mongodb')

const handler = async () => {
  const joinDate = new Date('2023-03-01T00:00:00.535+00:00')
  const players = await Players.find({ team_history: { $elemMatch: {
    date_left: {$exists: false},
    date_joined: { $gt: joinDate }
  }}})
  for (let player of players) {
    // console.log(player)
    const dateItem = player.team_history.find(item => {
      return item.date_joined > joinDate && !item.date_left
    })
    dateItem.date_joined = joinDate
    await player.save()
    console.log(player.screen_name, dateItem)

  }
}

module.exports = { handler }

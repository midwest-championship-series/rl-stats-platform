const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players, Franchises } = require('../src/model/mongodb')

const theDate = new Date('2023-10-01T06:24:56.573+00:00')

const handler = async () => {
  const players = await Players.find({
    'team_history.date_joined': { $gte: theDate },
  })
  for (let player of players) {
    const toUpdate = player.team_history.find((h) => {
      return new Date(h.date_joined) > theDate
    })
    if (toUpdate) {
      toUpdate.date_joined = theDate
      console.log(player.screen_name)
      await player.save()
    }
  }
  console.log('DONE')
}

module.exports = { handler }

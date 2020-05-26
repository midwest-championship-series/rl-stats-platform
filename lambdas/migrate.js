require('../src/model/mongodb')
const { Model: Players } = require('../src/model/mongodb/players')

const handler = async () => {
  const players = await Players.find({ team_id: { $exists: true } })
  for (let player of players) {
    player.team_history = [{ team_id: player.team_id, date_joined: new Date('March 21, 2020 00:00:00') }]
    console.log('saving', player.screen_name)
    await player.save()
  }

  return { updatedPlayers: players.length }
}

module.exports = { handler }

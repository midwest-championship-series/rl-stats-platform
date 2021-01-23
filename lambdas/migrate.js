require('../src/model/mongodb')
const { Players } = require('../src/model/mongodb')

const handler = async () => {
  const s2StartDate = new Date('2020-07-01T03:23:24.269+00:00')
  const s2LastGameDate = new Date('2020-10-11T20:48:15.000+00:00')
  const s3DraftDate = new Date('2020-12-17T00:00:00.807+00:00')

  const players = await Players.find()
  for (let player of players) {
    player.team_history.forEach(h => {
      if (h.date_joined < s2LastGameDate) {
        h.date_left = s2LastGameDate
      }
      if (h.date_joined > s3DraftDate) {
        h.date_joined = s3DraftDate
      }
    })
    await player.save()
  }
}

module.exports = { handler }

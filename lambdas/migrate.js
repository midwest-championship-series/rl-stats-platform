require('../src/model/mongodb')
const { Leagues } = require('../src/model/mongodb')

const handler = async () => {
  const leagues = await Leagues.find({})
  for (let league of leagues) {
    league.report_channel_ids = ['746431144442069134']
    await league.save()
  }
}

module.exports = { handler }

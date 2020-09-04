require('../src/model/mongodb')
const { Leagues } = require('../src/model/mongodb')
const { Seasons } = require('../src/model/mongodb')

const handler = async () => {
  console.log('beginning migration')
  let [nsi] = await Leagues.find({ name: 'nsi' }).populate('seasons')
  let season1 = nsi && nsi.seasons[0]
  if (!nsi) {
    console.log('no nsi found')
    season1 = new Seasons({
      match_ids: [],
      name: '1',
      season_type: 'TRN',
    })
    nsi = new Leagues({
      command_channel_ids: ['751320476231663647'],
      report_channel_ids: ['746431144442069134'],
      season_ids: [season1._id],
      name: 'nsi',
      urls: [
        {
          _id: '5f3b43e844d99c00082965e3',
          name: 'stats',
          url: 'https://datastudio.google.com/s/gYDmjMXTvZk',
        },
        {
          _id: '5f3b43e844d99c00082965e4',
          name: 'logo',
          url: 'https://cdn.discordapp.com/attachments/692994579305332806/744778007314563092/mncs_logo_clear.webp',
        },
        {
          _id: '5f3b43e844d99c00082965e5',
          name: 'twitch',
          url: 'https://www.twitch.tv/mnchampionshipseries',
        },
      ],
    })
  }
  console.log('saving data')
  await nsi.save()
  await season1.save()
  console.log(season1._id)
  console.log('finished')
}

module.exports = { handler }

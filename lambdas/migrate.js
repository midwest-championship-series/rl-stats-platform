require('../src/model/mongodb')
const { Leagues } = require('../src/model/mongodb')

const handler = async () => {
  const [mncs] = await Leagues.find({ name: 'mncs' })
  const [clmn] = await Leagues.find({ name: 'clmn' })
  mncs.urls = [
    { name: 'stats', url: 'https://datastudio.google.com/s/gYDmjMXTvZk' },
    {
      name: 'logo',
      url: 'https://cdn.discordapp.com/attachments/692994579305332806/744778007314563092/mncs_logo_clear.webp',
    },
    {
      name: 'twitch',
      url: 'https://www.twitch.tv/mnchampionshipseries',
    },
  ]
  clmn.urls = [
    { name: 'stats', url: 'https://datastudio.google.com/s/pnBKdF95Vg8' },
    {
      name: 'logo',
      url: 'https://cdn.discordapp.com/attachments/692994579305332806/744778007314563092/mncs_logo_clear.webp',
    },
    {
      name: 'twitch',
      url: 'https://www.twitch.tv/mnchampionshipseries',
    },
  ]
  await mncs.save()
  await clmn.save()
}

module.exports = { handler }

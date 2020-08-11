require('../src/model/mongodb')
const { Model: Leagues } = require('../src/model/mongodb/leagues')
const { Model: Players } = require('../src/model/mongodb/players')

const handler = async () => {
  const [mncs] = await Leagues.find({ name: 'mncs' })
  const [clmn] = await Leagues.find({ name: 'clmn' })

  mncs.command_channel_ids = ['690623402993778698']
  clmn.command_channel_ids = ['688299597801848841']

  await mncs.save()
  await clmn.save()

  const [tero] = await Players.find({ screen_name: 'Tero' })
  tero.permissions = ['all-owner']
  await tero.save()
}

module.exports = { handler }

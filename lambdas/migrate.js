const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players, Franchises } = require('../src/model/mongodb')

const handler = async () => {
  const newFranchises = [
    {
      name: 'Des Moines Derecho',
      discord_id: '1150229977921507428',
    },
    {
      name: 'Chicago Jungle',
      discord_id: '1150229908367343667',
    },
    {
      name: 'Fargo Steelhawks',
      discord_id: '1151692005047541820',
    },
    {
      name: 'Omaha Buffalo',
      discord_id: '1151691993609678950',
    },
  ]

  for (let franchise of newFranchises) {
    const [dupe] = await Franchises.find({ discord_id: franchise.discord_id })
    if (!dupe) {
      console.log('creating...', franchise.name)
      await Franchises.create(franchise)
    } else {
      console.log('dupe found - skipping', franchise.name)
    }
  }
}

module.exports = { handler }

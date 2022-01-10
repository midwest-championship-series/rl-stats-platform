const fs = require('fs')
const path = require('path')
const { Matches, Seasons } = require('../src/model/mongodb')

const handler = async () => {
  const matches = await Matches.find({ match_type: { $exists: false } })
  console.info(`updating ${matches.length} matches`)
  for (let match of matches) {
    match.match_type = 'REG'
    console.info(`saving ${match._id}`)
    await match.save()
  }
  // const seasons = await Seasons.find({ season_type: { $exists: true } })
  // for (let season of seasons) {
  //   await Seasons.updateOne({ _id: season._id }, { $unset: { season_type: '' } })
  // }
  const seasonsUpdate = await Seasons.updateMany({ season_type: { $exists: true } }, { $unset: { season_type: 1 } })
  return { matches: matches.length, seasons: seasonsUpdate }
}

module.exports = { handler }

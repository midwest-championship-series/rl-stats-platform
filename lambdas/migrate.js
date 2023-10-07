const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players, Franchises } = require('../src/model/mongodb')

const handler = async () => {
  const seasons = await Seasons.find().populate({ path: 'matches' })
  console.log('reworking ', seasons.length, 'seasons')
  for (let season of seasons) {
    season.start_date = season.matches[0].scheduled_datetime
    const reversed = season.matches.reverse()
    season.end_date = reversed[0].scheduled_datetime
    season.regular_season_weeks = reversed[0].week
    console.log(`---- season ${season.name} -- _id:${season._id} ----`)
    console.log(season.start_date)
    console.log(season.end_date)
    console.log(season.regular_season_weeks)
    await season.save()
  }
}

module.exports = { handler }

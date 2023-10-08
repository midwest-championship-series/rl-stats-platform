const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players, Franchises } = require('../src/model/mongodb')

const handler = async () => {
  const seasons = await Seasons.find().populate({ path: 'matches' })
  console.log('reworking ', seasons.length, 'seasons')
  for (let season of seasons) {
    if (!season.start_date || !season.end_date || !season.regular_season_weeks) {
      console.log(season._id, season.start_date, season.end_date, season.regular_season_weeks)
    }
  }
}

module.exports = { handler }

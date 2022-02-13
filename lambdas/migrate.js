const fs = require('fs')
const path = require('path')
const compareIds = require('../src/util/compare-ids')
const { Matches, Leagues, Seasons } = require('../src/model/mongodb')
const handler = async () => {
  const leagues = await Leagues.find({ $or: [{ name: 'mncs' }, { name: 'clmn' }, { name: 'mnrs' }] }).populate({
    path: 'current_season',
    populate: {
      path: 'matches',
    },
  })

  for (let league of leagues) {
    console.log('adjusting', league.name)
    if (league.current_season) {
      for (let match of league.current_season.matches) {
        console.log('match!')
        await match.remove()
      }
      await league.current_season.remove()
    }
    league.season_ids = league.season_ids.filter((s) => !compareIds(s._id, league.current_season_id))
    console.log(league.current_season_id, league.seasons)
    await league.save()
  }
}

module.exports = { handler }

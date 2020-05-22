require('../src/model/mongodb')
const { Model: Leagues } = require('../src/model/mongodb/leagues')

const handler = async () => {
  console.log('adjusting data')
  const leagues = await Leagues.find().populate({
    path: 'seasons',
    populate: { path: 'matches' },
  })
  for (let league of leagues) {
    const currentSeason = league.seasons.find(s => s._id.equals(league.current_season_id))
    if (!currentSeason) throw new Error(`no current season found for league: ${league.name}`)
    const sortedMatches = currentSeason.matches.sort((a, b) => a.week - b.week)
    league.current_week = sortedMatches.find(m => m.status !== 'closed').week
    await league.save()
  }
  console.log('finished adjusting')
}

module.exports = { handler }

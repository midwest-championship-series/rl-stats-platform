require('../src/model/mongodb')
const { Model: Leagues } = require('../src/model/mongodb/leagues')

const handler = async () => {
  console.log('adjusting data')
  const leagues = await Leagues.find().populate({
    path: 'seasons',
    populate: { path: 'matches' },
  })
  for (let league of leagues) {
    const [currentSeason] = league.seasons.slice(-1)
    if (!currentSeason) throw new Error(`no current season found for league: ${league.name}`)
    const sortedMatches = currentSeason.matches.sort((a, b) => a.week - b.week)
    league.current_week = sortedMatches.find(m => m.status !== 'closed').week
    league.current_season_id = currentSeason._id
    await league.save()
  }
  console.log('finished adjusting')
}

module.exports = { handler }

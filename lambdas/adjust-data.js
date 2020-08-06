require('../src/model/mongodb')
const { Model: Leagues } = require('../src/model/mongodb/leagues')
const { Model: Teams } = require('../src/model/mongodb/teams')

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
    for (let season of league.seasons) {
      season.team_ids = season.matches.reduce((result, match) => {
        for (let id of match.team_ids) {
          if (!result.some(x => x.equals(id))) {
            result.push(id)
          }
        }
        return result
      }, [])
      season.player_ids = season.matches.reduce((result, match) => {
        if (match.players_to_teams) {
          for (let id of match.players_to_teams) {
            if (!result.some(x => x.equals(id))) {
              result.push(id)
            }
          }
        }
        return result
      }, [])
      await season.save()
    }
  }
  console.log('finished adjusting')
}

module.exports = { handler }

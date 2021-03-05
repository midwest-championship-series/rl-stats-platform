require('../src/model/mongodb')
const { Model: Leagues } = require('../src/model/mongodb/leagues')
const { Model: Teams } = require('../src/model/mongodb/teams')

const handler = async () => {
  console.info('adjusting data')
  const leagues = await Leagues.find().populate({
    path: 'seasons',
    populate: { path: 'matches' },
  })
  for (let league of leagues) {
    const currentSeason = league.seasons.find(s => s._id.equals(league.current_season_id))
    if (!currentSeason) throw new Error(`no current season found for league: ${league.name}`)
    const sortedMatches = currentSeason.matches.sort((a, b) => a.week - b.week)
    const lastPlayedMatch = sortedMatches.find(m => m.status !== 'closed')
    league.current_week = (lastPlayedMatch && lastPlayedMatch.week) || sortedMatches.reverse()[0].week
    await league.save()
    for (let season of league.seasons) {
      const allTeams = season.matches.reduce((result, match) => {
        for (let id of match.team_ids) {
          if (!result.some(x => x.equals(id))) {
            result.push(id)
          }
        }
        return result
      }, [])
      const allPlayers = season.matches.reduce((result, match) => {
        if (match.players_to_teams) {
          for (let map of match.players_to_teams) {
            const playerId = map.player_id
            if (playerId && !result.some(x => x.equals(playerId))) {
              result.push(playerId)
            }
          }
        }
        return result
      }, [])
      season.team_ids = [...allTeams]
      season.player_ids = [...allPlayers]
      await season.save()
    }
  }
  console.info('finished adjusting')
}

module.exports = { handler }

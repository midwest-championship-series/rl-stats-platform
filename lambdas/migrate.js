require('../src/model/mongodb')
const { Model: Matches } = require('../src/model/mongodb/matches')
const { Model: Teams } = require('../src/model/mongodb/teams')
const { Model: Leagues } = require('../src/model/mongodb/leagues')
const { Model: Seasons } = require('../src/model/mongodb/seasons')
const schedule = require('./schedule')

const handler = async () => {
  // get mncs league and team-name map
  const [mncs] = await Leagues.find({ name: 'mncs' }).populate({
    path: 'seasons',
    populate: { path: 'teams' },
  })
  for (let season of mncs.seasons) {
    await season.populate('matches').execPopulate()
  }
  const mncsTeams = mncs.seasons[0].teams
  const mncsTeamToId = mncsTeams.reduce((result, team) => {
    return {
      ...result,
      [team.name.toLowerCase()]: team._id,
    }
  }, {})
  let season2 = mncs.seasons.find(s => s.name === '2')
  if (!season2) {
    season2 = await Seasons.create({
      name: '2',
      season_type: 'REG',
      match_ids: [],
    })
    mncs.season_ids.push(season2._id)
    await mncs.save()
  }
  const mncsMatchesToCreate = []
  schedule.mncs.forEach((week, index) => {
    const weekNum = index + 1
    week.forEach(match => {
      const teamIds = match.teams.map(t => mncsTeamToId[t.toLowerCase()])
      if (teamIds.length !== 2)
        throw new Error(`teams not found to match teams ${match.teams.map(t => t.name).join(', ')}`)
      if (season2.matches) {
        const stringIds = teamIds.map(id => id.toHexString())
        const existingMatch = season2.matches.find(m => {
          return m.week === weekNum && m.team_ids.every(id => stringIds.includes(id.toHexString()))
        })
        if (existingMatch) return
      }
      mncsMatchesToCreate.push({
        week: weekNum,
        team_ids: teamIds,
        best_of: 5,
      })
    })
  })
  const mncsMatches = await Matches.create(mncsMatchesToCreate)
  season2.match_ids = season2.match_ids.concat((mncsMatches && mncsMatches.map(m => m._id)) || [])
  await season2.save()
  console.log('created MNCS matches', mncsMatches && mncsMatches.length)

  // clmn
  let [clmn] = await Leagues.find({ name: 'clmn' }).populate({
    path: 'seasons',
    populate: { path: 'matches' },
  })
  if (!clmn) {
    clmn = await Leagues.create({
      name: 'clmn',
      current_season: '2',
      current_week: '1',
    })
    const clmnSeason = await Seasons.create({
      name: '2',
      season_type: 'REG',
      match_ids: [],
    })
    clmn.current_season_id = clmnSeason._id
    clmn.season_ids = [clmnSeason._id]
    await clmn.save()
    await clmn.populate('seasons').execPopulate()
  }
  const clmnSeason = clmn.seasons[0]
  const clmnTeams = await Teams.find({ name: { $in: schedule.clmnTeams } })
  if (clmnTeams.length !== 12) throw new Error(`clmn teams not equal to 12, instead ${clmnTeams.length}`)
  const clmnTeamToId = clmnTeams.reduce((result, team) => {
    return {
      ...result,
      [team.name.toLowerCase()]: team._id,
    }
  }, {})
  const clmnMatchesToCreate = []
  schedule.clmn.forEach((week, index) => {
    const weekNum = index + 1
    week.forEach(match => {
      const teamIds = match.teams.map(t => clmnTeamToId[t.toLowerCase()])
      if (clmnSeason.matches) {
        const stringIds = teamIds.map(id => id.toHexString())
        const existingMatch = clmnSeason.matches.find(m => {
          return m.week === weekNum && m.team_ids.every(id => stringIds.includes(id.toHexString()))
        })
        if (existingMatch) return
      }
      clmnMatchesToCreate.push({
        week: weekNum,
        team_ids: teamIds,
        best_of: 5,
      })
    })
  })
  const clmnMatches = await Matches.create(clmnMatchesToCreate)
  clmnSeason.match_ids = clmnSeason.match_ids.concat((clmnMatches && clmnMatches.map(m => m._id)) || [])
  await clmnSeason.save()
  console.log('created CLMN matches', clmnMatches && clmnMatches.length)
}

module.exports = { handler }

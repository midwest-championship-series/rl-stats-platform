const fs = require('fs')
const path = require('path')
const { Matches, Leagues, Seasons } = require('../src/model/mongodb')

const parseSchedule = (fileName) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', fileName)))
}

const formatMatches = (schedule) => {
  return schedule.map((match) => {
    return new Matches({
      team_ids: [match.team_1_id, match.team_2_id],
      players_to_teams: [],
      week: match.week,
      best_of: 5,
      scheduled_datetime: new Date(`${match.scheduled_date} ${match.scheduled_time}`),
    })
  })
}

const createSchedule = async (leagueName, seasonName, schedule) => {
  const matches = formatMatches(schedule)
  const league = await Leagues.findOne({ name: leagueName }).populate('seasons')
  const newSeason = league.seasons.find((s) => s.name === seasonName)
  if (newSeason.match_ids.length < 1) {
    for (let match of matches) {
      await match.save()
      newSeason.match_ids.push(match._id)
    }
    await newSeason.save()
    console.log(`${league.name} season ${seasonName} updated`)
  }
}

const handler = async () => {
  const newSeasonName = '4'
  // make sure season exists
  const leagues = await Leagues.find({
    $or: [{ name: 'mncs' }, { name: 'clmn' }, { name: 'mnrs' }],
  }).populate('seasons')
  for (let league of leagues) {
    let newSeason = league.seasons.find((s) => s.name === newSeasonName)
    if (!newSeason) {
      console.log(`${league.name} has no season ${newSeasonName}`)
      newSeason = new Seasons({
        name: newSeasonName,
        season_type: 'REG',
        match_ids: [],
      })
      await newSeason.save()
      league.season_ids.push(newSeason._id)
    }
    league.current_season_id = newSeason._id
    await league.save()
  }

  await createSchedule('mncs', newSeasonName, parseSchedule('mncs.json'))
  await createSchedule('clmn', newSeasonName, parseSchedule('clmn.json'))
  await createSchedule('mnrs', newSeasonName, parseSchedule('mnrs.json'))
}

module.exports = { handler }

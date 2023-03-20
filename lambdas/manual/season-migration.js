const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons } = require('../../src/model/mongodb')

const parseSchedule = async (fileName) => {
  const importPath = path.join(__dirname, '..', '..', 'temp', fileName)
  console.log('importing', importPath)
  return csv().fromFile(importPath)
}

const formatMatches = (schedule) => {
  return schedule.map((match) => {
    const datetime = new Date(`${match.scheduled_date} ${match.scheduled_time}`)
    datetime.setHours(datetime.getHours() - 1)
    return new Matches({
      team_ids: [match.team_1_id, match.team_2_id],
      players_to_teams: [],
      match_type: 'REG',
      week: match.week,
      best_of: 5,
      scheduled_datetime: datetime,
    })
  })
}

const createSchedule = async (leagueName, seasonName, schedule) => {
  console.log(`formatting ${leagueName} matches`)
  const matches = formatMatches(schedule)
  const league = await Leagues.findOne({ name: leagueName }).populate('seasons')
  const newSeason = league.seasons && league.seasons.find((s) => s.name === seasonName)
  if (newSeason.match_ids.length < 1) {
    for (let match of matches) {
      console.log('saving match', match._id)
      await match.save()
      newSeason.match_ids.push(match._id)
    }
    await newSeason.save()
    console.log(`${league.name} season ${seasonName} updated`)
  } else {
    console.log('season already has', newSeason.match_ids.length, 'matches')
  }
}

const handler = async () => {
  const newSeasonName = '7'
  // make sure season exists
  console.log('getting leagues')
  const leagues = await Leagues.find({
    $or: [{ name: 'Premier' }, { name: 'Challenger' }, { name: 'RisingStar' }, { name: 'Prospect' }],
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

  const schedules = [
    { name: 'Premier', schedule: await parseSchedule('MNCS Season 7 Schedule - Premier Schedule.csv') },
    { name: 'Challenger', schedule: await parseSchedule('MNCS Season 7 Schedule - Challenger Schedule.csv') },
    { name: 'RisingStar', schedule: await parseSchedule('MNCS Season 7 Schedule - Rising Star Schedule.csv') },
    { name: 'Prospect', schedule: await parseSchedule('MNCS Season 7 Schedule - Prospect Schedule.csv') },
  ]

  for (let schedule of schedules) {
    await createSchedule(schedule.name, newSeasonName, schedule.schedule)
  }
}

module.exports = { handler }

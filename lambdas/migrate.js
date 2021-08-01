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
  const [mnrs] = await Leagues.find({ name: 'mnrs' }).populate({
    path: 'current_season',
    populate: {
      path: 'matches',
    },
  })
  for (let match of mnrs.current_season.matches) {
    if (match.team_ids.some((id) => id.equals('600c97cceedc0d0008211463'))) {
      const newTeams = match.team_ids.filter((id) => !id.equals('600c97cceedc0d0008211463'))
      newTeams.push('600c98b3eedc0d0008211469')
      match.team_ids = newTeams
      await match.save()
    }
  }
  console.log('finished')
}

module.exports = { handler }

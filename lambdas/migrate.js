require('../src/model/mongodb')
const { ObjectID } = require('bson')
const fs = require('fs')
const path = require('path')
const { Teams, Matches, Leagues, Seasons } = require('../src/model/mongodb')

const mncsSchedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'mncs-schedule.json')))
const clmnSchedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'clmn-schedule.json')))

const getTeams = schedule => {
  const teamIds = [
    ...new Set(
      schedule.reduce((acc, item) => {
        acc.push(item.team_1_id)
        acc.push(item.team_2_id)
        return acc
      }, []),
    ),
  ]
  return Teams.find({
    _id: { $in: teamIds },
  })
}

const formatMatches = schedule => {
  return schedule.map((match, index) => {
    return new Matches({
      team_ids: [match.team_1_id, match.team_2_id],
      players_to_teams: [],
      week: Math.floor(index / 5) + 1,
      best_of: 5,
      scheduled_datetime: match.scheduled_date
        ? new Date(`${match.scheduled_date} ${match.scheduled_time}`)
        : undefined,
    })
  })
}

const createSchedule = async (leagueName, schedule) => {
  const matches = formatMatches(schedule)
  const league = await Leagues.findOne({ name: leagueName }).populate('seasons')
  const season3 = league.seasons.find(s => s.name === '3')
  if (season3.match_ids.length < 1) {
    for (let match of matches) {
      await match.save()
      season3.match_ids.push(match._id)
    }
    await season3.save()
    console.log(`${league.name} season 3 updated`)
  }
}

const getCityName = teamName => {
  const splitName = teamName.toLowerCase().split(' ')
  return splitName.splice(0, splitName.length - 1).join(' ')
}

const handler = async () => {
  // make sure season 3 exists
  const leagues = (await Leagues.find().populate('seasons')).filter(l => ['mncs', 'clmn 1', 'clmn 2'].includes(l.name))
  for (let league of leagues) {
    let s3 = league.seasons.find(s => s.name === '3')
    if (!s3) {
      console.log(`${league.name} has no season 3`)
      const s3 = new Seasons({
        name: '3',
        season_type: 'REG',
        match_ids: [],
      })
      await s3.save()
      league.season_ids.push(s3._id)
    }
    league.current_season_id = s3._id
    await league.save()
  }

  // ingest mncs season 3 schedule
  const mncsTeams = await getTeams(mncsSchedule)

  for (let team of mncsTeams) {
    if (!team.franchise_id) {
      team.franchise_id = new ObjectID()
    }
    await team.save()
  }
  await createSchedule('mncs', mncsSchedule)

  // ingest clmn season 3
  const clmnTeams = await getTeams(clmnSchedule)

  for (let team of clmnTeams) {
    if (!team.franchise_id) {
      const teamCity = getCityName(team.name)
      const parentTeam = mncsTeams.find(t => getCityName(t.name) === teamCity)
      if (!parentTeam) throw new Error(`no parent found for ${team.name}. teamCity: ${teamCity}`)
      team.franchise_id = parentTeam.franchise_id
      await team.save()
    }
  }

  await createSchedule('clmn 1', clmnSchedule)

  const clmn2Teams = await Teams.find({
    _id: {
      $in: [
        '600c98b22c38930008d9cbd5',
        '600c98b2eedc0d0008211466',
        '600c98b22c38930008d9cbd6',
        '600c98b2eedc0d0008211467',
        '600c98b32c38930008d9cbd7',
        '600c98b3eedc0d0008211468',
        '600c98b32c38930008d9cbd8',
        '600c98b32c38930008d9cbd9',
        '600c98b3eedc0d0008211469',
        '600c8fc9f87c0c000826a31e',
      ],
    },
  })
  for (let team of clmn2Teams) {
    if (!team.franchise_id) {
      const teamCity = getCityName(team.name)
      const parentTeam = mncsTeams.find(t => getCityName(t.name) === teamCity)
      if (!parentTeam) throw new Error(`no parent found for ${team.name}`)
      team.franchise_id = parentTeam.franchise_id
      await team.save()
    }
  }

  const clmn2Schedule = mncsSchedule.map(match => {
    const team1Franchise = mncsTeams.find(team => team._id.equals(match.team_1_id)).franchise_id
    const team2Franchise = mncsTeams.find(team => team._id.equals(match.team_2_id)).franchise_id
    const team1ClmnTeam = clmn2Teams.find(team => team.franchise_id.equals(team1Franchise))
    const team2ClmnTeam = clmn2Teams.find(team => team.franchise_id.equals(team2Franchise))
    if (!team1ClmnTeam) console.log('no team found for franchise id', team1Franchise)
    if (!team2ClmnTeam) console.log('no team found for franchise id', team2Franchise)
    const returnMatch = {
      ...match,
      team_1: team1ClmnTeam.name,
      team_2: team2ClmnTeam.name,
      team_1_id: team1ClmnTeam._id,
      team_2_id: team2ClmnTeam._id,
    }
    delete returnMatch.scheduled_date
    delete returnMatch.scheduled_time
    return returnMatch
  })
  await createSchedule('clmn 2', clmn2Schedule)
}

module.exports = { handler }

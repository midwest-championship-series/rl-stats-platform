const tables = {
  teams: require('../model/mongodb/teams'),
  players: require('../model/mongodb/players'),
  games: require('../model/mongodb/games'),
  members: require('../model/mongodb/members'),
  // schedules: require('../model/mongodb/schedules'),
  leagues: {
    get: async () => {
      const [leagueData, scheduleData] = await Promise.all([
        require('../model/sheets/leagues').get({ json: true }),
        require('../model/sheets/schedules').get({ json: true }),
      ])
      leagueData.forEach(league => {
        league.schedule = scheduleData.filter(s => s.league_id === league.id)
      })
      return leagueData
    },
  },
  'player-games': require('../model/sheets/player-games'),
  'team-games': require('../model/sheets/team-games'),
}

module.exports = {
  tables,
  GET: ({ table, queryStringParameters }) => tables[table].get({ criteria: queryStringParameters, json: true }),
  PUT: ({ table, body }) => {
    console.log(body)
    return tables[table].add({ data: body[table], json: true })
  },
}

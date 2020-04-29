const tables = {
  teams: require('../model/teams'),
  players: require('../model/players'),
  games: require('../model/games'),
  members: require('../model/members'),
  schedules: require('../model/schedules'),
  leagues: {
    get: async () => {
      const leagueData = await require('../model/leagues').get({ json: true })
      const scheduleData = await require('../model/schedules').get({ json: true })
      leagueData.forEach(league => {
        league.schedule = scheduleData.filter(s => s.league_id === league.id)
      })
      return leagueData
    },
  },
  'player-games': require('../model/player-games'),
  'team-games': require('../model/team-games'),
}

module.exports = {
  tables,
  GET: ({ table, queryStringParameters }) => tables[table].get({ criteria: queryStringParameters, json: true }),
  PUT: ({ table, body }) => {
    return tables[table].add({ data: body[table], json: true })
  },
}

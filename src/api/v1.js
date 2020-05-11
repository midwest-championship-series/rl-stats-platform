const tables = {
  teams: require('../model/sheets/teams'),
  players: require('../model/sheets/players'),
  games: require('../model/sheets/games'),
  members: require('../model/sheets/members'),
  schedules: require('../model/sheets/schedules'),
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
    return tables[table].add({ data: body[table], json: true })
  },
}

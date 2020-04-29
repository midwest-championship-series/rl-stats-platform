const filteredGetter = (model, criteria) => {
  return model.get({
    criteria: { ...criteria, league_id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3' },
    json: true,
  })
}

const tables = {
  teams: {
    get: ({ criteria }) => filteredGetter(require('../model/teams'), criteria),
  },
  players: {
    get: ({ criteria }) => filteredGetter(require('../model/players'), criteria),
  },
  games: {
    get: ({ criteria }) => filteredGetter(require('../model/games'), criteria),
  },
  members: require('../model/members'),
  schedules: {
    get: ({ criteria }) => filteredGetter(require('../model/schedules'), criteria),
  },
  'player-games': {
    get: ({ criteria }) => filteredGetter(require('../model/player-games'), criteria),
  },
  'team-games': {
    get: ({ criteria }) => filteredGetter(require('../model/team-games'), criteria),
  },
  leagues: {
    get: async () => {
      const leagueData = await require('../model/leagues').get({
        criteria: { id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3' },
        json: true,
      })
      const scheduleData = await require('../model/schedules').get({
        criteria: { league_id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3' },
        json: true,
      })
      leagueData.forEach(league => {
        league.schedule = scheduleData.filter(s => s.league_id === league.id)
      })
      return leagueData
    },
  },
}

module.exports = {
  tables,
  GET: ({ table, queryStringParameters }) => tables[table].get({ criteria: queryStringParameters, json: true }),
  PUT: ({ table, body }) => {
    return tables[table].add({ data: body[table], json: true })
  },
}

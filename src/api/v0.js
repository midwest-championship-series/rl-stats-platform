const filteredGetter = (model, criteria) => {
  return model.get({
    criteria: { ...criteria, league_id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3' },
    json: true,
  })
}

const tables = {
  teams: {
    get: ({ criteria }) => filteredGetter(require('../model/sheets/teams'), criteria),
  },
  players: {
    get: ({ criteria }) => filteredGetter(require('../model/sheets/players'), criteria),
  },
  games: {
    get: ({ criteria }) => filteredGetter(require('../model/sheets/games'), criteria),
  },
  members: require('../model/sheets/members'),
  schedules: {
    get: ({ criteria }) => filteredGetter(require('../model/sheets/schedules'), criteria),
  },
  'player-games': {
    get: ({ criteria }) => filteredGetter(require('../model/sheets/player-games'), criteria),
  },
  'team-games': {
    get: ({ criteria }) => filteredGetter(require('../model/sheets/team-games'), criteria),
  },
  leagues: {
    get: async () => {
      const leagueData = await require('../model/sheets/leagues').get({
        criteria: { id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3' },
        json: true,
      })
      const scheduleData = await require('../model/sheets/schedules').get({
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

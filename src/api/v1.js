const tables = {
  teams: require('../model/sheets/teams'),
  players: {
    get: async ({ criteria }) => {
      const players = await require('../model/mongodb/players').get({ criteria })
      const [mncs] = await require('../model/mongodb/leagues').get({ criteria: { name: 'mncs' } })
      return players.map(p => ({
        ...p.toJSON(),
        id: p._id,
        league_id: mncs._id,
      }))
    },
  },
  games: require('../model/sheets/games'),
  members: require('../model/sheets/members'),
  schedules: require('../model/sheets/schedules'),
  leagues: {
    get: async () => {
      const leagues = await require('../model/mongodb/leagues').Model.aggregate([
        { $lookup: { from: 'seasons', as: 'seasons', localField: 'season_ids', foreignField: '_id' } },
        { $lookup: { from: 'teams', as: 'teams', localField: 'team_ids', foreignField: '_id' } },
        { $addFields: { matches: { $arrayElemAt: ['$seasons', 0] } } },
        { $addFields: { matches: '$matches.match_ids' } },
        { $lookup: { from: 'matches', as: 'schedule', localField: 'matches', foreignField: '_id' } },
      ])
      leagues.forEach(league => {
        league.id = league._id
        league.schedule.forEach(match => {
          match.id = match._id
          const teams = league.teams.filter(t => match.team_ids.map(t => t.toHexString()).includes(t._id.toHexString()))
          match.team_1_id = teams[0]._id
          match.team_1_name = teams[0].name
          match.team_2_id = teams[1]._id
          match.team_2_name = teams[1].name
          match.season = '1'
          match.type = 'REG'
          match.league_id = league._id
        })
      })
      return leagues
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

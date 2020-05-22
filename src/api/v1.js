const tables = {
  teams: {
    get: async ({ criteria }) => {
      const teams = await require('../model/mongodb/teams').get({ criteria })
      const [mncs] = await require('../model/mongodb/leagues').get({ criteria: { name: 'mncs' } })
      return teams.map(t => ({
        ...t.toJSON(),
        id: t._id,
        league_id: mncs._id,
        league: mncs.name,
      }))
    },
  },
  players: {
    get: async ({ criteria }) => {
      const players = await require('../model/mongodb/players').get({ criteria })
      const [mncs] = await require('../model/mongodb/leagues').get({ criteria: { name: 'mncs' } })
      return players.map(p => {
        const player = {
          ...p.toJSON(),
          id: p._id,
          league_id: mncs._id,
        }
        if (!player.team_id) player.team_id = ''
        return player
      })
    },
  },
  games: require('../model/sheets/games'),
  members: require('../model/sheets/members'),
  schedules: require('../model/sheets/schedules'),
  // leagues: {
  //   get: async () => {
  //     const leagues = await require('../model/mongodb/leagues').Model.aggregate([
  //       { $lookup: { from: 'seasons', as: 'seasons', localField: 'season_ids', foreignField: '_id' } },
  //       { $lookup: { from: 'teams', as: 'teams', localField: 'seasons.team_ids', foreignField: '_id' } },
  //       { $addFields: { matches: { $arrayElemAt: ['$seasons', 0] } } },
  //       { $addFields: { matches: '$matches.match_ids' } },
  //       { $lookup: { from: 'matches', as: 'schedule', localField: 'matches', foreignField: '_id' } },
  //     ])
  //     leagues.forEach(league => {
  //       league.id = league._id
  //       league.schedule.forEach(match => {
  //         match.id = match._id
  //         const teams = league.seasons[0].teams.filter(t =>
  //           match.team_ids.map(t => t.toHexString()).includes(t._id.toHexString()),
  //         )
  //         match.team_1_id = teams[0]._id
  //         match.team_1_name = teams[0].name
  //         match.team_2_id = teams[1]._id
  //         match.team_2_name = teams[1].name
  //         match.season = '1'
  //         match.type = 'REG'
  //         match.league_id = league._id
  //       })
  //     })
  //     return leagues
  //   },
  // },
  leagues: {
    get: async () => {
      const leagues = await require('../model/mongodb/leagues')
        .Model.find()
        .populate({ path: 'seasons', populate: { path: 'matches' } })
        .lean()
      const teams = await require('../model/mongodb/teams').Model.find()

      return leagues.map(league => ({
        ...league,
        id: league._id,
        schedule: league.seasons[0].matches.map(match => ({
          ...match,
          id: match._id,
          team_1_id: match.team_ids[0],
          team_1_name: teams.find(t => t._id.equals(match.team_ids[0])).name,
          team_2_id: match.team_ids[1],
          team_2_name: teams.find(t => t._id.equals(match.team_ids[1])).name,
          season: '1',
          type: 'REG',
          league_id: league._id,
        })),
      }))
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

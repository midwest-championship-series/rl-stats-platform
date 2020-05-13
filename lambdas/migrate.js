const handler = async () => {
  try {
    // const migrateLeagues = async () => {
    //   const leagues = await require('../src/model/sheets/leagues').get({ json: true })
    //   const schedules = await require('../src/model/sheets/schedules').get({ json: true })
    //   leagues.forEach(league => {
    //     league.seasons = [
    //       {
    //         name: '1',
    //         season_type: 'REG',
    //         matches: schedules
    //           .filter(s => s.league_id === league.id)
    //           .map(s => {
    //             s.old_id = s.id
    //             delete s.id
    //             delete s.league_id
    //             delete s.team_1_name
    //             delete s.team_2_name
    //             s.old_team_ids = [s.team_1_id, s.team_2_id]
    //             delete s.team_1_id
    //             delete s.team_2_id
    //             return s
    //           }),
    //       },
    //     ]
    //     league.old_id = league.id
    //     delete league.id
    //   })
    //   return leagues
    // }
    const models = {
      teams: {
        sheets: require('../src/model/sheets/teams'),
        mongo: require('../src/model/mongodb/teams'),
        mutator: record => {
          record.old_league_id = record.league_id
          delete record.league_id
        },
      },
      players: {
        sheets: require('../src/model/sheets/players'),
        mongo: require('../src/model/mongodb/players'),
        mutator: record => {
          record.old_league_id = record.league_id
          delete record.league_id
          record.old_team_id = record.team_id
          delete record.team_id
        },
      },
      members: { sheets: require('../src/model/sheets/members') },
    }
    // const leagues = await require('../src/model/mongodb/leagues').add({ data: await migrateLeagues() })

    const adjustedModels = {}

    for (let property in models) {
      const { sheets, mongo, mutator } = models[property]
      const records = (await sheets.get({ json: true })).map(record => {
        const newRecord = { ...record }
        newRecord.old_id = record.id
        delete newRecord.id
        if (mutator) mutator(newRecord)
        return newRecord
      })
      if (mongo) {
        console.log(`saving ${property}`)
        adjustedModels[property] = await mongo.add({ data: records })
      } else {
        adjustedModels[property] = records
      }
    }
    for (let player of adjustedModels.players) {
      const team = adjustedModels.teams.find(t => t.old_id === player.old_team_id)
      player.team_id = team._id
    }
    for (let member of adjustedModels.members) {
      let player = adjustedModels.players.find(p => p.old_id === member.old_id)
      if (!player) {
        const { Model } = require('../src/model/mongodb/players')
        player = new Model({
          discord_id: member.discord_id,
          screen_name: member.screen_name,
          old_id: member.old_id,
        })
        adjustedModels.players.push(player)
      }
      if (!player.accounts) player.accounts = []
      player.accounts.push({
        platform: member.platform,
        platform_id: member.platform_id,
        screen_name: member.screen_name,
      })
    }
    for (let player of adjustedModels.players) {
      console.log(`saving player: ${player.screen_name}`)
      await player.save()
    }
    // for (let league of leagues) {
    //   console.log(`saving league: ${league._id}`)
    //   league.team_ids = adjustedModels.teams.map(t => t._id)
    //   league.player_ids = adjustedModels.players.map(p => p._id)
    //   league.seasons.forEach(season => {
    //     season.matches.forEach(match => {
    //       match.team_ids = adjustedModels.teams.filter(t => match.old_team_ids.includes(t.old_id))
    //       match.best_of = 5
    //       match.games = adjustedModels.games.filter(g => g.match_id === match.old_id)
    //       if (match.games.length > 0) match.status = 'closed'
    //     })
    //   })
    //   await league.save()
    // }

    // games
    console.log('saving games')
    const oldGames = await require('../src/model/sheets/games').get({ json: true })
    oldGames.forEach(record => {
      record.old_id = record.game_id
      record.ballchasing_id = record.game_id
      record.old_match_id = record.match_id
      record.status = 'closed'
    })
    const newGames = await require('../src/model/mongodb/games').add({ data: oldGames })

    // matches
    console.log('saving matches')
    const oldMatches = await require('../src/model/sheets/schedules').get({ json: true })
    oldMatches.forEach(record => {
      record.old_id = record.id
      record.old_team_ids = [record.team_1_id, record.team_2_id]
      record.game_ids = newGames.filter(g => g.old_match_id === record.old_id).map(g => g._id)
      record.team_ids = adjustedModels.teams.filter(t => record.old_team_ids.includes(t.old_id))
      record.status = record.game_ids.length > 0 ? 'closed' : 'open'
      record.best_of = 5
    })
    const newMatches = await require('../src/model/mongodb/matches').add({ data: oldMatches })

    // seasons
    console.log('saving seasons')
    const seasons = [
      {
        name: '1',
        season_type: 'REG',
        match_ids: newMatches.map(m => m._id),
      },
    ]
    const newSeasons = await require('../src/model/mongodb/seasons').add({ data: seasons })

    // leagues
    console.log('saving leagues')
    const oldLeagues = await require('../src/model/sheets/leagues').get({ json: true })
    for (let record of oldLeagues) {
      record.old_id = record.id
      record.season_ids = newSeasons.map(s => s._id)
    }
    const newLeagues = await require('../src/model/mongodb/leagues').add({ data: oldLeagues })

    console.log('finished update')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}

module.exports = { handler }

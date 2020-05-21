require('../src/model/mongodb')

const handler = async () => {
  try {
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
          record.accounts = []
        },
      },
      members: { sheets: require('../src/model/sheets/members') },
    }

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
        const Players = require('../src/model/mongodb/players')
        const [newPlayer] = await Players.add({
          data: [
            {
              discord_id: member.discord_id,
              screen_name: member.screen_name,
              old_id: member.old_id,
            },
          ],
        })
        player = newPlayer
        adjustedModels.players.push(player)
      }
      const account = player.accounts.find(a => a.platform === member.platform && a.platform_id === member.platform_id)
      if (!account) {
        player.accounts.push({
          platform: member.platform,
          platform_id: member.platform_id,
          screen_name: member.screen_name,
        })
      }
    }
    for (let player of adjustedModels.players) {
      console.log(`saving player: ${player.screen_name}`)
      await player.save()
    }

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
      record.player_ids = adjustedModels.players.map(p => p._id)
      record.team_ids = adjustedModels.teams.map(t => t._id)
    }
    const newLeagues = await require('../src/model/mongodb/leagues').add({ data: oldLeagues })

    console.log('finished update')
    return { success: true }
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}

module.exports = { handler }

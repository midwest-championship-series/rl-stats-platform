const fs = require('fs')
const path = require('path')
const { Matches, Games } = require('../src/model/mongodb')

const handler = async () => {
  const matches = await Matches.find({ forfeited_by_team: { $exists: true }, 'game_ids.0': { $exists: false } })
  for (let match of matches) {
    const winningTeam = match.winning_team_id
    const forfeitTeam = match.forfeited_by_team
    console.log(`winning: ${winningTeam}\nlosing: ${forfeitTeam}\n\n----------------\n\n`)
    for (let i = 1; i <= Math.ceil(match.best_of / 2); i++) {
      const game = new Games({
        winning_team_id: winningTeam,
        game_number: i,
        report_type: 'MANUAL_REPORT',
      })
      match.game_ids.push(game._id)
      await game.save()
    }
    await match.save()
  }
}

module.exports = { handler }

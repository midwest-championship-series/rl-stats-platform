const schedule = require('./model/sheets/schedules')
const games = require('./model/sheets/games')
const sqs = require('./services/aws').sqs

module.exports = async criteria => {
  const matches = (await schedule.get({ criteria, json: true })).map(m => m.id)
  const processedGames = (await games.get({ json: true })).filter(g => matches.includes(g.match_id))
  const messages = processedGames.reduce((result, game) => {
    const matchMessage = result.find(m => m.match_id === game.match_id)
    if (matchMessage) {
      matchMessage.game_ids.push(game.game_id)
    } else {
      result.push({ match_id: game.match_id, game_ids: [game.game_id] })
    }
    return result
  }, [])
  await sqs.sendMessageBatch(process.env.GAMES_QUEUE_URL, messages)
  return { messages }
}

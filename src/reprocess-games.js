const { Model: Matches } = require('./model/mongodb/matches')
const sqs = require('./services/aws').sqs

module.exports = async criteria => {
  const matches = await Matches.find({ 'game_ids.0': { $exists: true }, ...criteria }).populate('games')
  const messages = matches.map(match => {
    return {
      match_id: match._id.toHexString(),
      game_ids: match.games.map(g => g.ballchasing_id),
    }
  })
  await sqs.sendMessageBatch(process.env.GAMES_QUEUE_URL, messages)
  return { messages }
}

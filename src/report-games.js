const ballchasing = require('./services/ballchasing')
const { games, players, teams, teamGames, playerGames } = require('./model')
const processMatch = require('./producers')

module.exports = async ({ game_ids, reporter_discord_id }) => {
  const knownGames = (await games.get()).map(g => g.game_id)
  const [reporter] = await players.get({ criteria: { discord_id: reporter_discord_id }, json: true })
  if (!reporter) throw new Error('no player exists with that id - link steam or xbox account')
  const query = {
    game_ids: game_ids.filter(id => !knownGames.includes(id)), // filter out games which have been processed until we can upsert effectively
  }
  const reportGames = await ballchasing.getReplays(query)
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames)
  // await games.add(gameUpdates)
  // await teamGames.add(teamUpdates)
  // await playerGames.add(playerUpdates)
  const recordedIds = reportGames.map(({ id }) => id)
  return { recordedIds, stats: { gameStats, teamStats, playerStats } }
}

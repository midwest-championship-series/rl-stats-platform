const ballchasing = require('./services/ballchasing')
const { games, players, teams, teamGames, playerGames } = require('./model')
const processMatch = require('./producers')

module.exports = async ({ game_ids, reporter }) => {
  const knownGames = (await games.get()).map(g => g.game_id)
  const [reportPlayerId] = (await players.get(reporter)).map(r => r.id)
  if (!reportPlayerId) throw new Error('no player exists with that id - link steam account')
  reporter.id = reportPlayerId
  const query = {
    game_ids: game_ids.filter(id => !knownGames.includes(id)), // filter out games which have been processed until we can upsert effectively
  }
  const reportGames = await ballchasing.getReplays(query)
  // const gameUpdates = reportGames.map(g => gameStats(g))
  // const teamUpdates = reportGames.map(g => teamStats(g))
  // const playerUpdates = reportGames.map(g => playerStats(g))
  const { gameUpdates, teamUpdates, playerUpdates } = processMatch(reportGames, reporter)
  // await games.add(gameUpdates)
  // await teamGames.add(teamUpdates)
  // await playerGames.add(playerUpdates)
  const recordedIds = reportGames.map(({ id }) => id)
  return { recordedIds, data: reportGames }
}

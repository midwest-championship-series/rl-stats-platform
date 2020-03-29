const ballchasing = require('./services/ballchasing')
const { games, teamGames, playerGames } = require('./model')
const processMatch = require('./producers')

module.exports = async ({ game_ids }) => {
  const knownGames = (await games.get()).map(g => g.game_id)
  const query = {
    game_ids: game_ids.filter(id => !knownGames.includes(id)), // filter out games which have been processed until we can upsert effectively
  }
  const reportGames = await ballchasing.getReplays(query)
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames)
  await games.add({ data: gameStats })
  await teamGames.add({ data: teamStats })
  await playerGames.add({ data: playerStats })
  return {
    recorded_ids: reportGames.map(({ id }) => id),
    stats: { game_stats: gameStats, team_stats: teamStats, player_stats: playerStats },
  }
}

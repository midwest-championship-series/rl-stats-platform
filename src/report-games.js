const ballchasing = require('./services/ballchasing')
const { games, teamGames, playerGames, matchGames } = require('./model')
const processMatch = require('./producers')

module.exports = async ({ game_ids }) => {
  // const knownGames = (await games.get()).map(g => g.game_id)
  // const matches = await matchGames.get({ json: true })
  // const processedGames = matches.filter(match => game_ids.includes(match.game_id))
  // if (processedGames.length === 0) console.log('new match detected')
  const reportGames = await ballchasing.getReplays({ game_ids })
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames)
  // await games.add({ data: gameStats })
  // await teamGames.add({ data: teamStats })
  // await playerGames.add({ data: playerStats })
  return {
    recorded_ids: reportGames.map(({ id }) => id),
    stats: { game_stats: gameStats, team_stats: teamStats, player_stats: playerStats },
  }
}

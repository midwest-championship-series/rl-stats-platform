const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
const teamGames = require('./model/team-games')
const playerGames = require('./model/player-games')
const processMatch = require('./producers')

module.exports = async ({ game_ids }) => {
  const reportGames = await ballchasing.getReplays({ game_ids })
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames)
  await games.upsert({ data: gameStats })
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })
  return {
    recorded_ids: reportGames.map(({ id }) => id),
    stats: { game_stats: gameStats, team_stats: teamStats, player_stats: playerStats },
  }
}

const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
const teamGames = require('./model/team-games')
const playerGames = require('./model/player-games')
const processMatch = require('./producers')

module.exports = async ({ match_id, game_ids }) => {
  // begin game reporting
  const reportGames = await ballchasing.getReplays({ game_ids })
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames, match_id)
  await games.upsert({ data: gameStats })
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })
  return reportGames.map(({ id }) => id)
}

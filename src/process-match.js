const ballchasing = require('./services/ballchasing')
const games = require('./model/sheets/games')
const teamGames = require('./model/sheets/team-games')
const playerGames = require('./model/sheets/player-games')
const processMatch = require('./producers')

module.exports = async ({ match_id, game_ids }) => {
  // begin game reporting
  const reportGames = await ballchasing.getReplays({ game_ids })
  const stats = await processMatch(reportGames, match_id)
  if (!stats) return // stats are not returned for matches which do not have stats
  const { gameStats, teamStats, playerStats } = stats
  await games.upsert({ data: gameStats })
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })
  return { match_id: gameStats[0].match_id, game_ids: gameStats.map(({ game_id }) => game_id) }
}

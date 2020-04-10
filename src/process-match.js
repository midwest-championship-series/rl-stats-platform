const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
const schedules = require('./model/schedules')
const teamGames = require('./model/team-games')
const playerGames = require('./model/player-games')
const processMatch = require('./producers')

module.exports = async ({ match_id, game_ids }) => {
  // begin game reporting
  const reportGames = await ballchasing.getReplays({ game_ids })
  const [match] = await schedules.get({ criteria: { id: match_id }, json: true })
  if (!match || match.id !== match_id) throw new Error('unable to locate match in schedule')
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames, match)
  await games.upsert({ data: gameStats })
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })
  return reportGames.map(({ id }) => id)
}

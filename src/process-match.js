const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
const schedules = require('./model/schedules')
const teamGames = require('./model/team-games')
const playerGames = require('./model/player-games')
const processMatch = require('./producers')

module.exports = async ({ match_id, game_ids }) => {
  try {
    // begin game reporting
    const reportGames = await ballchasing.getReplays({ game_ids })
    const match = await schedules.get({ id: match_id })
    const { gameStats, teamStats, playerStats } = await processMatch(reportGames, match)
    await games.upsert({ data: gameStats })
    await teamGames.upsert({ data: teamStats })
    await playerGames.upsert({ data: playerStats })
    return reportGames.map(({ id }) => id)
  } catch (err) {
    /** @todo add error reporting */
    console.error(err)
  }
}

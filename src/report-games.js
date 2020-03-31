const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
const teamGames = require('./model/team-games')
const playerGames = require('./model/player-games')
const processMatch = require('./producers')

module.exports = async ({ match_id, game_ids }) => {
  if (match_id) {
    game_ids = (await games.get({ criteria: { match_id } })).map(game => game.game_id)
    if (game_ids.length === 0) throw new Error(`no game_ids found for match_id: ${match_id}`)
  }
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

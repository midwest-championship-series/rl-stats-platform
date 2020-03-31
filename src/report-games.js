const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
const teamGames = require('./model/team-games')
const playerGames = require('./model/player-games')
const processMatch = require('./producers')

module.exports = async ({ match_id, game_ids }) => {
  const gameIdsToProcess = []
  // validate that all games for a match are being reported
  if (match_id) {
    const matchGames = (await games.get({ criteria: { match_id } })).map(game => game.game_id)
    if (matchGames.length === 0) throw new Error(`no game_ids found for match_id: ${match_id}`)
    gameIdsToProcess.push(...matchGames)
  } else if (game_ids && game_ids.length > 0) {
    /**
     * games could be mis-reported in 3 ways:
     * 1) games from different matches are reported together
     * 2) the games have already been processed, but only part of them are being reprocessed
     * 3) someone is attempting to add a new game to a match that already exists
     */
    const allGames = await games.get()
    const reportedGameMatchIds = [
      ...new Set(allGames.filter(g => game_ids.some(id => g.game_id === id)).map(g => g.match_id)),
    ]
    // validate against case 1
    if (reportedGameMatchIds.length > 1)
      throw new Error(`cannot report games from multiple matches at once: ${reportedGameMatchIds.join(', ')}`)
    const allMatchGames = allGames.filter(g => g.match_id === reportedGameMatchIds[0])
    // covers case 2
    if (allMatchGames.length !== game_ids.length)
      throw new Error(
        `expected same number of games to be reported as games in match: ${reportedGameMatchIds[0]}, expected ${allMatchGames.length} but got ${game_ids.length}`,
      )
    if (!allMatchGames.every(g => game_ids.includes(g.game_id)))
      throw new Error(`reported games_ids do not match game_ids for match ${reportedGameMatchIds[0]}`)
    gameIdsToProcess.push(...game_ids)
  } else {
    throw new Error('expected match_id or game_ids[] in request body')
  }
  // begin game reporting
  const reportGames = await ballchasing.getReplays({ game_ids: gameIdsToProcess })
  const { gameStats, teamStats, playerStats } = await processMatch(reportGames)
  await games.upsert({ data: gameStats })
  await teamGames.upsert({ data: teamStats })
  await playerGames.upsert({ data: playerStats })
  return {
    recorded_ids: reportGames.map(({ id }) => id),
    stats: { game_stats: gameStats, team_stats: teamStats, player_stats: playerStats },
  }
}

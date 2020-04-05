// const ballchasing = require('./services/ballchasing')
const games = require('./model/games')
// const teamGames = require('./model/team-games')
// const playerGames = require('./model/player-games')
// const processMatch = require('./producers')
const sqs = require('./services/aws').sqs

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
    match_id = reportedGameMatchIds[0]
    // covers not finding a match id
    if (!match_id) throw new Error('match id not found for games')
    // validate against case 1
    if (reportedGameMatchIds.length > 1)
      throw new Error(`cannot report games from multiple matches at once: ${reportedGameMatchIds.join(', ')}`)
    const allMatchGames = allGames.filter(g => g.match_id === match_id)
    // covers case 2
    if (allMatchGames.length !== game_ids.length)
      throw new Error(
        `expected same number of games to be reported as games in match: ${match_id}, expected ${allMatchGames.length} but got ${game_ids.length}`,
      )
    // covers case 3
    if (!allMatchGames.every(g => game_ids.includes(g.game_id)))
      throw new Error(`reported games_ids do not match game_ids for match ${match_id}`)
    gameIdsToProcess.push(...game_ids)
  } else {
    throw new Error('expected match_id or game_ids[] in request body')
  }
  await sqs.sendMessage(process.env.GAMES_QUEUE_URL, { game_ids: gameIdsToProcess, match_id })
  return { recorded_ids: gameIdsToProcess }
}

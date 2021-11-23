const teamStats = require('./team-stats')
const playerStats = require('./player-stats')
const gameContext = require('./game-context')
const playerContext = require('./player-context')
const { UnRecoverableError } = require('../util/errors')

const colors = ['blue', 'orange']

const assignWins = (games, match, leagueGames) => {
  const [orangeId, blueId] = match.teams.map((t) => t._id)
  const wins = {
    [orangeId]: 0,
    [blueId]: 0,
  }
  games.forEach((game) => {
    let winnerId
    if (game.report_type === 'MANUAL_REPORT') {
      winnerId = game.winning_team_id
      console.log(typeof game.winning_team_id)
    } else {
      const winner = game.orange.stats.core.goals > game.blue.stats.core.goals ? 'orange' : 'blue'
      winnerId = game[winner].team._id
    }
    game.winning_team_id = winnerId
    wins[winnerId]++
  })
  if (wins[orangeId] === wins[blueId]) {
    throw new UnRecoverableError('BEST_OF_NOT_MET', `both teams should not have win count equal to ${wins[orangeId]}`)
  }

  const winnerId = wins[orangeId] > wins[blueId] ? orangeId : blueId
  const maxWins = Math.max(wins[orangeId], wins[blueId])
  match.winning_team_id = winnerId
  if (match.best_of && maxWins < match.best_of / 2) {
    const errMsg = `expected a team to win the best of ${match.best_of} match, but winning team has only ${maxWins}`
    throw new UnRecoverableError('BEST_OF_NOT_MET', errMsg)
  }
  games.forEach((game) => {
    if (game.report_type !== 'MANUAL_REPORT') {
      const winnerColor = colors.find((color) => game[color].team._id.equals(winnerId))
      game[winnerColor].match_id_win = game.match_id
    }
  })
  // map the wins back to the games which will be saved in the db
  leagueGames.forEach((game) => {
    const dataGame = games.find((g) => game._id.equals(g.game_id))
    game.winning_team_id = dataGame.winning_team_id
  })
}

module.exports = (leagueInfo, processedAt) => {
  const games = leagueInfo.games.map((g) => g.raw_data)
  let playersToTeams = []
  let gameNumber = 1
  for (let game of leagueInfo.games) {
    game.raw_data.game_number = gameNumber
    gameContext(game, leagueInfo)
    // skip player and team assignment for manually reported games (for now)
    if (game.report_type !== 'MANUAL_REPORT') {
      // teams also get assigned to the colors here
      const { playerTeamMap } = playerContext(game, leagueInfo)
      playersToTeams = playersToTeams.concat(playerTeamMap)
    }
    gameNumber++
  }
  assignWins(games, leagueInfo.match, leagueInfo.games)
  return {
    teamStats: leagueInfo.games.reduce((result, game) => result.concat(teamStats(game, processedAt)), []),
    playerStats: leagueInfo.games.reduce((result, game) => result.concat(playerStats(game, processedAt)), []),
    playerTeamMap: playersToTeams.reduce((result, item) => {
      if (!result.find((i) => i.player_id === item.player_id)) {
        result.push(item)
      }
      return result
    }, []),
  }
}

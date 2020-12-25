const teamStats = require('./team-stats')
const playerStats = require('./player-stats')
const assignLeagueContext = require('./league-context')
const { UnRecoverableError } = require('../util/errors')

const colors = ['blue', 'orange']

const assignWins = (games, match, leagueGames) => {
  const orangeId = games[0].orange.team._id
  const blueId = games[0].blue.team._id
  const wins = {
    [orangeId]: 0,
    [blueId]: 0,
  }
  games.forEach(game => {
    const winner = game.orange.stats.core.goals > game.blue.stats.core.goals ? 'orange' : 'blue'
    const winnerId = game[winner].team._id
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
  games.forEach(game => {
    const winnerColor = colors.find(color => game[color].team._id.equals(winnerId))
    game[winnerColor].match_id_win = game.match_id
  })
  // map the wins back to the games which will be saved in the db
  leagueGames.forEach(game => {
    const dataGame = games.find(g => game._id.equals(g.game_id))
    game.winning_team_id = dataGame.winning_team_id
  })
}

module.exports = (games, leagueInfo) => {
  const sortedGames = games.sort((a, b) => new Date(a.date) - new Date(b.date))
  let playersToTeams = []
  let gameNumber = 1
  for (let game of sortedGames) {
    game.game_number = gameNumber
    const { playerTeamMap } = assignLeagueContext(game, leagueInfo)
    playersToTeams = playersToTeams.concat(playerTeamMap)
    gameNumber++
  }
  assignWins(games, leagueInfo.match, leagueInfo.games)
  return {
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: games.reduce((result, game) => result.concat(playerStats(game)), []),
    playerTeamMap: playersToTeams.reduce((result, item) => {
      if (!result.find(i => i.player_id === item.player_id)) {
        result.push(item)
      }
      return result
    }, []),
  }
}

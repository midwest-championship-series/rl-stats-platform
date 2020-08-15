const teamStats = require('./team-stats')
const playerStats = require('./player-stats')
const { getPlayerTeamsAtDate } = require('./common')
const { UnRecoverableError } = require('../util/errors')

const colors = ['blue', 'orange']
const getOpponentColor = color => colors.filter(c => c !== color)[0]

const assignLeagueIds = (game, { league, season, match, players, teams, games }) => {
  const playerTeamMap = []
  game.game_id = games.find(g => g.ballchasing_id === game.id)._id.toHexString()
  game.match_id = match._id.toHexString()
  game.match_type = match.season.season_type
  game.week = match.week
  game.season = match.season.name
  game.season_id = season._id.toHexString()
  game.league_id = league._id.toHexString()

  colors.forEach(color => {
    if (game[color].players.length !== 3) {
      const errMsg = `invalid teams for game: ${game.id}. Expected 3 players but got ${game[color].players.length}.`
      throw new UnRecoverableError('BAD_PLAYER_COUNT', errMsg)
    }
    const teamPlayer = players.find(player => {
      return game[color].players.some(({ id }) => {
        return player.accounts.some(({ platform, platform_id }) => {
          return id.platform === platform && id.id === platform_id
        })
      })
    })
    if (teamPlayer) {
      const playerTeams = getPlayerTeamsAtDate(teamPlayer, new Date(game.date))
      game[color].team = teams.find(t => playerTeams.some(({ team_id }) => t._id.equals(team_id)))
    }
    if (!game[color].team) {
      const errMsg = `no team found for ${color} in match ${game.match_id}`
      throw new UnRecoverableError('NO_TEAM_IDENTIFIED', errMsg)
    }
  })
  // assign team_id and player_id to players
  colors.forEach(color => {
    game[color].players.forEach(player => {
      player.team_id = game[color].team._id.toHexString()
      player.team_name = game[color].team.name
      player.opponent_team_id = game[getOpponentColor(color)].team._id.toHexString()
      player.opponent_team_name = game[getOpponentColor(color)].team.name
      const leaguePlayer = players.find(p => {
        return p.accounts.some(({ platform, platform_id }) => {
          return platform === player.id.platform && platform_id === player.id.id
        })
      })
      if (leaguePlayer) {
        player.league_id = leaguePlayer._id.toHexString()
        player.name = leaguePlayer.screen_name
        playerTeamMap.push({ player_id: leaguePlayer._id, team_id: game[color].team._id })
      }
    })
  })
  return { playerTeamMap }
}

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
    const { playerTeamMap } = assignLeagueIds(game, leagueInfo)
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

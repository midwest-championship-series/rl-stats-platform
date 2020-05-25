const teamStats = require('./team-stats')
const playerStats = require('./player-stats')
const colors = ['blue', 'orange']

const getOpponentColor = color => colors.filter(c => c !== color)[0]

const assignLeagueIds = (game, { match, players, teams, games }) => {
  const playerTeamMap = []
  game.game_id = games.find(g => g.ballchasing_id === game.id)._id.toHexString()
  game.match_id = match._id.toHexString()
  game.match_type = match.season.season_type
  game.week = match.week
  game.season = match.season.name
  game.season_id = match.season._id.toHexString()
  game.league_id = match.season.league._id.toHexString()

  colors.forEach(color => {
    const teamPlayer = players.find(player => {
      return game[color].players.some(({ id }) => {
        return player.accounts.some(({ platform, platform_id }) => {
          return id.platform === platform && id.id === platform_id
        })
      })
    })
    game[color].team = teams.find(t => t._id.equals(teamPlayer.team_id))
    if (!game[color].team) throw new Error(`no team found for ${color}`)
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

const assignMatchWin = (games, match) => {
  const teamWins = games.reduce((result, game) => {
    const winner = game.orange.stats.core.goals > game.blue.stats.core.goals ? 'orange' : 'blue'
    const winningTeam = result.find(r => r.id === game[winner].team._id)
    if (!winningTeam) {
      result.push({ id: game[winner].team._id, wins: 1 })
    } else {
      winningTeam.wins++
    }
    return result
  }, [])
  const winnerId =
    teamWins.length > 1 ? (teamWins[0].wins > teamWins[1].wins ? teamWins[0].id : teamWins[1].id) : teamWins[0].id
  const maxWins = Math.max(...teamWins.map(t => t.wins))
  if (match.best_of && maxWins < match.best_of / 2) {
    throw new Error(`expected a team to with the best of ${match.best_of} match, but winning team has only ${maxWins}`)
  }
  games.forEach(game => {
    const winnerColor = colors.find(color => game[color].team._id === winnerId)
    game[winnerColor].match_id_win = game.match_id
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
  assignMatchWin(games, leagueInfo.match)
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

// const members = require('../model/sheets/members')
// const players = require('../model/sheets/players')
// const schedules = require('../model/sheets/schedules')
const teamStats = require('./team-stats')
const playerStats = require('./player-stats')
const colors = ['blue', 'orange']

const getOpponentColor = color => colors.filter(c => c !== color)[0]

const assignLeagueIds = (game, { match, players, teams, games }) => {
  game.game_id = games.find(g => g.ballchasing_id === game.id)._id.toHexString()
  game.match_id = match._id.toHexString()
  game.match_type = match.season.season_type
  game.week = match.week
  game.season = match.season.name
  game.league_id = match.season.league._id.toHexString()

  colors.forEach(color => {
    const teamPlayer = players.find(player => {
      return game[color].players.some(({ id }) => {
        return player.accounts.some(({ platform, platform_id }) => {
          return id.platform === platform && id.id === platform_id
        })
      })
    })
    game[color].team_id = teamPlayer.team_id.toHexString()
  })
  // assign team_id and player_id to players
  colors.forEach(color => {
    game[color].players.forEach(player => {
      player.team_id = game[color].team_id
      player.opponent_team_id = game[getOpponentColor(color)].team_id
      const leaguePlayer = players.find(p => {
        return p.accounts.some(({ platform, platform_id }) => {
          return platform === player.id.platform && platform_id === player.id.id
        })
      })
      if (leaguePlayer) {
        player.league_id = leaguePlayer._id.toHexString()
        player.name = leaguePlayer.screen_name
      }
    })
  })
}

const assignMatchWin = games => {
  const teamWins = games.reduce((result, game) => {
    const winner = game.orange.stats.core.goals > game.blue.stats.core.goals ? 'orange' : 'blue'
    const winningTeam = result.find(r => r.id === game[winner].team_id)
    if (!winningTeam) {
      result.push({ id: game[winner].team_id, wins: 1 })
    } else {
      winningTeam.wins++
    }
    return result
  }, [])
  const winnerId =
    teamWins.length > 1 ? (teamWins[0].wins > teamWins[1].wins ? teamWins[0].id : teamWins[1].id) : teamWins[0].id
  games.forEach(game => {
    const winnerColor = colors.find(color => game[color].team_id === winnerId)
    game[winnerColor].match_id_win = game.match_id
  })
}

module.exports = (games, leagueInfo) => {
  const sortedGames = games.sort((a, b) => new Date(a.date) - new Date(b.date))
  let gameNumber = 1
  for (let game of sortedGames) {
    game.game_number = gameNumber
    assignLeagueIds(game, leagueInfo)
    gameNumber++
  }
  assignMatchWin(games)
  return {
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: games.reduce((result, game) => result.concat(playerStats(game)), []),
  }
}

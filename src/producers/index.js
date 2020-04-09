const members = require('../model/members')
const players = require('../model/players')
const gameStats = require('./game-stats')
const teamStats = require('./team-stats')
const playerStats = require('./player-stats')
const colors = ['blue', 'orange']

const getMemberInfo = async () => {
  const leaguePlayers = await players.get()
  const mnrlMembers = await members.get()
  return mnrlMembers.map(member => ({ ...member, ...leaguePlayers.find(player => player.id === member.id) }))
}

const getOpponentColor = color => colors.filter(c => c !== color)[0]

const assignLeagueIds = async (game, leaguePlayers, matchId) => {
  // assign team_id to teams
  game.teams = []
  colors.forEach(color => {
    const teamPlayer = leaguePlayers.find(player => {
      return game[color].players.some(({ id }) => player.platform === id.platform && player.platform_id === id.id)
    })
    if (teamPlayer) {
      game[color].team_id = teamPlayer.team_id
      if (!game.teams.includes(teamPlayer.team_id)) game.teams.push(teamPlayer.team_id)
    }
  })
  // assign team_id and player_id to players
  colors.forEach(color => {
    game[color].players.forEach(player => {
      player.team_id = game[color].team_id
      player.opponent_team_id = game[getOpponentColor(color)].team_id
      const leaguePlayer = leaguePlayers.find(p => p.platform === player.id.platform && p.platform_id === player.id.id)
      player.league_id = leaguePlayer && leaguePlayer.id
    })
  })
  game.match_id = matchId
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

module.exports = async (games, matchId) => {
  const leaguePlayers = await getMemberInfo()
  const sortedGames = games.sort((a, b) => new Date(b.date) - new Date(a.date))
  let gameNumber = 1
  for (let game of sortedGames) {
    game.game_number = gameNumber
    await assignLeagueIds(game, leaguePlayers, matchId)
    gameNumber++
  }
  assignMatchWin(games)
  return {
    gameStats: games.map(gameStats),
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: games.reduce((result, game) => result.concat(playerStats(game)), []),
  }
}

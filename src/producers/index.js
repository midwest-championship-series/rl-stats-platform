const members = require('../model/sheets/members')
const players = require('../model/sheets/players')
const schedules = require('../model/sheets/schedules')
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

const getMatch = async (matchId, games) => {
  if (matchId) {
    const matches = await schedules.get({ criteria: { id: matchId }, json: true })
    return matches[0]
  } else {
    const teams = games.reduce((result, game) => {
      game.teams.forEach(teamId => {
        if (!result.includes(teamId)) result.push(teamId)
      })
      return result
    }, [])
    const matches = await schedules.get()
    return matches.filter(m => [m.team_1_id, m.team_2_id].every(id => teams.includes(id)))[0]
  }
}

const assignLeagueIds = (game, leaguePlayers) => {
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
}

const assignMatchContext = (game, match) => {
  game.match_id = match.id
  game.match_type = match.type
  game.week = match.week
  game.season = match.season
  game.league_id = match.league_id
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
  const sortedGames = games.sort((a, b) => new Date(a.date) - new Date(b.date))
  let gameNumber = 1
  for (let game of sortedGames) {
    game.game_number = gameNumber
    assignLeagueIds(game, leaguePlayers)
    gameNumber++
  }
  const match = await getMatch(matchId, games)
  if (!match) return
  for (let game of sortedGames) {
    assignMatchContext(game, match)
  }
  assignMatchWin(games)
  return {
    gameStats: games.map(gameStats),
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: games.reduce((result, game) => result.concat(playerStats(game)), []),
  }
}

const { v4: uuid } = require('uuid')

const { members, players } = require('../model')
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

const assignLeagueIds = (game, leaguePlayers) => {
  colors.forEach(color => {
    // assign team_id to teams
    const teamPlayer = leaguePlayers.find(player => {
      return game[color].players.some(({ id }) => player.platform === id.platform && player.platform_id === id.id)
    })
    game[color].team_id = teamPlayer && teamPlayer.team_id
  })
  colors.forEach(color => {
    // assign team_id and player_id to players
    game[color].players.forEach(player => {
      const leaguePlayer = leaguePlayers.find(p => p.platform === player.id.platform && p.platform_id === player.id.id)
      player.league_id = leaguePlayer && leaguePlayer.id
      player.team_id = leaguePlayer && leaguePlayer.team_id
      player.opponent_team_id = game[getOpponentColor(color)].team_id
    })
  })
}

module.exports = async games => {
  const leaguePlayers = await getMemberInfo()
  games.forEach(game => assignLeagueIds(game, leaguePlayers))
  return {
    gameStats: games.map(gameStats),
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: games.reduce((result, game) => result.concat(playerStats(game)), []),
  }
}

const { v4: uuid } = require('uuid')

const { members, players } = require('../model')
const gameStats = require('./game-stats')
const teamStats = require('./team-stats')
const colors = ['blue', 'orange']

const getMemberInfo = async () => {
  const mncsPlayers = await players.get()
  const mnrlMembers = await members.get()
  // return mnrlMembers.map(member => {
  //   const matchPlayer = mncsPlayers.find(player => player.id === member.id)
  //   return { ...member, ...matchPlayer }
  // })
  return mnrlMembers.map(member => ({ ...member, ...mncsPlayers.find(player => player.id === member.id) }))
}

module.exports = async games => {
  const players = await getMemberInfo()
  console.log('players', players)
  games.forEach(game => {
    colors.forEach(color => {
      // assign team_id to teams
      const teamPlayer = players.find(player => {
        return game[color].players.some(({ id }) => player.platform === id.platform && player.platform_id === id.id)
      })
      game[color].team_id = teamPlayer && teamPlayer.team_id
      console.log('team_id', game[color].team_id, color)
      // assign team_id and player_id to players
    })
  })
  return {
    gameStats: games.map(gameStats),
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: {},
  }
}

const members = require('../model/members')
const players = require('../model/players')
const schedule = require('../model/schedule')
const seasons = require('../model/seasons')
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

const assignLeagueIds = async (game, leaguePlayers) => {
  // assign team_id to teams
  colors.forEach(color => {
    const teamPlayer = leaguePlayers.find(player => {
      return game[color].players.some(({ id }) => player.platform === id.platform && player.platform_id === id.id)
    })
    game[color].team_id = teamPlayer && teamPlayer.team_id
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
  // find the match info for these teams facing off
  const [currentSeason] = await seasons.get({ criteria: { current: 'TRUE' }, json: true })
  const matches = (
    await schedule.get({
      criteria: {
        season: currentSeason.season,
        type: currentSeason.type,
      },
      json: true,
    })
  ).filter(m => {
    return (
      (m.team_1_id === game.blue.team_id && m.team_2_id === game.orange.team_2_id) ||
      (m.team_1_id === game.orange.team_id && m.team_2_id === game.blue.team_id)
    )
  })
  if (matches.length > 1) {
    throw new Error("I don't know how to handle stats for multi-match seasons yet")
  } else if (matches.length < 1) {
    throw new Error(`no match found for teams: ${game.blue.team_id}, ${game.orange.team_id}`)
  }
  game.match_id = matches[0].id
}

module.exports = async games => {
  const leaguePlayers = await getMemberInfo()
  for (let game of games) {
    await assignLeagueIds(game, leaguePlayers)
  }
  return {
    gameStats: games.map(gameStats),
    teamStats: games.reduce((result, game) => result.concat(teamStats(game)), []),
    playerStats: games.reduce((result, game) => result.concat(playerStats(game)), []),
  }
}

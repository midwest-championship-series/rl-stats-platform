const { getPlayerTeamsAtDate } = require('./common')
const { UnRecoverableError } = require('../util/errors')

const colors = ['blue', 'orange']
const getOpponentColor = color => colors.filter(c => c !== color)[0]

module.exports = (game, { league, season, match, players, teams, games }) => {
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
    const teamPlayers = players.filter(player => {
      return game[color].players.some(({ id }) => {
        return player.accounts.some(({ platform, platform_id }) => {
          return id.platform === platform && id.id === platform_id
        })
      })
    })
    if (!teamPlayers) {
      const errMsg = `no players found for team: ${color}`
      throw new UnRecoverableError('NO_PLAYERS_IDENTIFIED', errMsg)
    }
    // get all team ids that players have at match date
    const playerTeams = [
      ...new Set(
        teamPlayers
          .reduce((result, player) => {
            result.push(...getPlayerTeamsAtDate(player, new Date(game.date)))
            return result
          }, [])
          .map(team => team.team_id),
      ),
    ]
    game[color].team = teams.find(t => playerTeams.some(team_id => t._id.equals(team_id)))
    if (!game[color].team) {
      const errMsg = `no team found for ${color} in match ${game.match_id}. Teams identified are: ${playerTeams.join(
        ', ',
      )}`
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

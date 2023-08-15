const { getPlayerTeamsAtDate } = require('./common')
const { UnRecoverableError } = require('../util/errors')

const colors = ['blue', 'orange']
const getOpponentColor = (color) => colors.filter((c) => c !== color)[0]

module.exports = (dbGame, { players }, playersToTeams) => {
  const game = dbGame.raw_data

  /** @todo move this validation to a match variable */
  colors.forEach((color) => {
    if (game[color].players.length !== 3) {
      const errMsg = `invalid teams for game: ${game.id}. Expected 3 players but got ${game[color].players.length}.`
      throw new UnRecoverableError('BAD_PLAYER_COUNT', errMsg)
    }
  })
  // assign team_id and player_id to players
  colors.forEach((color) => {
    game[color].players.forEach((player) => {
      player.team_id = game[color].team._id.toHexString()
      player.team_name = game[color].team.name
      player.opponent_team_id = game[getOpponentColor(color)].team._id.toHexString()
      player.opponent_team_name = game[getOpponentColor(color)].team.name
      const { player: leaguePlayer, sub, team } = playersToTeams.find((p) => {
        return p.player.accounts.some(({ platform, platform_id }) => {
          return platform === player.id.platform && platform_id === player.id.id
        })
      })
      player.league_id = leaguePlayer._id.toHexString()
      player.name = leaguePlayer.screen_name
      player.is_sub_for_team = sub ? team._id.toHexString() : undefined
      // camera settings
      for (const [key, value] of Object.entries(player.camera)) {
        player[`camera_${key}`] = value
      }
      player.car_name = player.car_name
    })
  })
}

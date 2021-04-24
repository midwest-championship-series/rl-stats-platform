const { groupBy } = require('lodash')

const teamGames = require('../../model/sheets/team-games')
const { Model: Seasons } = require('../../model/mongodb/seasons')

const makeUnique = (arr) => [...new Set(arr.filter((item) => !!item))]

module.exports = async (req, res, next) => {
  const { season_id } = req.params
  const records = await teamGames.get({ criteria: { season_id }, json: true })
  const recordsByTeam = groupBy(records, (r) => r.team_id)
  const season = await Seasons.findById(season_id).populate('teams').lean()

  if (!season) {
    res.status(404)
    return next()
  }
  req.context = season.teams
    .map((team) => {
      const wins = makeUnique(recordsByTeam[team._id].map((r) => r.game_id_win)).length
      const played = makeUnique(recordsByTeam[team._id].map((r) => r.game_id)).length
      return {
        team_id: team._id,
        match_wins: makeUnique(recordsByTeam[team._id].map((r) => r.match_id_win)).length,
        game_differential: wins - (played - wins),
      }
    })
    .sort((a, b) => {
      /**
       * standings sorting goes:
       * 1) matches won
       * 2) game differential
       * 3) head-to-head
       */
      const matchWin = b.match_wins - a.match_wins
      if (matchWin) return matchWin
      const gameDiff = b.game_differential - a.game_differential
      if (gameDiff) return gameDiff
      const gamesAgainst = recordsByTeam[b.team_id].filter((r) => r.opponent_team_id === a.team_id)
      const gamesWonAgainst = gamesAgainst.filter((r) => !!r.game_id_win).length
      const gamesLostAgainst = gamesAgainst.length - gamesWonAgainst
      return gamesWonAgainst - gamesLostAgainst
    })
  next()
}

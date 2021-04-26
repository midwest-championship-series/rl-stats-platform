const { Leagues } = require('../model/mongodb')
const compareIds = require('../util/compare-ids')
const { UnRecoverableError } = require('../util/errors')

module.exports = async (teams, leagueId) => {
  const teamIds = teams.map((t) => t._id)
  // get current_season from league
  const league = await Leagues.findById(leagueId).populate({
    path: 'current_season',
    populate: {
      path: 'matches',
    },
  })
  // search through matches in current season for one that has teams which were identified
  const match = league.current_season.matches.find((match) => {
    return match.status === 'open' && match.team_ids.every((id1) => !!teamIds.find((id2) => compareIds(id1, id2)))
  })
  if (!match) {
    throw new UnRecoverableError(
      'NO_MATCH_FOUND',
      `found 0 matches between teams: ${teams.map((t) => t.name).join(', ')}`,
    )
  }
  // if match.week is too far away from current league week (and match is open) throw an error
  if (Math.abs(match.week - parseInt(league.current_week)) > 1) {
    throw new UnRecoverableError(
      `WEEK_OUT_OF_BOUNDS`,
      `found match for week ${match.week} but league is on week ${league.current_week}`,
    )
  }
  return match._id
}

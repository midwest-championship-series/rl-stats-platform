const identifyPlayers = require('./identify-players')
const identifyTeams = require('./identify-teams')
const identifyMatch = require('./identify-match')
const { Matches } = require('../model/mongodb')

module.exports = async (games, event) => {
  const { league_id, match_id } = event
  const context = {}
  context.players = await identifyPlayers(games)
  context.teams = await identifyTeams(context.players) // could be more than 2 teams if error OR if players are on teams in multiple leagues
  const matchId = match_id ? match_id : await identifyMatch(context.teams, league_id)
  context.match = await Matches.findById(matchId).populate({
    path: 'season',
    populate: {
      path: 'league',
    },
  })
  context.season = context.match.season
  context.league = context.match.season.league
}

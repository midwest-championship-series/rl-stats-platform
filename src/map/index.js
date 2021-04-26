const identifyPlayers = require('./identify-players')
const identifyTeams = require('./identify-teams')
const identifyMatch = require('./identify-match')
const { Matches, Games } = require('../model/mongodb')

const getContext = async (games, event) => {
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
  if (context.match.games.length > 0) {
    context.games = context.match.games
  } else {
    context.games = games.map((g) => {
      return new Games({
        replay_origin: g.replay_origin,
        replay_stored: g.replay_stored,
        date_time_played: g.date,
      })
    })
  }
  return context
}

module.exports = async (games, event) => {
  // get league context ()
  const context = await getContext(games, event)
  // map context to data output
  // flatten
  // update data
  for (let game of context.games) {
    game.date_time_processed = Date.now()
    await game.save()
  }
  /** @todo update the players-to-teams map on match */
  await context.match.save()
}

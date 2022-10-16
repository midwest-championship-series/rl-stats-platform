const ballchasing = require('./services/ballchasing')
const { Model: Players } = require('./model/mongodb/players')
const { Model: Teams } = require('./model/mongodb/teams')
const { Model: Games } = require('./model/mongodb/games')
const { Model: Matches } = require('./model/mongodb/matches')
const { Model: Leagues } = require('./model/mongodb/leagues')
const aws = require('./services/aws')
const processMatch = require('./producers')
const processForfeit = require('./producers/forfeit')
const { getPlayerTeamsAtDate } = require('./producers/common')
const { RecoverableError, UnRecoverableError } = require('./util/errors')
const { eventBridge } = require('./services/aws')

const producedStatsBucket = process.env.PRODUCED_STATS_BUCKET

const validateFilters = ({ league_id, match_id, report_games }) => {
  if (match_id) return
  if (!league_id || !report_games)
    throw new UnRecoverableError('INVALID_CRITERIA', 'no league id or games passed for new match')
}

const getEarliestGameDate = (games) =>
  games.length > 0 && new Date(games.sort((a, b) => (a.date > b.date ? 1 : -1))[0].date)

const getUniqueMatchPlayers = (games) => {
  return games
    .reduce((result, game) => {
      return result.concat(
        ['blue', 'orange'].reduce((players, color) => {
          return players.concat(
            game[color].players.map((p) => {
              p.color = color
              return p
            }),
          )
        }, []),
      )
    }, [])
    .reduce((result, item) => {
      if (!result.some((r) => r.id.platform === item.id.platform && r.id.id === item.id.id)) {
        result.push(item)
      }
      return result
    }, [])
}

const getUnlinkedPlayers = (linked, all) => {
  const linkedAccounts = linked.reduce((result, player) => {
    return result.concat(player.accounts)
  }, [])
  return all
    .map((p) => ({ name: p.name, platform: p.id.platform, platform_id: p.id.id }))
    .filter((p) => !linkedAccounts.some((acc) => p.platform === acc.platform && p.platform_id === acc.platform_id))
}

/**
 * takes games from ballchasing and returns a mongodb query for all of the players' ids
 */
const buildPlayersQuery = (games) => {
  return {
    $or: getUniqueMatchPlayers(games).map((player) => ({
      accounts: {
        $elemMatch: {
          platform: player.id.platform,
          platform_id: player.id.id,
        },
      },
    })),
  }
}

const buildTeamsQuery = (players, matchDate, mentionedTeams) => {
  const teamIds = players.reduce((result, player) => {
    if (player.team_history && player.team_history.length > 0) {
      result.push(...getPlayerTeamsAtDate(player, matchDate).map((item) => item.team_id.toHexString()))
    }
    return result
  }, [])
  const unique = [...new Set([...teamIds, ...mentionedTeams])]
  return { $or: unique.map((id) => ({ _id: id })) }
}

const buildMatchesQuery = (teamIds) => {
  return { $and: teamIds.map((id) => ({ team_ids: id })), status: 'open' }
}

const getMatchInfoById = async (matchId) => {
  const match = await Matches.findById(matchId)
    .populate('games')
    .populate('teams')
    .populate({
      path: 'season',
      populate: { path: 'league' },
    })
  return { match, teams: match.teams, season: match.season, league: match.season.league }
}

const identifyPlayers = async (gamesData, gameIds) => {
  const players = []
  if (gamesData.length > 0) {
    players.push(...(await Players.find(buildPlayersQuery(gamesData))))
    if (players.length < 1) {
      const errMsg = `no players found for games: ${gameIds.join(', ')}`
      throw new UnRecoverableError('NO_IDENTIFIED_PLAYERS', errMsg)
    }
  }
  return players
}

/** make sure that the players are always on the same teams in all the game data (not color dependent) */
const validateGameTeams = (gamesData) => {
  const colors = ['blue', 'orange']
  const team1Players = gamesData[0].orange.players
  const team2Players = gamesData[0].blue.players
  /** @todo come back and make sure that the original team being incorrect can't screw this up */
  // const teamCombinations = gamesData.map((game) => {
  //   return colors.map((color) => {
  //     return {
  //       color,
  //       players: game[color].players.map((player) => `${player.id.platform}:${player.id.id}`),
  //     }
  //   })
  // })
  const validateTeamPlayers = (originalTeam, gameTeam) => {
    const errors = []
    originalTeam.forEach((player) => {
      const playerMatch = gameTeam.find((p) => p.id.platform === player.id.platform && p.id.id === player.id.id)
      if (!playerMatch) {
        errors.push(`no match found for player: ${player.name}.`)
      }
    })
    return errors
  }
  gamesData.forEach((game) => {
    const team1Color = colors.find((color) =>
      game[color].players.some(
        (player) => player.id.platform === team1Players[0].id.platform && player.id.id === team1Players[0].id.id,
      ),
    )
    const team2Color = colors.filter((c) => c !== team1Color)[0]
    const errors = validateTeamPlayers(team1Players, game[team1Color].players).concat(
      validateTeamPlayers(team2Players, game[team2Color].players),
    )
    if (errors.length > 0) {
      let errMsg = `team mismatch found in game: ${game.id}. errors: ${errors.join(', ')}`
      throw new UnRecoverableError('TEAM_MISMATCH_IN_GAME_DATA', errMsg)
    }
  })
}

/** does all of the team and player mapping/validation at once */
const buildPlayerTeamMap = async (leagueId, players, gamesData, matchDate, mentionedTeams) => {
  const league = await Leagues.findById(leagueId).populate({
    path: 'current_season',
    populate: 'teams',
  })
  const seasonTeams = league.current_season.teams
  const allTeams = await Teams.find(buildTeamsQuery(players, matchDate, mentionedTeams))
  const playerTeamMap = getUniqueMatchPlayers(gamesData).map((matchPlayer) => {
    return {
      player: players.find(
        (p) =>
          p.accounts &&
          p.accounts.some((acc) => acc.platform === matchPlayer.id.platform && acc.platform_id === matchPlayer.id.id),
      ),
      playerGameData: matchPlayer,
    }
  })

  const unlinkedPlayers = playerTeamMap.filter((p) => !p.player).map((p) => p.playerGameData)
  if (unlinkedPlayers.length > 0) {
    const newPlayers = await createUnlinkedPlayers(unlinkedPlayers)
    console.info('created players', newPlayers)
    throw new RecoverableError(
      'NO_PLAYER_FOUND',
      `created new players:\n${newPlayers.map((p) => `${p.screen_name} _id:${p._id}`).join('\n')}`,
    )
  }

  playerTeamMap.forEach((item) => {
    const { player } = item
    item.teamsAtDate = getPlayerTeamsAtDate(player, matchDate)
      .map(({ team_id }) => allTeams.find((team) => team._id.equals(team_id)))
      .filter((t) => !!t) // primarily for tests, but i suppose it's possible this could defend against data errors

    const leagueTeams = seasonTeams.filter((seasonTeam) =>
      item.teamsAtDate.some((teamAtDate) => teamAtDate._id.equals(seasonTeam._id)),
    )

    if (leagueTeams.length > 1) {
      let errMsg = `player: ${player.screen_name} mapped to ${leagueTeams.length} teams in the league: ${league.name}`
      throw new UnRecoverableError('PLAYER_ON_MULTIPLE_LEAGUE_TEAMS', errMsg)
    }
    item.team = leagueTeams[0]
    item.sub = !item.team // if main team is not found, player is a sub
  })

  // validate franchises
  const allFranchises = [
    ...new Set(
      playerTeamMap
        .reduce(
          (result, item) => {
            result.push(...item.teamsAtDate.map((team) => team.franchise_id))
            return result
          },
          mentionedTeams.map((id) => allTeams.find((t) => t._id.equals(id)).franchise_id),
        )
        .filter((id) => !!id)
        .map((id) => id.toHexString()),
    ),
  ]
  if (allFranchises.length !== 2) {
    let errMsg = `expected to identify match between 2 franchises, but found ${
      allFranchises.length
    }. Franchises: ${allFranchises.join(', ')}.\nPlayers:\n`
    for (let { player, teamsAtDate } of playerTeamMap) {
      errMsg += `${player.screen_name}: `
      errMsg += teamsAtDate.map(({ name }) => name).join(', ')
      errMsg += `\n`
    }
    console.log(errMsg)
    throw new UnRecoverableError('FRANCHISES_NOT_IDENTIFIED', errMsg)
  }
  // set sub teams
  const franchiseTeams = allFranchises.map((f) => seasonTeams.find((t) => t.franchise_id.equals(f)))
  playerTeamMap
    .filter((item) => item.sub)
    .forEach((item) => {
      item.team = franchiseTeams.find((ft) => item.teamsAtDate.find((t) => t.franchise_id.equals(ft.franchise_id)))
    })
  gamesData.forEach((game) => {
    const colors = ['blue', 'orange']
    colors.forEach((color) => {
      const team = playerTeamMap.find((item) => {
        const player = item.playerGameData
        return (
          item.team && game[color].players.some((p) => p.id.platform === player.id.platform && p.id.id === player.id.id)
        )
      }).team
      if (!team) {
        let errMsg = `no team identified for ${color} in game: ${game.id}.`
        throw new UnRecoverableError('NO_TEAM_IDENTIFIED', errMsg)
      }
      game[color].team = team
    })
  })
  playerTeamMap.forEach((item) => {
    // if we didn't find them to be on a team that matched a league franchise at the date of the game, find one of the other players with an identified team that played with them
    if (!item.team) {
      const game1color = ['blue', 'orange'].find((color) =>
        gamesData[0][color].players.some(
          (p) => p.id.platform === item.playerGameData.id.platform && p.id.id === item.playerGameData.id.id,
        ),
      )
      item.team = gamesData[0][game1color].team
    }
  })

  return {
    playersToTeams: playerTeamMap,
    teams: gamesData[0] ? [gamesData[0].orange.team, gamesData[0].blue.team] : allTeams,
  }
}

const identifyMatch = async (leagueId, teams) => {
  const matches = (
    await Matches.find(buildMatchesQuery(teams))
      .sort({ week: 'asc' })
      .populate('games')
      .populate({
        path: 'season',
        populate: { path: 'league' },
      })
  ).filter((m) => m.season && m.season.league && m.season.league._id.equals(leagueId))

  const match = matches[0]
  if (!match) {
    throw new UnRecoverableError(
      'NO_MATCH_FOUND',
      `found 0 matches between teams: ${teams.map((t) => t.name).join(', ')}`,
    )
  }
  return { match, teams, season: match.season, league: match.season.league }
}

const createUnlinkedPlayers = (players) => {
  return Promise.all(
    players.map((p) => {
      return Players.create({
        screen_name: p.name.trim(),
        accounts: [{ platform: p.id.platform, platform_id: p.id.id }],
      })
    }),
  )
}

const uploadStats = async (matchId, team_games, player_games, fileName, processedAt) => {
  const s3Data = await aws.s3.uploadJSON(producedStatsBucket, fileName, {
    matchId,
    team_games,
    player_games,
    processedAt,
  })
  console.info(`emitting match ${matchId} to ${s3Data.Location}`)
  await eventBridge.emitEvent({
    type: 'MATCH_PROCESS_ENDED',
    detail: {
      match_id: matchId,
      bucket: {
        source: producedStatsBucket,
        key: fileName,
      },
    },
  })
}

const validateMatchDate = (match, gamesData) => {
  if (match.status === 'open' && !!match.scheduled_datetime) {
    gamesData.forEach((game) => {
      const gameDate = new Date(game.date)
      const oneWeek = 1000 * 3600 * 24 * 7
      if (Math.abs(gameDate - match.scheduled_datetime) > oneWeek) {
        const errMsg = `expected match within 1 week of ${match.scheduled_datetime} but received game played on ${gameDate}`
        throw new UnRecoverableError('ERR_DATE_MISMATCH', errMsg)
      }
    })
  }
}

const combineGames = (replayGames, manualGames) => {
  manualGames
    .sort((a, b) => new Date(a.game_number) - new Date(b.game_number))
    .map((game) => {
      replayGames.splice(game.game_number - 1, 0, game)
    })
}

const handleReplays = async (filters, processedAt) => {
  const options = { mentioned_team_ids: [] }
  console.info('validating filters')
  validateFilters(filters)
  const { league_id, match_id, report_games, mentioned_team_ids } = { ...options, ...filters }
  // separate games which have replay data from full manual reports
  const { replayGames, manualGames } = report_games.reduce(
    (result, game) => {
      if (game.id) {
        result.replayGames.push(game)
      } else {
        result.manualGames.push(game)
      }
      return result
    },
    { replayGames: [], manualGames: [] },
  )
  const game_ids = replayGames.map((g) => g.id)
  console.info('retrieving replays')
  const gamesData = (await ballchasing.getReplayData(game_ids)).sort((a, b) => new Date(a.date) - new Date(b.date))
  if (gamesData.length > 0) {
    validateGameTeams(gamesData)
  }

  console.info('retrieving players')
  const players = await identifyPlayers(gamesData, game_ids)

  console.info('building player map')
  const { playersToTeams, teams } = await buildPlayerTeamMap(
    league_id,
    players,
    gamesData,
    getEarliestGameDate(gamesData),
    mentioned_team_ids,
  )

  console.info('retrieving league info')
  const { league, season, match } = await (match_id
    ? getMatchInfoById(match_id) // this is a reprocessed match
    : identifyMatch(league_id, teams)) // this is a new match

  console.info('validating date')
  validateMatchDate(match, gamesData)

  combineGames(gamesData, manualGames)
  let games
  if (!match.games || match.games.length < 1) {
    // create games
    games = gamesData.map((g) => {
      if (g.report_type === 'MANUAL_REPORT') {
        return new Games({
          winning_team_id: g.winning_team_id,
          forfeit_team_id: g.forfeit
            ? teams.filter((t) => !t._id.equals(g.winning_team_id))[0]._id.toHexString()
            : undefined,
          report_type: 'MANUAL_REPORT',
          /**
           * @todo remove this assignment of teams to orange/blue
           * it's just easy while still using ballchasing's format but it doesn't make sense
           */
          raw_data: { ...g, orange: { team: teams[0] }, blue: { team: teams[1] } },
        })
      } else {
        return new Games({
          replay_origin: { source: 'ballchasing', key: g.id },
          rl_game_id: g.rocket_league_id,
          date_time_played: g.date,
          raw_data: g,
        })
      }
    })
    // update match
    match.game_ids = games.map((g) => g._id)
  } else {
    match.games.forEach((g) => (g.raw_data = gamesData.find((gm) => gm.id && gm.id === g.replay_origin.key)))
    games = match.games.sort((a, b) => new Date(a.raw_data.date) - new Date(b.raw_data.date))
  }

  games.forEach((g, index) => (g.game_number = index + 1)) // reassign game numbers

  console.info('processing match stats')
  const { teamStats, playerStats } = processMatch(
    {
      league,
      season,
      match,
      games,
      teams,
      players,
    },
    playersToTeams,
    processedAt,
  )
  console.info('uploading match stats')
  await uploadStats(
    match._id.toHexString(),
    teamStats,
    playerStats,
    `match:${match._id.toHexString()}.json`,
    processedAt,
  )

  for (let game of games) {
    game.date_time_processed = Date.now()
    await game.save()
  }
  match.players_to_teams = playersToTeams.map((item) => ({ player_id: item.player._id, team_id: item.team._id }))
  await match.save()

  return {
    match_id: match._id.toHexString(),
    game_ids: games.map(({ _id }) => _id.toHexString()),
    league,
    season,
    match,
    games,
    teams,
    players,
    teamStats,
    playerStats,
  }
}

const handleForfeit = async (filters, processedAt) => {
  const { forfeit_team_id, match_id } = filters
  const match = await Matches.findById(match_id)
    .populate('teams')
    .populate({
      path: 'season',
      populate: {
        path: 'league',
      },
    })
  const forfeit_date = match.forfeit_datetime || match.scheduled_datetime || new Date()
  const players = await Players.find().onTeams(match.team_ids, forfeit_date)
  const { teams, season } = match
  const league = season.league
  if (!match.best_of) {
    throw new UnRecoverableError('MISSING_BEST_OF', 'forfeited match must have best_of property')
  }
  const { teamStats, playerStats } = processForfeit(
    {
      league,
      season,
      match,
      teams,
      players,
      forfeit_team_id,
      forfeit_date,
    },
    processedAt,
  )

  await uploadStats(match._id.toHexString(), teamStats, [], `match:${match._id.toHexString()}.json`, processedAt)

  match.forfeited_by_team = forfeit_team_id
  match.forfeit_datetime = forfeit_date
  await match.save()

  return {
    match_id: match._id.toHexString(),
    league,
    season,
    match,
    teams,
    players,
    teamStats,
    playerStats,
    forfeit_team_id,
    forfeit_date,
  }
}

/**
 * takes a match and game ids and updates stat data
 * @param {{ match_id, game_ids }} matchInfo match_id can be undefined, game_ids are the ballchasing game ids
 */
module.exports = async (filters) => {
  const processedAt = Date.now()
  if (filters.forfeit_team_id) {
    return handleForfeit(filters, processedAt)
  } else {
    return handleReplays(filters, processedAt)
  }
}

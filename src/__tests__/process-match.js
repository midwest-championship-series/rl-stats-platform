const fs = require('fs')
const path = require('path')
const { ObjectId } = require('mongodb')

const mockDoc = obj => {
  obj.save = jest.fn()
  return obj
}

// mock data
const mockPlayers = [
  {
    _id: ObjectId('5ec04239d09245d2a7d4fa26'),
    accounts: [
      {
        platform: 'steam',
        platform_id: '76561198059743159',
        screen_name: 'Calster',
      },
    ],
    discord_id: '191639902100783108',
    screen_name: 'Calster',
    team_history: [
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e86'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: ObjectId('5ec04239d09245d2a7d4fa48'),
    accounts: [
      {
        platform: 'steam',
        platform_id: '76561198247336622',
        screen_name: 'Cheezy',
      },
    ],
    discord_id: '369948469986852874',
    screen_name: 'Cheezy',
    team_history: [
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e86'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: new ObjectId('5ec04239d09245d2a7d4fa69'),
    old_id: 'be5c1af1-0beb-45a8-be4d-d5e795212630',
    __v: 9,
    accounts: [
      {
        _id: new ObjectId('5ec71e0df8cd8616fa91002e'),
        platform: 'steam',
        platform_id: '76561198047988955',
        screen_name: 'Delephant',
      },
    ],
    discord_id: '198638770390564864',
    old_league_id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3',
    old_team_id: '14c44087-6711-434e-bcfc-199b98800d74',
    screen_name: 'Delephant',
    team_history: [
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e86'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
        date_left: new Date('2020-08-10T05:00:00.000Z'),
      },
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e5a'),
        date_joined: new Date('2020-08-10T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: ObjectId('5ec04239d09245d2a7d4fa4f'),
    accounts: [
      {
        platform: 'steam',
        platform_id: '76561198451113295',
        screen_name: 'Pace.',
      },
      {
        platform: 'xbox',
        platform_id: 'lKEsEv2WW4xbJoCkDzsHsVUwoiDtjAvjNm-azk_riXE',
        screen_name: 'Pace.',
      },
    ],
    discord_id: '560642215144194068',
    screen_name: 'Pace.',
    team_history: [
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: ObjectId('5ec04239d09245d2a7d4fa52'),
    accounts: [
      {
        platform: 'steam',
        platform_id: '76561198397509094',
        screen_name: 'Lege',
      },
    ],
    discord_id: '312301326841151490',
    screen_name: 'Lege',
    team_history: [
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: new ObjectId('5ec9358f8c0dd900074685cd'),
    __v: 3,
    accounts: [
      { platform: 'steam', platform_id: '76561198400821586' },
      { platform: 'steam', platform_id: '76561198118651841' },
      {
        platform: 'xbox',
        platform_id: 'mU6LQmC-7bIjMhkYyGkyDlTiApC9PnY9WPS58rF4PBs',
      },
      { platform: 'epic', platform_id: 'bee3371256b041dfa521f3dd7878dabf' },
    ],
    discord_id: '171031002536214529',
    screen_name: 'MARKsmanRL',
    team_history: [
      {
        _id: new ObjectId('5f2854b8a5a63b00085cccf3'),
        team_id: new ObjectId('5ec9358d8c0dd900074685c1'),
        date_joined: { $date: '2020-03-21T00:00:00.000Z' },
        date_left: { $date: '2020-10-11T20:48:15.000Z' },
      },
    ],
    avatar: 'https://cdn.discordapp.com/avatars/171031002536214529/85cf7e62d05a91b2ca41d7e7766c0686.png',
    permissions: [],
  },
]
const mockTeams = [
  {
    _id: ObjectId('5ebc62a9d09245d2a7c62e86'),
    discord_id: '688286287655993365',
    name: 'Duluth Superiors',
  },
  {
    _id: ObjectId('5ebc62a9d09245d2a7c62eb3'),
    discord_id: '688286346783359027',
    name: 'Burnsville Inferno',
  },
]
const mockClosedMatch = mockDoc({
  _id: ObjectId('5ebc62b0d09245d2a7c6340c'),
  week: 1,
  game_ids: [
    '5ebc62afd09245d2a7c6333f',
    '5ebc62afd09245d2a7c63338',
    '5ebc62afd09245d2a7c6335e',
    '5ebc62afd09245d2a7c63350',
  ],
  best_of: 5,
  teams: mockTeams,
  games: [
    mockDoc({
      _id: ObjectId('5ebc62afd09245d2a7c6333f'),
      ballchasing_id: '9aee7f5f-7d75-40b0-8116-a8e1e2c9d4c5',
    }),
    mockDoc({
      _id: ObjectId('5ebc62afd09245d2a7c63338'),
      ballchasing_id: '6903ac8a-d480-4f41-84a0-321ffb5cd17d',
    }),
    mockDoc({
      _id: ObjectId('5ebc62afd09245d2a7c6335e'),
      ballchasing_id: '2493a4bd-aeb5-49ba-8cac-059cc99865c1',
    }),
    mockDoc({
      _id: ObjectId('5ebc62afd09245d2a7c63350'),
      ballchasing_id: '111c0144-7219-426a-8263-8cff260d030d',
    }),
  ],
  season: {
    _id: ObjectId('5ebc62b0d09245d2a7c63477'),
    name: '1',
    season_type: 'REG',
    league: {
      _id: ObjectId('5ebc62b1d09245d2a7c63516'),
      name: 'mncs',
    },
  },
})
const mockOpenMatch = () =>
  mockDoc({
    _id: ObjectId('5ebc62b0d09245d2a7c6340c'),
    week: 1,
    game_ids: [],
    best_of: 5,
    season: {
      _id: ObjectId('5ebc62b0d09245d2a7c63477'),
      name: '1',
      season_type: 'REG',
      league: {
        _id: ObjectId('5ebc62b1d09245d2a7c63516'),
        name: 'mncs',
      },
    },
  })

// mocks
jest.mock('../services/mongodb')
const ballchasing = require('../services/ballchasing')
jest.mock('../services/ballchasing')
const elastic = require('../services/elastic')
jest.mock('../services/elastic')
const aws = require('../services/aws')
jest.mock('../services/aws')
const games = require('../model/mongodb/games')
jest.mock('../model/mongodb/games')
class Game {
  constructor(init) {
    for (let prop in init) {
      this._id = new ObjectId()
      this[prop] = init[prop]
    }
  }
  save() {}
}
games.Model = Game
const matches = require('../model/mongodb/matches')
jest.mock('../model/mongodb/matches')
const matchesFindMock = jest.fn()
const matchesFindByIdMock = jest.fn()
class Match {
  constructor() {}
}
Match.find = jest.fn(() => ({
  sort: jest.fn(() => ({
    populate: jest.fn(() => ({ populate: matchesFindMock })),
  })),
}))
Match.findById = jest.fn(() => ({
  populate: jest.fn(() => ({ populate: jest.fn(() => ({ populate: matchesFindByIdMock })) })),
}))
matches.Model = Match
const players = require('../model/mongodb/players')
jest.mock('../model/mongodb/players')
players.Model = {
  create: jest.fn(),
  find: jest.fn(),
  onTeams: jest.fn(),
}
const teams = require('../model/mongodb/teams')
jest.mock('../model/mongodb/teams')
const teamsFindMock = jest.fn()
teams.Model = {
  find: teamsFindMock,
}
const leagues = require('../model/mongodb/leagues')
const leaguesFindByIdMock = jest.fn().mockResolvedValue({
  current_season: {
    team_ids: [
      new ObjectId('5ebc62a9d09245d2a7c62e5a'),
      new ObjectId('5ebc62a9d09245d2a7c62e82'),
      new ObjectId('5ebc62a9d09245d2a7c62e86'),
      new ObjectId('5ebc62a9d09245d2a7c62eba'),
      new ObjectId('5ebc62a9d09245d2a7c62eb3'),
      new ObjectId('5ebc62a9d09245d2a7c62eae'),
      new ObjectId('5ebc62aad09245d2a7c62eed'),
      new ObjectId('5ebc62aad09245d2a7c62ef8'),
      new ObjectId('5ebc62aad09245d2a7c62ef9'),
      new ObjectId('5ebc62aad09245d2a7c62efc'),
    ],
  },
})
leagues.Model = {
  findById: jest.fn(() => ({ populate: leaguesFindByIdMock })),
}

const processMatch = require('../process-match')

describe('process-match', () => {
  let replays
  beforeEach(() => {
    replays = JSON.parse(fs.readFileSync(path.join(__dirname, 'replays.json')))
    ballchasing.getReplays.mockResolvedValue(replays)
  })
  afterEach(() => {
    elastic.indexDocs.mockClear()
    aws.s3.uploadJSON.mockClear()
  })
  it('should process a match with a match_id', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    matchesFindByIdMock.mockResolvedValue(mockClosedMatch)
    const result = await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        '5ebc62afd09245d2a7c6333f',
        '5ebc62afd09245d2a7c63338',
        '5ebc62afd09245d2a7c6335e',
        '5ebc62afd09245d2a7c63350',
      ],
    })
    expect(result.games).toHaveLength(4)
    expect(result.games[0].winning_team_id).toEqual(new ObjectId('5ebc62a9d09245d2a7c62e86'))
    expect(players.Model.find).toHaveBeenCalledWith({
      $or: [
        {
          accounts: {
            $elemMatch: {
              platform: 'steam',
              platform_id: '76561198059743159',
            },
          },
        },
        {
          accounts: {
            $elemMatch: {
              platform: 'steam',
              platform_id: '76561198047988955',
            },
          },
        },
        {
          accounts: {
            $elemMatch: {
              platform: 'steam',
              platform_id: '76561198247336622',
            },
          },
        },
        {
          accounts: {
            $elemMatch: {
              platform: 'steam',
              platform_id: '76561198451113295',
            },
          },
        },
        {
          accounts: {
            $elemMatch: {
              platform: 'steam',
              platform_id: '76561198118651841',
            },
          },
        },
        {
          accounts: {
            $elemMatch: {
              platform: 'steam',
              platform_id: '76561198397509094',
            },
          },
        },
      ],
    })
    expect(matches.Model.findById).toHaveBeenCalledWith('5ebc62b0d09245d2a7c6340c')
    expect(elastic.indexDocs.mock.calls.length).toBe(2)
    expect(elastic.indexDocs.mock.calls[0][2]).toEqual(['team_id', 'game_id_total'])
    expect(elastic.indexDocs.mock.calls[1][2]).toEqual(['player_id', 'game_id_total'])
    expect(mockClosedMatch).toHaveProperty('winning_team_id')
    expect(mockClosedMatch.winning_team_id).toEqual(new ObjectId('5ebc62a9d09245d2a7c62e86'))
    expect(mockClosedMatch).toHaveProperty('players_to_teams')
    expect(mockClosedMatch.players_to_teams).toEqual([
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa26'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e86'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa48'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e86'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa69'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62e86'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa4f'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
      },
      {
        player_id: new ObjectId('5ec9358f8c0dd900074685cd'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa52'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
      },
    ])
    const uploadStaticStats = aws.s3.uploadJSON.mock.calls
    expect(uploadStaticStats).toHaveLength(1)
    expect(uploadStaticStats[0][0]).toEqual('stats bucket name')
    expect(uploadStaticStats[0][1]).toEqual('match:5ebc62b0d09245d2a7c6340c.json')
    const { processedAt, teamStats, playerStats, matchId } = uploadStaticStats[0][2]
    expect(matchId).toEqual('5ebc62b0d09245d2a7c6340c')
    expect(processedAt / 1000).toBeCloseTo(Date.now() / 1000, 0)
    expect(teamStats).toHaveLength(8)
    expect(playerStats).toHaveLength(24)
  })
  it('should process team stats', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue(mockClosedMatch)
    await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(elastic.indexDocs.mock.calls.length).toBe(2)
    const teamStats = elastic.indexDocs.mock.calls[0][0]
    expect(teamStats).toHaveLength(8)
    expect(teamStats[0].epoch_processed / 100).toBeCloseTo(Date.now() / 100, 0)
    const findStats = filters => teamStats.filter(s => Object.keys(filters).every(key => s[key] == filters[key]))
    expect(findStats({ game_id: '5ebc62afd09245d2a7c6333f', team_id: '5ebc62a9d09245d2a7c62e86' })[0]).toMatchObject({
      game_id_overtime_game: '5ebc62afd09245d2a7c6333f',
      overtime_seconds_played: 124,
    })
    expect(teamStats[6]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      team_color: 'blue',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: '5ebc62afd09245d2a7c63338',
      game_id_win: '5ebc62afd09245d2a7c63338',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_id_win_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_id_overtime_game: undefined,
      game_number: '4',
      game_date: '2020-03-19T21:35:38Z',
      map_name: 'Utopia Coliseum',
      games_played: 1,
      wins: 1,
      shots: 5,
      opponent_shots: 7,
      goals: 3,
      opponent_goals: 2,
      saves: 5,
      opponent_saves: 1,
      assists: 3,
      opponent_assists: 2,
      ms_played: 351000,
      overtime_seconds_played: undefined,
      demos_inflicted: 2,
      demos_taken: 5,
      amount_collected: 6608,
      amount_stolen: 1225,
      amount_used_while_supersonic: 797,
      ms_zero_boost: 162580,
      ms_full_boost: 79400,
    })
    expect(teamStats[7]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_id: '5ebc62a9d09245d2a7c62e86',
      game_id_win: undefined,
      match_id_win: undefined,
      game_id_win_total: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_number: '4',
    })
  })
  it('should process player stats', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue(mockClosedMatch)
    await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    const playerStats = elastic.indexDocs.mock.calls[1][0]
    const findPlayerStats = criteria => {
      return playerStats.filter(stat => Object.keys(criteria).every(key => stat[key] === criteria[key]))
    }
    // ensure there are 6 player records per game
    expect(playerStats).toHaveLength(24)
    expect(playerStats[0].epoch_processed / 100).toBeCloseTo(Date.now() / 100, 0)
    expect(findPlayerStats({ game_id: '5ebc62afd09245d2a7c63338' })).toHaveLength(6)
    expect(
      findPlayerStats({ player_id: '5ec04239d09245d2a7d4fa26', game_id: '5ebc62afd09245d2a7c63338' })[0],
    ).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa26',
      player_name: 'Calster',
      player_platform: 'steam',
      player_platform_id: '76561198059743159',
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      team_color: 'blue',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: '5ebc62afd09245d2a7c63338',
      game_id_win: '5ebc62afd09245d2a7c63338',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_id_win_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_id_overtime_game: undefined,
      game_number: '4',
      game_date: '2020-03-19T21:35:38Z',
      map_name: 'Utopia Coliseum',
      games_played: 1,
      wins: 1,
      shots: 2,
      goals: 1,
      saves: 2,
      assists: 1,
      score: 493,
      mvps: 1,
      ms_played: 351728,
      overtime_seconds_played: undefined,
      demos_inflicted: 0,
      demos_taken: 2,
      amount_collected: 2461,
      amount_stolen: 410,
      amount_used_while_supersonic: 212,
      ms_zero_boost: 52950,
      ms_full_boost: 23460,
    })
    expect(
      findPlayerStats({ player_id: '5ec04239d09245d2a7d4fa52', game_id: '5ebc62afd09245d2a7c63338' })[0],
    ).toMatchObject({
      game_id_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_id_win_total: undefined,
    })
    expect(
      findPlayerStats({ player_id: '5ec04239d09245d2a7d4fa26', game_id: '5ebc62afd09245d2a7c6333f' })[0],
    ).toMatchObject({
      game_id_overtime_game: '5ebc62afd09245d2a7c6333f',
      overtime_seconds_played: 124,
    })
    findPlayerStats({ game_id: '5ebc62afd09245d2a7c63338' })
      .filter(stat => stat.player_id !== '5ec04239d09245d2a7d4fa26')
      .forEach(stat => {
        expect(stat).toMatchObject({ mvps: 0 })
      })
    findPlayerStats({ game_id: '5ebc62afd09245d2a7c63338' }).forEach(stat => {
      if (stat.team_id === '5ebc62a9d09245d2a7c62eb3') {
        expect(stat).toMatchObject({ game_id_win: undefined, match_id_win: undefined })
      } else {
        expect(stat).toMatchObject({
          game_id_win: '5ebc62afd09245d2a7c63338',
          match_id_win: '5ebc62b0d09245d2a7c6340c',
        })
      }
    })
  })
  it('should process a new match', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    const result = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(result.game_ids).toHaveLength(4)
  })
  it('should process a match when teams are scheduled in multiple leagues', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    const mockMatches = [mockOpenMatch(), mockOpenMatch()]
    mockMatches[0].season.league._id = new ObjectId()
    matchesFindMock.mockResolvedValue(mockMatches)
    await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
  })
  it('should process a forfeit', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockClosedMatch,
      games: [],
      game_ids: [],
    })
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ebc62a9d09245d2a7c62e86',
      reply_to_channel: '692994579305332806',
    })
    expect(elastic.indexDocs.mock.calls[0][2]).toEqual(['team_id', 'game_id_total'])
    expect(elastic.indexDocs.mock.calls[1][2]).toEqual(['player_id', 'game_id_total'])
    const teamStats = elastic.indexDocs.mock.calls[0][0]
    const playerStats = elastic.indexDocs.mock.calls[1][0]
    expect(teamStats).toHaveLength(6)
    expect(teamStats[0].epoch_processed / 100).toBeCloseTo(Date.now() / 100, 0)
    expect(teamStats[0]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: undefined,
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      league_name: 'mncs',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_forfeit_win: undefined,
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 0,
      games_played: undefined,
    })
    // requires tests to have run in less than 1 s
    const dateDiff = Math.abs(new Date(teamStats[0].game_date) - Date.now())
    expect(dateDiff).toBeLessThan(1000)
    expect(teamStats[1]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62eb3',
      team_name: 'Burnsville Inferno',
      opponent_team_id: '5ebc62a9d09245d2a7c62e86',
      opponent_team_name: 'Duluth Superiors',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      league_name: 'mncs',
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 1,
      games_played: undefined,
    })
    expect(playerStats).toHaveLength(12)
    expect(playerStats[0].epoch_processed / 100).toBeCloseTo(Date.now() / 100, 0)
    expect(playerStats[0]).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa26',
      player_name: 'Calster',
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      league_name: 'mncs',
      game_id_forfeit_win: undefined,
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 0,
      games_played: undefined,
    })
    expect(playerStats[2]).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa4f',
      player_name: 'Pace.',
      team_id: '5ebc62a9d09245d2a7c62eb3',
      team_name: 'Burnsville Inferno',
      opponent_team_id: '5ebc62a9d09245d2a7c62e86',
      opponent_team_name: 'Duluth Superiors',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      league_name: 'mncs',
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 1,
      games_played: undefined,
    })
    const uploadStaticStats = aws.s3.uploadJSON.mock.calls
    expect(uploadStaticStats).toHaveLength(1)
    expect(uploadStaticStats[0][0]).toEqual('stats bucket name')
    expect(uploadStaticStats[0][1]).toEqual('match:5ebc62b0d09245d2a7c6340c.json')
    const s3Stats = uploadStaticStats[0][2]
    expect(s3Stats.processedAt / 1000).toBeCloseTo(Date.now() / 1000, 0)
    expect(s3Stats.teamStats).toHaveLength(6)
    expect(s3Stats.matchId).toEqual('5ebc62b0d09245d2a7c6340c')
    /** @todo find out why this is 12... it should be (# players on teams) * (# games in match) */
    expect(s3Stats.playerStats).toHaveLength(12)
  })
  it('should process a forfeit with a scheduled date', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockClosedMatch,
      games: [],
      game_ids: [],
      scheduled_datetime: new Date('2020-05-10T05:00:00.000Z'),
    })
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ebc62a9d09245d2a7c62e86',
      reply_to_channel: '692994579305332806',
    })
    const teamStats = elastic.indexDocs.mock.calls[0][0]
    expect(teamStats).toHaveLength(6)
    const playerStats = elastic.indexDocs.mock.calls[1][0]
    expect(playerStats).toHaveLength(15)
  })
  it('should process a forfeit with a different best_of condition', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockClosedMatch,
      best_of: 1,
      games: [],
      game_ids: [],
    })
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ebc62a9d09245d2a7c62e86',
      reply_to_channel: '692994579305332806',
    })
    const teamStats = elastic.indexDocs.mock.calls[0][0]
    const playerStats = elastic.indexDocs.mock.calls[1][0]
    expect(teamStats).toHaveLength(2)
    expect(playerStats).toHaveLength(4)
  })
  it('should fail if forfeit match does not have best_of condition', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockClosedMatch,
      best_of: undefined,
      games: [],
      game_ids: [],
    })
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        match_id: '5f2c5e4e08c88e00084b44a6',
        forfeit_team_id: '5ebc62a9d09245d2a7c62e86',
        reply_to_channel: '692994579305332806',
      }),
    ).rejects.toEqual(new Error('forfeited match must have best_of property'))
  })
  it('should not add stats for games which are not played by league teams', async () => {
    players.Model.find.mockResolvedValue([mockPlayers[0]])
    const mockTeam = { _id: new ObjectId('5ebc62a9d09245d2a7c62e5a') }
    teams.Model.find.mockResolvedValue([mockTeam])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
          '4ed12225-7251-4d63-8bb6-15338c60bcf2',
        ],
      }),
    ).rejects.toEqual(
      new Error(`expected to process match between two teams but got 1. Teams: ${mockTeam._id.toHexString()}.`),
    )
  })
  it('should throw an error if the match does not meet best_of requirements', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    ballchasing.getReplays.mockResolvedValue([replays[0], replays[1], replays[3]])
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '111c0144-7219-426a-8263-8cff260d030d',
        ],
      }),
    ).rejects.toEqual(new Error('expected a team to win the best of 5 match, but winning team has only 2'))
  })
  it('should throw an error if less than one match is returned', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
          '4ed12225-7251-4d63-8bb6-15338c60bcf2',
        ],
      }),
    ).rejects.toEqual(new Error('found 0 matches between teams: Duluth Superiors, Burnsville Inferno'))
  })
  it('should throw an error if no league id is passed', async () => {
    await expect(
      processMatch({
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
          '4ed12225-7251-4d63-8bb6-15338c60bcf2',
        ],
      }),
    ).rejects.toEqual(new Error('no league id or game ids passed for new match'))
  })
  it('should create players and throw a recoverable error if players do not exist in league database', async () => {
    const missingPlayers = [...mockPlayers].slice(0, mockPlayers.length - 2)
    players.Model.find.mockResolvedValue(missingPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
          '4ed12225-7251-4d63-8bb6-15338c60bcf2',
        ],
      }),
    ).rejects.toEqual(new Error('NO_PLAYER_FOUND'))
    expect(players.Model.create.mock.calls).toHaveLength(2)
    expect(players.Model.create.mock.calls[0][0]).toMatchObject({ screen_name: 'MARKsman.' })
    expect(players.Model.create.mock.calls[1][0]).toMatchObject({ screen_name: 'Lege' })
  })
})

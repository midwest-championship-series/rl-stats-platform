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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '191639902100783108',
    screen_name: 'Calster',
    updated_at: { $date: '2020-05-16T19:44:06.774Z' },
    team_id: ObjectId('5ebc62a9d09245d2a7c62e86'),
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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '369948469986852874',
    screen_name: 'Cheezy',
    updated_at: { $date: '2020-05-16T19:44:06.822Z' },
    team_id: ObjectId('5ebc62a9d09245d2a7c62e86'),
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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '560642215144194068',
    screen_name: 'Pace.',
    updated_at: { $date: '2020-05-16T19:44:06.979Z' },
    team_id: ObjectId('5ebc62a9d09245d2a7c62eb3'),
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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '312301326841151490',
    screen_name: 'Lege',
    updated_at: { $date: '2020-05-16T19:44:07.027Z' },
    team_id: ObjectId('5ebc62a9d09245d2a7c62eb3'),
  },
]
const mockTeams = [
  {
    _id: ObjectId('5ebc62a9d09245d2a7c62e86'),
    created_at: { $date: '2020-05-13T21:12:09.069Z' },
    discord_id: '688286287655993365',
    name: 'Duluth Superiors',
    updated_at: { $date: '2020-05-16T19:44:02.611Z' },
  },
  {
    _id: ObjectId('5ebc62a9d09245d2a7c62eb3'),
    created_at: { $date: '2020-05-13T21:12:09.069Z' },
    discord_id: '688286346783359027',
    name: 'Burnsville Inferno',
    updated_at: { $date: '2020-05-16T19:44:02.611Z' },
  },
]
const mockClosedMatch = [
  mockDoc({
    _id: ObjectId('5ebc62b0d09245d2a7c6340c'),
    week: 1,
    game_ids: [
      '5ebc62afd09245d2a7c6333f',
      '5ebc62afd09245d2a7c63338',
      '5ebc62afd09245d2a7c6335e',
      '5ebc62afd09245d2a7c63350',
    ],
    best_of: 5,
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
      },
    },
  }),
]
const mockOpenMatch = [
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
      },
    },
  }),
]

// mocks
jest.mock('../services/mongodb')
const replays = JSON.parse(fs.readFileSync(path.join(__dirname, 'replays.json')))
const ballchasing = require('../services/ballchasing')
jest.mock('../services/ballchasing')
const teamGames = require('../model/sheets/team-games')
jest.mock('../model/sheets/team-games')
const playerGames = require('../model/sheets/player-games')
jest.mock('../model/sheets/player-games')
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
class Match {
  constructor() {}
}
Match.find = jest.fn(() => ({ populate: jest.fn(() => ({ populate: matchesFindMock })) }))
matches.Model = Match
const players = require('../model/mongodb/players')
jest.mock('../model/mongodb/players')
players.Model = {
  find: jest.fn(),
}
const teams = require('../model/mongodb/teams')
jest.mock('../model/mongodb/teams')
teams.Model = {
  find: jest.fn(),
}

const processMatch = require('../process-match')

describe('process-match', () => {
  beforeEach(() => {
    ballchasing.getReplays.mockResolvedValue(replays)
  })
  afterEach(() => {
    teamGames.upsert.mockClear()
    playerGames.upsert.mockClear()
  })
  it('should process a match with a match_id', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValueOnce(mockClosedMatch)
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
    expect(teamGames.upsert.mock.calls.length).toBe(1)
    // expect(teamGames.upsert).toHaveBeenCalledWith({ data: 'team stats' })
    expect(playerGames.upsert.mock.calls.length).toBe(1)
    // expect(playerGames.upsert).toHaveBeenCalledWith({ data: 'player stats' })
  })
  it('should process team stats', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValueOnce(mockClosedMatch)
    await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(teamGames.upsert.mock.calls.length).toBe(1)
    const teamStats = teamGames.upsert.mock.calls[0][0]
    expect(teamStats).toHaveProperty('data')
    expect(teamStats.data).toHaveLength(8)
    expect(teamStats.data[6]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62e86',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      team_color: 'blue',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: '5ebc62afd09245d2a7c63338',
      game_id_win: '5ebc62afd09245d2a7c63338',
      game_number: '4',
      game_date: '2020-03-19T21:35:38Z',
      map_name: 'Utopia Coliseum',
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
      demos_inflicted: 2,
      demos_taken: 5,
      bpm: 1194,
      avg_amount: 139.37,
      amount_collected: 6608,
      amount_stolen: 1225,
      amount_used_while_supersonic: 797,
      ms_zero_boost: 162580,
      ms_full_boost: 79400,
    })
    expect(teamStats.data[7]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_id: '5ebc62a9d09245d2a7c62e86',
      game_id_win: undefined,
      match_id_win: undefined,
      game_number: '4',
    })
  })
  it('should process player stats', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValueOnce(mockClosedMatch)
    await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(playerGames.upsert.mock.calls.length).toBe(1)
    const playerStats = playerGames.upsert.mock.calls[0][0]
    expect(playerStats).toHaveProperty('data')
    expect(playerStats.data).toHaveLength(16)
    expect(playerStats.data[12]).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa26',
      screen_name: 'Calster',
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_color: 'blue',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: '5ebc62afd09245d2a7c63338',
      game_id_win: '5ebc62afd09245d2a7c63338',
      game_number: '4',
      game_date: '2020-03-19T21:35:38Z',
      map_name: 'Utopia Coliseum',
      wins: 1,
      shots: 2,
      goals: 1,
      saves: 2,
      assists: 1,
      score: 493,
      mvps: 1,
      ms_played: 351728,
      demos_inflicted: 0,
      demos_taken: 2,
      bpm: 416,
      avg_amount: 49.66,
      amount_collected: 2461,
      amount_stolen: 410,
      amount_used_while_supersonic: 212,
      ms_zero_boost: 52950,
      ms_full_boost: 23460,
    })
    expect(playerStats.data[13]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62e86',
      mvps: 0,
    })
    expect(playerStats.data[15]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62eb3',
      game_id_win: undefined,
      match_id_win: undefined,
    })
  })
  it('should process a new match', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValueOnce(mockOpenMatch)
    const result = await processMatch({
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
    })
    expect(result.game_ids).toHaveLength(4)
  })
  it('should not add stats for games which are not played by league teams', async () => {
    players.Model.find.mockResolvedValue([mockPlayers[0]])
    teams.Model.find.mockResolvedValueOnce([{}])
    await expect(
      processMatch({
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
          '4ed12225-7251-4d63-8bb6-15338c60bcf2',
        ],
      }),
    ).rejects.toEqual(new Error('expected to process match between 2 teams but got 1. Teams: 5ebc62a9d09245d2a7c62e86'))
  })
  it('should throw an error if the match does not meet best_of requirements', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    ballchasing.getReplays.mockResolvedValue([replays[0], replays[1], replays[3]])
    matchesFindMock.mockResolvedValueOnce(mockOpenMatch)
    await expect(
      processMatch({
        game_ids: [
          'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          '111c0144-7219-426a-8263-8cff260d030d',
        ],
      }),
    ).rejects.toEqual(new Error('expected a team to with the best of 5 match, but winning team has only 2'))
  })
})

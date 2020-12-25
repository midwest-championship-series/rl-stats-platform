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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '369948469986852874',
    screen_name: 'Cheezy',
    updated_at: { $date: '2020-05-16T19:44:06.822Z' },
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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '198638770390564864',
    old_league_id: '0b3814d4-f880-4cfd-a33c-4fb31f5860f3',
    old_team_id: '14c44087-6711-434e-bcfc-199b98800d74',
    screen_name: 'Delephant',
    updated_at: { $date: '2020-05-26T22:10:05.925Z' },
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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '560642215144194068',
    screen_name: 'Pace.',
    updated_at: { $date: '2020-05-16T19:44:06.979Z' },
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
    created_at: { $date: '2020-05-16T19:42:49.164Z' },
    discord_id: '312301326841151490',
    screen_name: 'Lege',
    updated_at: { $date: '2020-05-16T19:44:07.027Z' },
    team_history: [
      {
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
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
      },
    },
  })

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
const matchesFindByIdMock = jest.fn()
class Match {
  constructor() {}
}
Match.find = jest.fn(() => ({ populate: jest.fn(() => ({ populate: matchesFindMock })) }))
Match.findById = jest.fn(() => ({
  populate: jest.fn(() => ({ populate: jest.fn(() => ({ populate: matchesFindByIdMock })) })),
}))
matches.Model = Match
const players = require('../model/mongodb/players')
jest.mock('../model/mongodb/players')
players.Model = {
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
  beforeEach(() => {
    ballchasing.getReplays.mockResolvedValue(replays)
  })
  afterEach(() => {
    teamGames.upsert.mockClear()
    playerGames.upsert.mockClear()
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
      unlinkedPlayers: [{ name: 'MARKsman.', platform: 'steam', platform_id: '76561198118651841' }],
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
    expect(teamGames.upsert.mock.calls.length).toBe(1)
    expect(playerGames.upsert.mock.calls.length).toBe(1)
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
        player_id: new ObjectId('5ec04239d09245d2a7d4fa52'),
        team_id: new ObjectId('5ebc62a9d09245d2a7c62eb3'),
      },
    ])
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
    expect(teamGames.upsert.mock.calls.length).toBe(1)
    const teamStats = teamGames.upsert.mock.calls[0][0]
    expect(teamStats).toHaveProperty('data')
    expect(teamStats.data).toHaveLength(8)
    expect(teamStats.data[6]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      team_color: 'blue',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
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
    expect(playerGames.upsert.mock.calls.length).toBe(1)
    const playerStats = playerGames.upsert.mock.calls[0][0]
    expect(playerStats).toHaveProperty('data')
    const findPlayerStats = criteria => {
      return playerStats.data.filter(stat => Object.keys(criteria).every(key => stat[key] === criteria[key]))
    }
    // ensure there are 6 player records per game
    expect(playerStats.data).toHaveLength(24)
    expect(findPlayerStats({ game_id: '5ebc62afd09245d2a7c63338' })).toHaveLength(6)
    expect(
      findPlayerStats({ player_id: '5ec04239d09245d2a7d4fa26', game_id: '5ebc62afd09245d2a7c63338' })[0],
    ).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa26',
      player_name: 'Calster',
      player_platform: 'steam',
      player_platform_id: '76561198059743159',
      screen_name: 'Calster',
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      team_color: 'blue',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
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
    const noLeagueIdRecords = findPlayerStats({ player_platform_id: '76561198118651841' })
    expect(noLeagueIdRecords).toHaveLength(4)
    noLeagueIdRecords.forEach(r =>
      expect(r).toMatchObject({
        player_id: undefined,
        player_name: 'MARKsman.',
        screen_name: 'MARKsman.',
        player_platform: 'steam',
        player_platform_id: '76561198118651841',
      }),
    )
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
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
      unlinkedPlayers: [{ name: 'MARKsman.', platform: 'steam', platform_id: '76561198118651841' }],
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
    const teamStats = teamGames.upsert.mock.calls[0][0]
    expect(teamStats.data).toHaveLength(6)
    expect(teamStats.data[0]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id_forfeit_loss: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_forfeit_win: undefined,
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 0,
    })
    // requires tests to have run in less than 1 s
    const dateDiff = Math.abs(new Date(teamStats.data[0].game_date) - Date.now())
    expect(dateDiff).toBeLessThan(1000)
    expect(teamStats.data[1]).toMatchObject({
      team_id: '5ebc62a9d09245d2a7c62eb3',
      team_name: 'Burnsville Inferno',
      opponent_team_id: '5ebc62a9d09245d2a7c62e86',
      opponent_team_name: 'Duluth Superiors',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id_forfeit_loss: undefined,
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 1,
    })
    expect(teamStats.data[4]).toMatchObject({
      game_id_forfeit_loss: 'match:5ebc62b0d09245d2a7c6340c:game:3',
    })
    const playerStats = playerGames.upsert.mock.calls[0][0]
    expect(playerStats.data).toHaveLength(12)
    expect(playerStats.data[0]).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa26',
      player_name: 'Calster',
      team_id: '5ebc62a9d09245d2a7c62e86',
      team_name: 'Duluth Superiors',
      opponent_team_id: '5ebc62a9d09245d2a7c62eb3',
      opponent_team_name: 'Burnsville Inferno',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id_forfeit_loss: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_forfeit_win: undefined,
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 0,
    })
    expect(playerStats.data[2]).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa4f',
      player_name: 'Pace.',
      team_id: '5ebc62a9d09245d2a7c62eb3',
      team_name: 'Burnsville Inferno',
      opponent_team_id: '5ebc62a9d09245d2a7c62e86',
      opponent_team_name: 'Duluth Superiors',
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id_forfeit_loss: undefined,
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id: undefined,
      game_id_win: undefined,
      game_number: undefined,
      map_name: undefined,
      wins: 1,
    })
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
    const playerStats = playerGames.upsert.mock.calls[0][0]
    expect(playerStats.data).toHaveLength(15)
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
    const teamStats = teamGames.upsert.mock.calls[0][0]
    const playerStats = playerGames.upsert.mock.calls[0][0]
    expect(teamStats.data).toHaveLength(2)
    expect(playerStats.data).toHaveLength(4)
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
  it('should throw an error if exactly one match is not returned', async () => {
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
    ).rejects.toEqual(
      new Error('expected to get one match but got 0 between teams: Duluth Superiors, Burnsville Inferno'),
    )
  })
  it('should throw an error if there is more than one match scheduled for the league', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch(), mockOpenMatch()])
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
      new Error(
        'expected to get one match but got 2 between teams: Duluth Superiors, Burnsville Inferno\nmatch ids: 5ebc62b0d09245d2a7c6340c, 5ebc62b0d09245d2a7c6340c',
      ),
    )
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
})

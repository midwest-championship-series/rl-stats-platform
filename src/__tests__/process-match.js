const fs = require('fs')
const path = require('path')
const { ObjectId } = require('mongodb')

const mockDoc = (obj) => {
  obj.save = jest.fn()
  return obj
}

const getReplayData = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'replays.json')))

// mock data
const mockPlayers = [
  {
    _id: new ObjectId('5ec04239d09245d2a7d4fa26'),
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
        team_id: new ObjectId('5ec9358d8c0dd900074685bf'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: new ObjectId('5ec04239d09245d2a7d4fa48'),
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
        team_id: new ObjectId('5ec9358d8c0dd900074685bf'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
      {
        team_id: new ObjectId('5ec935988c0dd900074686a7'), // fake team id for testing - makes sure right team is selected
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
        team_id: new ObjectId('5ec9358d8c0dd900074685bf'),
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
    _id: new ObjectId('5ec04239d09245d2a7d4fa4f'),
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
        team_id: new ObjectId('5ec9358d8c0dd900074685c1'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      },
    ],
  },
  {
    _id: new ObjectId('5ec04239d09245d2a7d4fa52'),
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
        team_id: new ObjectId('5ec9358d8c0dd900074685c1'),
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
    _id: new ObjectId('5ec9358d8c0dd900074685bf'),
    discord_id: '688286287655993365',
    name: 'Superiors Premier',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc5'),
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685c1'),
    discord_id: '688286346783359027',
    name: 'Inferno Premier',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc7'),
  },
]
const mockClosedMatch = mockDoc({
  _id: new ObjectId('5ebc62b0d09245d2a7c6340c'),
  week: 1,
  match_type: 'REG',
  report_games: [
    { id: '5ebc62afd09245d2a7c6333f' },
    { id: '5ebc62afd09245d2a7c63338' },
    { id: '5ebc62afd09245d2a7c6335e' },
    { id: '5ebc62afd09245d2a7c63350' },
  ],
  best_of: 5,
  teams: mockTeams,
  games: [
    mockDoc({
      _id: new ObjectId('5ebc62afd09245d2a7c6333f'),
      replay_origin: { key: '9aee7f5f-7d75-40b0-8116-a8e1e2c9d4c5', source: 'ballchasing' },
      game_number: 1,
    }),
    mockDoc({
      _id: new ObjectId('5ebc62afd09245d2a7c63338'),
      replay_origin: { key: '6903ac8a-d480-4f41-84a0-321ffb5cd17d', source: 'ballchasing' },
      game_number: 2,
    }),
    mockDoc({
      _id: new ObjectId('5ebc62afd09245d2a7c6335e'),
      replay_origin: { key: '2493a4bd-aeb5-49ba-8cac-059cc99865c1', source: 'ballchasing' },
      game_number: 3,
    }),
    mockDoc({
      _id: new ObjectId('5ebc62afd09245d2a7c63350'),
      replay_origin: { key: '111c0144-7219-426a-8263-8cff260d030d', source: 'ballchasing' },
      game_number: 4,
    }),
  ],
  season: {
    _id: new ObjectId('5ebc62b0d09245d2a7c63477'),
    name: '1',
    league: {
      _id: new ObjectId('5ebc62b1d09245d2a7c63516'),
      name: 'mncs',
    },
  },
})
const mockOpenMatch = () =>
  mockDoc({
    _id: new ObjectId('5ebc62b0d09245d2a7c6340c'),
    status: 'open',
    match_type: 'REG',
    teams: mockTeams,
    week: 1,
    game_ids: [],
    best_of: 5,
    scheduled_datetime: new Date('2020-03-19T20:00:00Z'),
    season: {
      _id: new ObjectId('5ebc62b0d09245d2a7c63477'),
      name: '1',
      season_type: 'REG',
      league: {
        _id: new ObjectId('5ebc62b1d09245d2a7c63516'),
        name: 'mncs',
        current_week: '1',
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
    this._id = new ObjectId()
    for (let prop in init) {
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
  create: jest.fn(() => ({ screen_name: 'something' })),
  find: jest.fn(),
  onTeams: jest.fn(),
}
const teams = require('../model/mongodb/teams')
jest.mock('../model/mongodb/teams')
const teamsFindMock = jest.fn()
teams.Model = {
  find: teamsFindMock,
}
const allLeagueTeams = [
  {
    _id: new ObjectId('5ec9358e8c0dd900074685c6'),
    __v: 6,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286489557467243',
    hex_color: '131846',
    name: 'Lumberjacks Premier',
    updated_at: '2022-02-13T20:51:03.518Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941348546265878548/MNCS_TIER1_Marks_800px_BM_Lumberjacks-05.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddcc'),
    vars: [
      {
        _id: '60a31ae5f766b70008b4dc1d',
        key: 'display_name',
        value: 'Lumberjacks',
      },
      {
        _id: '620818bcea9ec80009c178a8',
        key: 'emoji_id',
        value: ':LUM:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685be'),
    __v: 4,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286239237079155',
    hex_color: '540809',
    name: 'Senators Premier',
    updated_at: '2022-02-13T20:44:59.206Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941362036707835954/MNCS_TIER1_Marks_Social_SP_Senators-06.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc4'),
    vars: [
      {
        _id: '60a31b03f766b70008b4dc22',
        key: 'display_name',
        value: 'Senators',
      },
      {
        _id: '62081c553490fc0009399904',
        key: 'emoji_id',
        value: ':SEN:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685c2'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286382921089056',
    hex_color: '8014E8',
    name: 'Rhythm Premier',
    updated_at: '2022-02-13T20:41:51.715Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941769141432512602/MNCS_TIER1_Marks_NoBG_RC_Rhythm-05.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc8'),
    vars: [
      {
        _id: '60a31a4cf766b70008b4dc0a',
        key: 'display_name',
        value: 'Rhythm',
      },
      {
        _id: '6206afef9c11d10009ccfacc',
        key: 'emoji_id',
        value: ':RHY:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685bf'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286287655993365',
    hex_color: '1C2153',
    name: 'Superiors Premier',
    updated_at: '2022-02-13T20:44:05.768Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941762003008114708/MNCS_TIER1_Marks_NoBG_DT_Superiors-05.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc5'),
    vars: [
      {
        _id: '60a3195cf766b70008b4dc06',
        key: 'display_name',
        value: 'Superiors',
      },
      {
        _id: '6207f0d1cabd340009e4013f',
        key: 'emoji_id',
        value: ':SUP:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685c0'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286317263847465',
    hex_color: '1E0C30',
    name: 'Barons Premier',
    updated_at: '2022-02-13T21:00:22.932Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/942155977254400090/MNCS_TIER1_Marks_NoBG_MT_Barons_800_copy_3.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc6'),
    vars: [
      {
        _id: '60a31ad0f766b70008b4dc1a',
        key: 'display_name',
        value: 'Barons',
      },
      {
        _id: '6208197d3490fc00093998f0',
        key: 'emoji_id',
        value: ':BAR:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358e8c0dd900074685c3'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286412701040710',
    hex_color: '999997',
    name: 'Rangers Premier',
    updated_at: '2022-02-13T20:40:55.186Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941481166643531776/MNCS_TIER1_Marks_NoBG_HB_Rangers-06.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc9'),
    vars: [
      {
        _id: '60a31a55f766b70008b4dc0b',
        key: 'display_name',
        value: 'Rangers',
      },
      {
        _id: '620819df3490fc00093998f4',
        key: 'emoji_id',
        value: ':RAN:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685bd'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286130629771274',
    hex_color: '8015E8',
    name: 'Miracles Premier',
    updated_at: '2022-02-13T21:00:56.349Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941762344898404443/MNCS_TIER1_Marks_NoBG_MN_Miracles-04.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc3'),
    vars: [
      {
        _id: '60a31ad7f766b70008b4dc1b',
        key: 'display_name',
        value: 'Miracles',
      },
      {
        _id: '62081bdd3490fc0009399902',
        key: 'emoji_id',
        value: ':MIR:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358d8c0dd900074685c1'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286346783359027',
    hex_color: 'ED5829',
    name: 'Inferno Premier',
    updated_at: '2022-02-13T20:39:47.760Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941352151337291796/MNCS_TIER1_Marks_NoBG_BV_Infreno2-07.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc7'),
    vars: [
      {
        _id: '60a31aebf766b70008b4dc1e',
        key: 'display_name',
        value: 'Inferno',
      },
      {
        _id: '62081b953490fc0009399900',
        key: 'emoji_id',
        value: ':INF:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358e8c0dd900074685c4'),
    __v: 3,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286435177922562',
    hex_color: '886C63',
    name: 'Flyers Premier',
    updated_at: '2022-02-13T20:56:07.167Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/942158143910215690/MNCS_TIER1_Marks_NoBG_SC_Flyers-05.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddca'),
    vars: [
      {
        _id: '60a31a20f766b70008b4dc07',
        key: 'display_name',
        value: 'Flyers',
      },
      {
        _id: '62081b4f3490fc00093998fe',
        key: 'emoji_id',
        value: ':FLY:',
      },
    ],
    tier_name: 'premier',
  },
  {
    _id: new ObjectId('5ec9358e8c0dd900074685c5'),
    __v: 5,
    created_at: '2020-05-23T14:39:09.945Z',
    discord_id: '688286462747213846',
    hex_color: 'B4BCF0',
    name: 'Maulers Premier',
    updated_at: '2022-02-13T20:46:55.535Z',
    avatar:
      'https://cdn.discordapp.com/attachments/819367956659044352/941349891840561172/MNCS_TIER1_Marks_NoBG_BM_Maulers-05.png',
    franchise_id: new ObjectId('5ec9358e8c0dd900074685c5'),
    vars: [
      {
        _id: '60a31adef766b70008b4dc1c',
        key: 'display_name',
        value: 'Maulers',
      },
      {
        _id: '620819b23490fc00093998f2',
        key: 'emoji_id',
        value: ':MAU:',
      },
    ],
    tier_name: 'premier',
  },
]
const leagues = require('../model/mongodb/leagues')
const leaguesFindByIdMock = jest.fn().mockResolvedValue({
  current_season: {
    team_ids: [
      new ObjectId('5ebc62a9d09245d2a7c62e5a'),
      new ObjectId('5ebc62a9d09245d2a7c62e82'),
      new ObjectId('5ec9358d8c0dd900074685bf'),
      new ObjectId('5ebc62a9d09245d2a7c62eba'),
      new ObjectId('5ec9358d8c0dd900074685c1'),
      new ObjectId('5ebc62a9d09245d2a7c62eae'),
      new ObjectId('5ebc62aad09245d2a7c62eed'),
      new ObjectId('5ebc62aad09245d2a7c62ef8'),
      new ObjectId('5ebc62aad09245d2a7c62ef9'),
      new ObjectId('5ebc62aad09245d2a7c62efc'),
    ],
    teams: allLeagueTeams,
  },
})
leagues.Model = {
  findById: jest.fn(() => ({ populate: leaguesFindByIdMock })),
}

const processMatch = require('../process-match')
const { cloneDeep } = require('lodash')

describe('process-match', () => {
  let replays
  beforeEach(() => {
    replays = getReplayData()
    ballchasing.getReplayData.mockResolvedValue(replays)
    aws.s3.uploadJSON = jest.fn(() => ({
      Location: 'some url',
    }))
  })
  afterEach(() => {
    elastic.indexDocs.mockClear()
  })
  it('should process a match with a match_id', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindByIdMock.mockResolvedValue(mockClosedMatch)
    const result = await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
      game_ids: [
        '5ebc62afd09245d2a7c63350',
        '5ebc62afd09245d2a7c6335e',
        '5ebc62afd09245d2a7c6333f',
        '5ebc62afd09245d2a7c63338',
      ],
    })
    expect(result.games).toHaveLength(4)
    expect(result.games[0].winning_team_id).toEqual(new ObjectId('5ec9358d8c0dd900074685c1'))
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
              platform_id: '76561198247336622',
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
    expect(mockClosedMatch).toHaveProperty('winning_team_id')
    expect(mockClosedMatch.winning_team_id).toEqual(new ObjectId('5ec9358d8c0dd900074685bf'))
    expect(mockClosedMatch).toHaveProperty('players_to_teams')
    expect(mockClosedMatch.players_to_teams).toEqual([
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa26'),
        team_id: new ObjectId('5ec9358d8c0dd900074685bf'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa48'),
        team_id: new ObjectId('5ec9358d8c0dd900074685bf'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa69'),
        team_id: new ObjectId('5ec9358d8c0dd900074685bf'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa4f'),
        team_id: new ObjectId('5ec9358d8c0dd900074685c1'),
      },
      {
        player_id: new ObjectId('5ec9358f8c0dd900074685cd'),
        team_id: new ObjectId('5ec9358d8c0dd900074685c1'),
      },
      {
        player_id: new ObjectId('5ec04239d09245d2a7d4fa52'),
        team_id: new ObjectId('5ec9358d8c0dd900074685c1'),
      },
    ])
    const uploadStaticStats = aws.s3.uploadJSON.mock.calls
    expect(uploadStaticStats).toHaveLength(1)
    expect(uploadStaticStats[0][0]).toEqual('stats_bucket_name')
    expect(uploadStaticStats[0][1]).toEqual('match:5ebc62b0d09245d2a7c6340c.json')
    const { processedAt, team_games, player_games, matchId } = uploadStaticStats[0][2]
    expect(matchId).toEqual('5ebc62b0d09245d2a7c6340c')
    expect(processedAt - Date.now()).toBeLessThan(100)
    expect(team_games).toHaveLength(8)
    expect(player_games).toHaveLength(24)
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledTimes(1)
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      detail: {
        bucket: {
          key: 'match:5ebc62b0d09245d2a7c6340c.json',
          source: 'stats_bucket_name',
        },
        match_id: '5ebc62b0d09245d2a7c6340c',
      },
      type: 'MATCH_PROCESS_ENDED',
    })
  })
  it('should process team stats', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindByIdMock.mockResolvedValue(mockClosedMatch)
    await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
    const { team_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(8)
    const findStats = (filters) => team_games.filter((s) => Object.keys(filters).every((key) => s[key] == filters[key]))
    expect(findStats({ game_id: '5ebc62afd09245d2a7c6333f', team_id: '5ec9358d8c0dd900074685bf' })[0]).toMatchObject({
      game_id_overtime_game: '5ebc62afd09245d2a7c6333f',
      overtime_seconds_played: 124,
    })
    expect(findStats({ game_id: '5ebc62afd09245d2a7c63338', team_id: '5ec9358d8c0dd900074685bf' })[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
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
    expect(findStats({ game_id: '5ebc62afd09245d2a7c63338', team_id: '5ec9358d8c0dd900074685c1' })[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      game_id_win: undefined,
      match_id_win: undefined,
      game_id_win_total: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:4',
      game_number: '4',
    })
    expect(team_games[0].epoch_processed - Date.now()).toBeLessThan(100)
  })
  it('should process player stats', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue(mockClosedMatch)
    await processMatch({
      match_id: '5ebc62b0d09245d2a7c6340c',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
    const { player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    const findPlayerStats = (criteria) => {
      return player_games.filter((stat) => Object.keys(criteria).every((key) => stat[key] === criteria[key]))
    }
    // ensure there are 6 player records per game
    expect(player_games).toHaveLength(24)
    expect(player_games[0].epoch_processed - Date.now()).toBeLessThan(100)
    expect(findPlayerStats({ game_id: '5ebc62afd09245d2a7c63338' })).toHaveLength(6)
    expect(
      findPlayerStats({ player_id: '5ec04239d09245d2a7d4fa26', game_id: '5ebc62afd09245d2a7c63338' })[0],
    ).toMatchObject({
      player_id: '5ec04239d09245d2a7d4fa26',
      player_name: 'Calster',
      player_platform: 'steam',
      player_platform_id: '76561198059743159',
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      team_color: 'blue',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
      opponent_team_color: 'orange',
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
      opponent_goals: 2,
      saves: 2,
      opponent_saves: 1,
      assists: 1,
      opponent_assists: 2,
      score: 493,
      opponent_score: 740,
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
      .filter((stat) => stat.player_id !== '5ec04239d09245d2a7d4fa26')
      .forEach((stat) => {
        expect(stat).toMatchObject({ mvps: 0 })
      })
    findPlayerStats({ game_id: '5ebc62afd09245d2a7c63338' }).forEach((stat) => {
      if (stat.team_id === '5ec9358d8c0dd900074685c1') {
        expect(stat).toMatchObject({ game_id_win: undefined, match_id_win: undefined })
      } else {
        expect(stat).toMatchObject({
          game_id_win: '5ebc62afd09245d2a7c63338',
          match_id_win: '5ebc62b0d09245d2a7c6340c',
        })
      }
    })
    expect(player_games.filter((game) => !game.opponent_goals)).toHaveLength(0)
  })
  it('should process a new match', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    const result = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
    expect(result.game_ids).toHaveLength(4)
  })
  it('should process a new match with a game forfeit', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    ballchasing.getReplayData.mockResolvedValue([replays[0], replays[1], replays[3]])
    const result = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        {
          id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:d2d31639-1e42-4f0b-9537-545d8d19f63b.replay', source: 'mock-bucket' },
        },
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 3,
          forfeit: true,
        },
        {
          id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:1c76f735-5d28-4dcd-a0f2-bd9a5b129772.replay', source: 'mock-bucket' },
        },
        {
          id: '4ed12225-7251-4d63-8bb6-15338c60bcf2',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:4ed12225-7251-4d63-8bb6-15338c60bcf2.replay', source: 'mock-bucket' },
        },
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(8)
    expect(player_games).toHaveLength(18)
    const findStats = (filters) => team_games.filter((s) => Object.keys(filters).every((key) => s[key] == filters[key]))
    const burnsville = findStats({ games_played: undefined, team_id: '5ec9358d8c0dd900074685c1' })[0]
    const forfeitGameId = burnsville.game_id
    expect(burnsville).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      team_name: 'Inferno Premier',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      opponent_team_name: 'Superiors Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: undefined,
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: forfeitGameId,
      game_id_win: undefined,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_win_total: undefined,
      game_id_overtime_game: undefined,
      game_number: '3',
      game_date: undefined,
      map_name: undefined,
      wins: 0,
      games_played: undefined,
    })
    expect(findStats({ game_id: forfeitGameId, team_id: '5ec9358d8c0dd900074685bf' })[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: forfeitGameId,
      game_id_win: undefined,
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_win_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_overtime_game: undefined,
      game_number: '3',
      game_date: undefined,
      map_name: undefined,
      wins: 1,
      games_played: undefined,
    })
  })
  it('should process a new match with multiple game forfeits', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    ballchasing.getReplayData.mockResolvedValue([replays[1], replays[3]])
    const result = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        {
          id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:d2d31639-1e42-4f0b-9537-545d8d19f63b.replay', source: 'mock-bucket' },
        },
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 3,
          forfeit: true,
        },
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 1,
          forfeit: true,
        },
        {
          id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:1c76f735-5d28-4dcd-a0f2-bd9a5b129772.replay', source: 'mock-bucket' },
        },
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(8)
    expect(player_games).toHaveLength(12)
    const game1ForfeitId = team_games[0].game_id
    expect(team_games.find((g) => g.team_id === '5ec9358d8c0dd900074685c1' && g.game_number === '1')).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      team_name: 'Inferno Premier',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      opponent_team_name: 'Superiors Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: undefined,
      game_id: game1ForfeitId,
      game_id_win: undefined,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_number: '1',
    })
    expect(team_games.find((g) => g.team_id === '5ec9358d8c0dd900074685bf' && g.game_number === '1')).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      game_id: game1ForfeitId,
      game_id_win: undefined,
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_number: '1',
    })
    const findStats = (filters) => team_games.filter((s) => Object.keys(filters).every((key) => s[key] == filters[key]))
    const burnsville = findStats({ games_played: undefined, team_id: '5ec9358d8c0dd900074685c1', game_number: '3' })[0]
    const forfeitGameId = burnsville.game_id
    expect(burnsville).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      team_name: 'Inferno Premier',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      opponent_team_name: 'Superiors Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: undefined,
      game_id: forfeitGameId,
      game_id_win: undefined,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_number: '3',
    })
    expect(findStats({ game_id: forfeitGameId, team_id: '5ec9358d8c0dd900074685bf' })[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      game_id: forfeitGameId,
      game_id_win: undefined,
      game_id_forfeit_win: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_win_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_number: '3',
    })
  })
  it('should process a new match with manually reported games', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    ballchasing.getReplayData.mockResolvedValue([replays[0], replays[1], replays[3]])
    const result = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        {
          id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:d2d31639-1e42-4f0b-9537-545d8d19f63b.replay', source: 'mock-bucket' },
        },
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 3,
        },
        {
          id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:1c76f735-5d28-4dcd-a0f2-bd9a5b129772.replay', source: 'mock-bucket' },
        },
        {
          id: '4ed12225-7251-4d63-8bb6-15338c60bcf2',
          upload_source: 'ballchasing',
          bucket: { key: 'ballchasing:4ed12225-7251-4d63-8bb6-15338c60bcf2.replay', source: 'mock-bucket' },
        },
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(8)
    expect(player_games).toHaveLength(18)
    const findStats = (filters) => team_games.filter((s) => Object.keys(filters).every((key) => s[key] == filters[key]))
    const burnsville = findStats({ ms_played: undefined, team_id: '5ec9358d8c0dd900074685c1' })[0]
    const manualReportGameId = burnsville.game_id
    expect(burnsville).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      team_name: 'Inferno Premier',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      opponent_team_name: 'Superiors Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: undefined,
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: manualReportGameId,
      game_id_win: undefined,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_win_total: undefined,
      game_id_overtime_game: undefined,
      game_number: '3',
      game_date: undefined,
      map_name: undefined,
      wins: 0,
      games_played: 1,
    })
    expect(findStats({ game_id: manualReportGameId, team_id: '5ec9358d8c0dd900074685bf' })[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: manualReportGameId,
      game_id_win: manualReportGameId,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_win_total: 'match:5ebc62b0d09245d2a7c6340c:game:3',
      game_id_overtime_game: undefined,
      game_number: '3',
      game_date: undefined,
      map_name: undefined,
      wins: 1,
      games_played: 1,
    })
  })
  it('should process a new match with only manually reported games', async () => {
    players.Model.find.mockResolvedValue([])
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    ballchasing.getReplayData.mockResolvedValue([])
    const result = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      mentioned_team_ids: ['5ec9358d8c0dd900074685bf', '5ec9358d8c0dd900074685c1'],
      report_games: [
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 1,
        },
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 2,
        },
        {
          report_type: 'MANUAL_REPORT',
          winning_team_id: '5ec9358d8c0dd900074685bf',
          game_number: 3,
        },
      ],
    })
    expect(result).toMatchObject({
      match_id: '5ebc62b0d09245d2a7c6340c',
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(6)
    expect(player_games).toHaveLength(0)
    const manualReportGameId = team_games[0].game_id
    expect(team_games[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      team_name: 'Inferno Premier',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      opponent_team_name: 'Superiors Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: undefined,
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: manualReportGameId,
      game_id_win: undefined,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_win_total: undefined,
      game_id_overtime_game: undefined,
      game_number: '1',
      game_date: undefined,
      map_name: undefined,
      wins: 0,
      games_played: 1,
    })
    expect(team_games[1]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
      team_color: undefined,
      match_id: '5ebc62b0d09245d2a7c6340c',
      match_id_win: '5ebc62b0d09245d2a7c6340c',
      match_type: 'REG',
      week: 1,
      season_name: '1',
      season_id: '5ebc62b0d09245d2a7c63477',
      league_name: 'mncs',
      league_id: '5ebc62b1d09245d2a7c63516',
      game_id: manualReportGameId,
      game_id_win: manualReportGameId,
      game_id_forfeit_win: undefined,
      game_id_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_win_total: 'match:5ebc62b0d09245d2a7c6340c:game:1',
      game_id_overtime_game: undefined,
      game_number: '1',
      game_date: undefined,
      map_name: undefined,
      wins: 1,
      games_played: 1,
    })
  })
  it('should fail if players are on different teams throughout the match', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    const alteredReplays = getReplayData()
    const orangeSwap = alteredReplays[0].orange.players.pop()
    const blueSwap = alteredReplays[0].blue.players.pop()
    alteredReplays[0].orange.players.push(blueSwap)
    alteredReplays[0].blue.players.pop(orangeSwap)
    ballchasing.getReplayData.mockResolvedValue(alteredReplays)
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(
      new Error(
        'team mismatch found in game: 9aee7f5f-7d75-40b0-8116-a8e1e2c9d4c5. errors: no match found for player: Lege., no match found for player: peppajack., no match found for player: Delephant.',
      ),
    )
  })
  /** @todo fix this test, it passes for some reason */
  // it('should fail if no team is identified for any game in a match', async () => {
  //   players.Model.find.mockResolvedValue(mockPlayers)
  //   teams.Model.find.mockResolvedValue(mockTeams)
  //   matchesFindMock.mockResolvedValue([mockOpenMatch()])
  //   const alteredReplays = getReplayData()
  //   alteredReplays[1].orange.players.forEach((p) => p.id.id === p.id.id + '1')
  //   ballchasing.getReplayData.mockResolvedValue(alteredReplays)
  //   await expect(
  //     processMatch({
  //       league_id: '5ebc62b1d09245d2a7c63516',
  //       report_games: [
  //         { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
  //         { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
  //         { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
  //         { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
  //       ],
  //     }),
  //   ).rejects.toEqual(new Error(''))
  // })
  it('should fail if the league current week is too far away from identified match week', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    const testMatch = mockOpenMatch()
    testMatch.scheduled_datetime = new Date('2020-03-27T20:00:00Z')
    matchesFindMock.mockResolvedValue([testMatch])
    const result = await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(
      new Error(
        'expected match within 1 week of Fri Mar 27 2020 15:00:00 GMT-0500 (Central Daylight Time) but received game played on Thu Mar 19 2020 16:14:32 GMT-0500 (Central Daylight Time)',
      ),
    )
    testMatch.scheduled_datetime = new Date('2020-03-25T20:00:00Z')
    await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
  })
  it('should process a match when teams are scheduled in multiple leagues', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    const mockMatches = [mockOpenMatch(), mockOpenMatch()]
    mockMatches[0].season.league._id = new ObjectId()
    matchesFindMock.mockResolvedValue(mockMatches)
    await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
  })
  it('should process a forfeit without a scheduled datetime', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    const testMatch = mockOpenMatch()
    delete testMatch.scheduled_datetime
    matchesFindByIdMock.mockResolvedValue(testMatch)
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ec9358d8c0dd900074685bf',
      reply_to_channel: '692994579305332806',
    })
    const { player_games, team_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(6)
    expect(team_games[0].epoch_processed - Date.now()).toBeLessThan(100)
    expect(team_games[0]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685bf',
      team_name: 'Superiors Premier',
      opponent_team_id: '5ec9358d8c0dd900074685c1',
      opponent_team_name: 'Inferno Premier',
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
    const dateDiff = Math.abs(new Date(team_games[0].game_date) - Date.now())
    expect(dateDiff).toBeLessThan(1000)
    expect(team_games[1]).toMatchObject({
      team_id: '5ec9358d8c0dd900074685c1',
      team_name: 'Inferno Premier',
      opponent_team_id: '5ec9358d8c0dd900074685bf',
      opponent_team_name: 'Superiors Premier',
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
    expect(player_games).toHaveLength(0)
    const uploadStaticStats = aws.s3.uploadJSON.mock.calls
    expect(uploadStaticStats).toHaveLength(1)
    expect(uploadStaticStats[0][0]).toEqual('stats_bucket_name')
    expect(uploadStaticStats[0][1]).toEqual('match:5ebc62b0d09245d2a7c6340c.json')
    const s3Stats = uploadStaticStats[0][2]
    expect(s3Stats.processedAt - Date.now()).toBeLessThan(100)
    expect(s3Stats.team_games).toHaveLength(6)
    expect(s3Stats.matchId).toEqual('5ebc62b0d09245d2a7c6340c')
    expect(s3Stats.player_games).toHaveLength(0)
  })
  it('should process a forfeit with a scheduled date', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockOpenMatch(),
      scheduled_datetime: new Date('2020-05-10T05:00:00.000Z'),
    })
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ec9358d8c0dd900074685bf',
      reply_to_channel: '692994579305332806',
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(6)
    expect(player_games).toHaveLength(0)
  })
  it('should process a forfeit with a different best_of condition', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockOpenMatch(),
      best_of: 1,
    })
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ec9358d8c0dd900074685bf',
      reply_to_channel: '692994579305332806',
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    expect(team_games).toHaveLength(2)
    expect(player_games).toHaveLength(0)
  })
  it('should fail if forfeit match does not have best_of condition', async () => {
    Match.findById = jest.fn(() => ({
      populate: jest.fn(() => ({ populate: matchesFindByIdMock })),
    }))
    players.Model.find.mockReturnValue({ onTeams: jest.fn().mockResolvedValue(mockPlayers) })
    matchesFindByIdMock.mockResolvedValue({
      ...mockOpenMatch(),
      best_of: undefined,
    })
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        match_id: '5f2c5e4e08c88e00084b44a6',
        forfeit_team_id: '5ec9358d8c0dd900074685bf',
        reply_to_channel: '692994579305332806',
      }),
    ).rejects.toEqual(new Error('forfeited match must have best_of property'))
  })
  it('should identify subs if there is no league player in a match', async () => {
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    const testMockPlayers = mockPlayers.map((player) => {
      const newPlayer = cloneDeep(player)
      newPlayer.team_history.forEach((h) => {
        if (h.team_id.equals('5ec9358d8c0dd900074685c1')) {
          h.team_id = new ObjectId('aebc62a9d09245d2a7c62eb6')
        } else {
          h.team_id = new ObjectId('600c98b3eedc0d0008211469')
        }
      })
      return newPlayer
    })
    players.Model.find.mockResolvedValue(testMockPlayers)
    teams.Model.find.mockResolvedValue([
      {
        _id: new ObjectId('600c98b3eedc0d0008211469'),
        discord_id: '688286346783359027',
        name: 'Superiors Rising Star',
        franchise_id: new ObjectId('600fac63be0bbe0008ffddc5'),
      },
      {
        _id: new ObjectId('aebc62a9d09245d2a7c62eb6'),
        discord_id: '688286346783359027',
        name: 'Inferno Prospect',
        franchise_id: new ObjectId('600fac63be0bbe0008ffddc7'),
      },
    ])
    const results = await processMatch({
      league_id: '5ebc62b1d09245d2a7c63516',
      report_games: [
        { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
        { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
        { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
        { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
      ],
    })
    const { team_games, player_games } = aws.s3.uploadJSON.mock.calls[0][2]
    player_games.forEach((pGame) =>
      expect('5ec9358d8c0dd900074685c1 5ec9358d8c0dd900074685bf').toContain(pGame.is_sub_for_team),
    )
  })
  it('should not add stats for games where more than 2 franchises are identified', async () => {
    let expectedError = `expected to identify match between 2 franchises, but found 3. Franchises: 600fac63be0bbe0008ffddc5, 600fac63be0bbe0008ffddc7, 600fac63be0bbe0008ffddc9.\n`
    expectedError += `Players:\n`
    expectedError += `Calster: Superiors Premier\n`
    expectedError += `Cheezy: Superiors Premier\n`
    expectedError += `Delephant: Superiors Premier\n`
    expectedError += `Pace.: Inferno Prospect\n`
    expectedError += `MARKsmanRL: \n`
    expectedError += `Lege: Inferno Prospect, Rangers Premier\n`
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    const testMockPlayers = mockPlayers.map((player) => {
      const newPlayer = cloneDeep(player)
      newPlayer.team_history.forEach((h) => {
        if (h.team_id.equals('5ec9358d8c0dd900074685c1')) {
          h.team_id = new ObjectId('aebc62a9d09245d2a7c62eb6')
        }
      })
      return newPlayer
    })
    // act like lege joined rangers and superiors
    testMockPlayers
      .find((p) => p._id.equals('5ec04239d09245d2a7d4fa52'))
      .team_history.push({
        team_id: new ObjectId('5ec9358e8c0dd900074685c3'),
        date_joined: new Date('2020-03-01T05:00:00.000Z'),
      })
    players.Model.find.mockResolvedValue(testMockPlayers)
    teams.Model.find.mockResolvedValue([
      mockTeams.find((t) => t._id.equals('5ec9358d8c0dd900074685bf')),
      allLeagueTeams.find((t) => t._id.equals('5ec9358e8c0dd900074685c3')),
      {
        _id: new ObjectId('aebc62a9d09245d2a7c62eb6'),
        discord_id: '688286346783359027',
        name: 'Inferno Prospect',
        franchise_id: new ObjectId('600fac63be0bbe0008ffddc7'),
      },
    ])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(new Error(expectedError))
  })
  it('should not add stats for games where one franchise is identified', async () => {
    let expectedError = `expected to identify match between 2 franchises, but found 1. Franchises: 600fac63be0bbe0008ffddc7.\n`
    expectedError += `Players:\n`
    expectedError += `Calster: Inferno Prospect\n`
    expectedError += `Cheezy: Inferno Prospect, Inferno Prospect\n`
    expectedError += `Delephant: Inferno Prospect\n`
    expectedError += `Pace.: Inferno Prospect\n`
    expectedError += `MARKsmanRL: \n`
    expectedError += `Lege: Inferno Prospect\n`
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    const testMockPlayers = mockPlayers.map((player) => {
      const newPlayer = cloneDeep(player)
      newPlayer.team_history.forEach((h) => {
        h.team_id = new ObjectId('aebc62a9d09245d2a7c62eb6')
      })
      return newPlayer
    })
    players.Model.find.mockResolvedValue(testMockPlayers)
    teams.Model.find.mockResolvedValue([
      mockTeams.find((t) => t._id.equals('5ec9358d8c0dd900074685bf')),
      {
        _id: new ObjectId('aebc62a9d09245d2a7c62eb6'),
        discord_id: '688286346783359027',
        name: 'Inferno Prospect',
        franchise_id: new ObjectId('600fac63be0bbe0008ffddc7'),
      },
    ])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(new Error(expectedError))
  })
  it('should throw an error if the match does not meet best_of requirements', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    ballchasing.getReplayData.mockResolvedValue([replays[0], replays[1], replays[3]])
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '111c0144-7219-426a-8263-8cff260d030d' },
        ],
      }),
    ).rejects.toEqual(new Error('expected a team to win the best of 5 match, but winning team has only 2'))
  })
  it('should throw an error if the report contains too many wins', async () => {
    players.Model.find.mockResolvedValue([])
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    ballchasing.getReplayData.mockResolvedValue([])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        mentioned_team_ids: ['5ec9358d8c0dd900074685bf', '5ec9358d8c0dd900074685c1'],
        report_games: [
          {
            report_type: 'MANUAL_REPORT',
            winning_team_id: '5ec9358d8c0dd900074685bf',
            game_number: 1,
          },
          {
            report_type: 'MANUAL_REPORT',
            winning_team_id: '5ec9358d8c0dd900074685bf',
            game_number: 2,
          },
          {
            report_type: 'MANUAL_REPORT',
            winning_team_id: '5ec9358d8c0dd900074685bf',
            game_number: 3,
          },
          {
            report_type: 'MANUAL_REPORT',
            winning_team_id: '5ec9358d8c0dd900074685bf',
            game_number: 3,
          },
        ],
      }),
    ).rejects.toEqual(new Error('expected team to win 3 games in best of 5 match, but received 4 wins'))
  })
  it('should throw an error if less than one match is returned', async () => {
    players.Model.find.mockResolvedValue(mockPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([])
    ballchasing.getReplayData.mockResolvedValue([replays[0], replays[1], replays[3]])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(new Error('found 0 matches between teams: Inferno Premier, Superiors Premier'))
  })
  it('should throw an error if no league id is passed', async () => {
    await expect(
      processMatch({
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(new Error('no league id or games passed for new match'))
  })
  it('should create players and throw a recoverable error if players do not exist in league database', async () => {
    const missingPlayers = [...mockPlayers].slice(0, mockPlayers.length - 2)
    players.Model.find.mockResolvedValue(missingPlayers)
    teams.Model.find.mockResolvedValue(mockTeams)
    matchesFindMock.mockResolvedValue([mockOpenMatch()])
    await expect(
      processMatch({
        league_id: '5ebc62b1d09245d2a7c63516',
        report_games: [
          { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
          { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
          { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
          { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
        ],
      }),
    ).rejects.toEqual(new Error('NO_PLAYER_FOUND'))
    expect(players.Model.create.mock.calls).toHaveLength(2)
    expect(players.Model.create.mock.calls[0][0]).toMatchObject({
      screen_name: 'MARKsman.',
      accounts: [
        {
          platform: 'steam',
          platform_id: '76561198118651841',
        },
      ],
    })
    expect(players.Model.create.mock.calls[1][0]).toMatchObject({
      screen_name: 'Lege',
      accounts: [
        {
          platform: 'steam',
          platform_id: '76561198397509094',
        },
      ],
    })
  })
})

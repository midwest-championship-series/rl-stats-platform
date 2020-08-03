const { ObjectId } = require('mongodb')

const aws = require('../services/aws')

const matches = require('../model/mongodb/matches')
const seasons = require('../model/mongodb/seasons')
const leagues = require('../model/mongodb/leagues')

// mocks
jest.mock('../services/aws')
jest.mock('../services/mongodb')
jest.mock('../model/mongodb/matches')
jest.mock('../model/mongodb/seasons')
jest.mock('../model/mongodb/leagues')

const matchesFindMock = jest.fn()
matches.Model = {
  find: jest.fn(() => ({ populate: matchesFindMock })),
}
const seasonsFindMock = jest.fn()
seasons.Model = {
  find: jest.fn(() => ({ populate: jest.fn(() => ({ populate: seasonsFindMock })) })),
}
const leaguesFindMock = jest.fn()
leagues.Model = {
  find: jest.fn(() => ({ populate: jest.fn(() => ({ populate: jest.fn(() => ({ populate: leaguesFindMock })) })) })),
}

const mockMatches = [
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c63401'),
    games: [
      { ballchasing_id: '595ac248-5f25-48a5-bf39-9b50f25e97a1' },
      { ballchasing_id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e' },
      { ballchasing_id: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6' },
      { ballchasing_id: '877f66a5-23c9-4397-9c47-97c9870351c0' },
    ],
  },
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c63402'),
    games: [
      { ballchasing_id: '126f416e-d845-45b9-b843-8afe300d4e2a' },
      { ballchasing_id: 'ab847408-5927-442b-b888-c5a2d68c96e4' },
      { ballchasing_id: 'c813c19a-2a4e-4df9-9fda-608425b1a356' },
    ],
  },
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c6340a'),
    games: [],
  },
]
const extraMockMatch = {
  _id: new ObjectId('5ebc62b0d09245d2a7c63401'),
  games: [
    { ballchasing_id: '126f416e-d845-45b9-b843-8afe300d4e2b' },
    { ballchasing_id: 'ab847408-5927-442b-b888-c5a2d68c96eb' },
    { ballchasing_id: 'c813c19a-2a4e-4df9-9fda-608425b1a35b' },
  ],
}
const mockSeasons = [
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c6340a'),
    season_type: 'REG',
    matches: mockMatches,
  },
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c6340b'),
    season_type: 'REG',
    matches: [extraMockMatch],
  },
]
const mockLeagues = [{ seasons: [{ matches: mockMatches }] }, { seasons: [{ matches: [extraMockMatch] }] }]

const reprocessGames = require('../reprocess-games')

describe('reprocess-games', () => {
  process.env.GAMES_QUEUE_URL = 'fake queue url'
  it('should reprocess matches', async () => {
    matchesFindMock.mockResolvedValue(mockMatches)
    await reprocessGames('matches', { week: 1 })
    expect(aws.sqs.sendMessageBatch).toHaveBeenCalledWith('fake queue url', [
      {
        match_id: '5ebc62b0d09245d2a7c63401',
        game_ids: [
          '595ac248-5f25-48a5-bf39-9b50f25e97a1',
          'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
          'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
          '877f66a5-23c9-4397-9c47-97c9870351c0',
        ],
      },
      {
        match_id: '5ebc62b0d09245d2a7c63402',
        game_ids: [
          '126f416e-d845-45b9-b843-8afe300d4e2a',
          'ab847408-5927-442b-b888-c5a2d68c96e4',
          'c813c19a-2a4e-4df9-9fda-608425b1a356',
        ],
      },
    ])
  })
  it('should reprocess seasons', async () => {
    seasonsFindMock.mockResolvedValue(mockSeasons)
    await reprocessGames('seasons', { season_type: 'REG' })
    expect(aws.sqs.sendMessageBatch).toHaveBeenCalledWith('fake queue url', [
      {
        match_id: '5ebc62b0d09245d2a7c63401',
        game_ids: [
          '595ac248-5f25-48a5-bf39-9b50f25e97a1',
          'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
          'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
          '877f66a5-23c9-4397-9c47-97c9870351c0',
        ],
      },
      {
        match_id: '5ebc62b0d09245d2a7c63402',
        game_ids: [
          '126f416e-d845-45b9-b843-8afe300d4e2a',
          'ab847408-5927-442b-b888-c5a2d68c96e4',
          'c813c19a-2a4e-4df9-9fda-608425b1a356',
        ],
      },
      {
        match_id: '5ebc62b0d09245d2a7c63401',
        game_ids: [
          '126f416e-d845-45b9-b843-8afe300d4e2b',
          'ab847408-5927-442b-b888-c5a2d68c96eb',
          'c813c19a-2a4e-4df9-9fda-608425b1a35b',
        ],
      },
    ])
  })
  it('should reprocess leagues', async () => {
    leaguesFindMock.mockResolvedValue(mockLeagues)
    await reprocessGames('leagues', {})
    expect(aws.sqs.sendMessageBatch).toHaveBeenCalledWith('fake queue url', [
      {
        match_id: '5ebc62b0d09245d2a7c63401',
        game_ids: [
          '595ac248-5f25-48a5-bf39-9b50f25e97a1',
          'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
          'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
          '877f66a5-23c9-4397-9c47-97c9870351c0',
        ],
      },
      {
        match_id: '5ebc62b0d09245d2a7c63402',
        game_ids: [
          '126f416e-d845-45b9-b843-8afe300d4e2a',
          'ab847408-5927-442b-b888-c5a2d68c96e4',
          'c813c19a-2a4e-4df9-9fda-608425b1a356',
        ],
      },
      {
        match_id: '5ebc62b0d09245d2a7c63401',
        game_ids: [
          '126f416e-d845-45b9-b843-8afe300d4e2b',
          'ab847408-5927-442b-b888-c5a2d68c96eb',
          'c813c19a-2a4e-4df9-9fda-608425b1a35b',
        ],
      },
    ])
  })
})

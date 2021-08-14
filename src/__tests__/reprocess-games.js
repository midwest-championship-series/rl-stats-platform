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
  find: jest.fn(() => ({ populate: seasonsFindMock })),
}
const leaguesFindMock = jest.fn()
leagues.Model = {
  find: jest.fn(() => ({ populate: leaguesFindMock })),
}

const mockMatches = [
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c63401'),
    games: [
      { replay_origin: { source: 'ballchasing', key: '595ac248-5f25-48a5-bf39-9b50f25e97a1' } },
      { replay_origin: { source: 'ballchasing', key: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e' } },
      { replay_origin: { source: 'ballchasing', key: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6' } },
      { replay_origin: { source: 'ballchasing', key: '877f66a5-23c9-4397-9c47-97c9870351c0' } },
    ],
  },
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c63402'),
    games: [
      { replay_origin: { source: 'ballchasing', key: '126f416e-d845-45b9-b843-8afe300d4e2a' } },
      { replay_origin: { source: 'ballchasing', key: 'ab847408-5927-442b-b888-c5a2d68c96e4' } },
      { replay_origin: { source: 'ballchasing', key: 'c813c19a-2a4e-4df9-9fda-608425b1a356' } },
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
    { replay_origin: { source: 'ballchasing', key: '126f416e-d845-45b9-b843-8afe300d4e2b' } },
    { replay_origin: { source: 'ballchasing', key: 'ab847408-5927-442b-b888-c5a2d68c96eb' } },
    { replay_origin: { source: 'ballchasing', key: 'c813c19a-2a4e-4df9-9fda-608425b1a35b' } },
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
  it('should reprocess matches', async () => {
    matchesFindMock.mockResolvedValue(mockMatches)
    await reprocessGames('matches', { week: 1 })
    expect(aws.eventBridge.emitEvents).toHaveBeenCalledWith([
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          replays: [
            {
              bucket: {
                key: '595ac248-5f25-48a5-bf39-9b50f25e97a1',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: '877f66a5-23c9-4397-9c47-97c9870351c0',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63402',
          replays: [
            {
              bucket: {
                key: '126f416e-d845-45b9-b843-8afe300d4e2a',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'ab847408-5927-442b-b888-c5a2d68c96e4',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'c813c19a-2a4e-4df9-9fda-608425b1a356',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
    ])
  })
  it('should reprocess seasons', async () => {
    seasonsFindMock.mockResolvedValue(mockSeasons)
    await reprocessGames('seasons', { season_type: 'REG' })
    expect(aws.eventBridge.emitEvents).toHaveBeenCalledWith([
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          replays: [
            {
              bucket: {
                key: '595ac248-5f25-48a5-bf39-9b50f25e97a1',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: '877f66a5-23c9-4397-9c47-97c9870351c0',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63402',
          replays: [
            {
              bucket: {
                key: '126f416e-d845-45b9-b843-8afe300d4e2a',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'ab847408-5927-442b-b888-c5a2d68c96e4',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'c813c19a-2a4e-4df9-9fda-608425b1a356',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          replays: [
            {
              bucket: {
                key: '126f416e-d845-45b9-b843-8afe300d4e2b',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'ab847408-5927-442b-b888-c5a2d68c96eb',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'c813c19a-2a4e-4df9-9fda-608425b1a35b',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
    ])
  })
  it('should reprocess leagues', async () => {
    leaguesFindMock.mockResolvedValue(mockLeagues)
    await reprocessGames('leagues', {})
    expect(aws.eventBridge.emitEvents).toHaveBeenCalledWith([
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          replays: [
            {
              bucket: {
                key: '595ac248-5f25-48a5-bf39-9b50f25e97a1',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: '877f66a5-23c9-4397-9c47-97c9870351c0',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63402',
          replays: [
            {
              bucket: {
                key: '126f416e-d845-45b9-b843-8afe300d4e2a',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'ab847408-5927-442b-b888-c5a2d68c96e4',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'c813c19a-2a4e-4df9-9fda-608425b1a356',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          replays: [
            {
              bucket: {
                key: '126f416e-d845-45b9-b843-8afe300d4e2b',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'ab847408-5927-442b-b888-c5a2d68c96eb',
                source: 'ballchasing',
              },
            },
            {
              bucket: {
                key: 'c813c19a-2a4e-4df9-9fda-608425b1a35b',
                source: 'ballchasing',
              },
            },
          ],
        },
      },
    ])
  })
})

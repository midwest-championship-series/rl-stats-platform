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
      {
        replay_stored: { key: 'ballchasing:595ac248-5f25-48a5-bf39-9b50f25e97a1.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: '595ac248-5f25-48a5-bf39-9b50f25e97a1' },
      },
      {
        replay_stored: { key: 'ballchasing:b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e' },
      },
      {
        replay_stored: { key: 'ballchasing:a1ed2167-3f3f-46e0-b198-ef765d4adac6.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6' },
      },
      {
        replay_stored: { key: 'ballchasing:877f66a5-23c9-4397-9c47-97c9870351c0.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: '877f66a5-23c9-4397-9c47-97c9870351c0' },
      },
    ],
  },
  {
    _id: new ObjectId('5ebc62b0d09245d2a7c63402'),
    games: [
      {
        replay_stored: { key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2a.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: '126f416e-d845-45b9-b843-8afe300d4e2a' },
      },
      {
        replay_stored: { key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96e4.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: 'ab847408-5927-442b-b888-c5a2d68c96e4' },
      },
      {
        replay_stored: { key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a356.replay', source: 'mock-bucket' },
        replay_origin: { source: 'ballchasing', key: 'c813c19a-2a4e-4df9-9fda-608425b1a356' },
      },
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
    {
      replay_stored: { key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2b.replay', source: 'mock-bucket' },
      replay_origin: { source: 'ballchasing', key: '126f416e-d845-45b9-b843-8afe300d4e2b' },
    },
    {
      replay_stored: { key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96eb.replay', source: 'mock-bucket' },
      replay_origin: { source: 'ballchasing', key: 'ab847408-5927-442b-b888-c5a2d68c96eb' },
    },
    {
      replay_stored: { key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a35b.replay', source: 'mock-bucket' },
      replay_origin: { source: 'ballchasing', key: 'c813c19a-2a4e-4df9-9fda-608425b1a35b' },
    },
  ],
}

const mockManualMatch = {
  _id: new ObjectId('5ec9359b8c0dd900074686d3'),
  games: [
    {
      report_type: 'MANUAL_REPORT',
      game_number: 1,
      winning_team_id: '5ebc62a9d09245d2a7c62eb3',
      forfeit_team_id: '5ec9358e8c0dd900074685c3',
    },
    {
      report_type: 'MANUAL_REPORT',
      game_number: 2,
      winning_team_id: '5ebc62a9d09245d2a7c62eb3',
    },
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
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          report_games: [
            {
              bucket: {
                key: 'ballchasing:595ac248-5f25-48a5-bf39-9b50f25e97a1.replay',
                source: 'mock-bucket',
              },
              id: '595ac248-5f25-48a5-bf39-9b50f25e97a1',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e.replay',
                source: 'mock-bucket',
              },
              id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:a1ed2167-3f3f-46e0-b198-ef765d4adac6.replay',
                source: 'mock-bucket',
              },
              id: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:877f66a5-23c9-4397-9c47-97c9870351c0.replay',
                source: 'mock-bucket',
              },
              id: '877f66a5-23c9-4397-9c47-97c9870351c0',
              upload_source: 'ballchasing',
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63402',
          report_games: [
            {
              bucket: {
                key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2a.replay',
                source: 'mock-bucket',
              },
              id: '126f416e-d845-45b9-b843-8afe300d4e2a',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96e4.replay',
                source: 'mock-bucket',
              },
              id: 'ab847408-5927-442b-b888-c5a2d68c96e4',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a356.replay',
                source: 'mock-bucket',
              },
              id: 'c813c19a-2a4e-4df9-9fda-608425b1a356',
              upload_source: 'ballchasing',
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
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          report_games: [
            {
              bucket: { key: 'ballchasing:595ac248-5f25-48a5-bf39-9b50f25e97a1.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '595ac248-5f25-48a5-bf39-9b50f25e97a1',
            },
            {
              bucket: { key: 'ballchasing:b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
            },
            {
              bucket: { key: 'ballchasing:a1ed2167-3f3f-46e0-b198-ef765d4adac6.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
            },
            {
              bucket: { key: 'ballchasing:877f66a5-23c9-4397-9c47-97c9870351c0.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '877f66a5-23c9-4397-9c47-97c9870351c0',
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63402',
          report_games: [
            {
              bucket: { key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2a.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '126f416e-d845-45b9-b843-8afe300d4e2a',
            },
            {
              bucket: { key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96e4.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'ab847408-5927-442b-b888-c5a2d68c96e4',
            },
            {
              bucket: { key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a356.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'c813c19a-2a4e-4df9-9fda-608425b1a356',
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          report_games: [
            {
              bucket: { key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2b.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '126f416e-d845-45b9-b843-8afe300d4e2b',
            },
            {
              bucket: { key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96eb.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'ab847408-5927-442b-b888-c5a2d68c96eb',
            },
            {
              bucket: { key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a35b.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'c813c19a-2a4e-4df9-9fda-608425b1a35b',
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
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          report_games: [
            {
              bucket: { key: 'ballchasing:595ac248-5f25-48a5-bf39-9b50f25e97a1.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '595ac248-5f25-48a5-bf39-9b50f25e97a1',
            },
            {
              bucket: { key: 'ballchasing:b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
            },
            {
              bucket: { key: 'ballchasing:a1ed2167-3f3f-46e0-b198-ef765d4adac6.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
            },
            {
              bucket: { key: 'ballchasing:877f66a5-23c9-4397-9c47-97c9870351c0.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '877f66a5-23c9-4397-9c47-97c9870351c0',
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63402',
          report_games: [
            {
              bucket: { key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2a.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '126f416e-d845-45b9-b843-8afe300d4e2a',
            },
            {
              bucket: { key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96e4.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'ab847408-5927-442b-b888-c5a2d68c96e4',
            },
            {
              bucket: { key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a356.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'c813c19a-2a4e-4df9-9fda-608425b1a356',
            },
          ],
        },
      },
      {
        type: 'MATCH_PROCESS_INIT',
        detail: {
          match_id: '5ebc62b0d09245d2a7c63401',
          report_games: [
            {
              bucket: { key: 'ballchasing:126f416e-d845-45b9-b843-8afe300d4e2b.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: '126f416e-d845-45b9-b843-8afe300d4e2b',
            },
            {
              bucket: { key: 'ballchasing:ab847408-5927-442b-b888-c5a2d68c96eb.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'ab847408-5927-442b-b888-c5a2d68c96eb',
            },
            {
              bucket: { key: 'ballchasing:c813c19a-2a4e-4df9-9fda-608425b1a35b.replay', source: 'mock-bucket' },
              upload_source: 'ballchasing',
              id: 'c813c19a-2a4e-4df9-9fda-608425b1a35b',
            },
          ],
        },
      },
    ])
  })
  it('should reprocess matches with forfeited games', async () => {
    matchesFindMock.mockResolvedValue([mockManualMatch])
    await reprocessGames('matches', { week: 9 })
    expect(aws.eventBridge.emitEvents).toHaveBeenCalledWith([
      {
        detail: {
          match_id: '5ec9359b8c0dd900074686d3',
          report_games: [
            {
              forfeit: true,
              game_number: 1,
              report_type: 'MANUAL_REPORT',
              winning_team_id: '5ebc62a9d09245d2a7c62eb3',
            },
            {
              forfeit: false,
              game_number: 2,
              report_type: 'MANUAL_REPORT',
              winning_team_id: '5ebc62a9d09245d2a7c62eb3',
            },
          ],
        },
        type: 'MATCH_PROCESS_INIT',
      },
    ])
  })
})

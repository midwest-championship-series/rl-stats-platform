const { ObjectId } = require('mongodb')

// mocks
jest.mock('../services/mongodb')
const games = require('../model/mongodb/games')
jest.mock('../model/mongodb/games')
games.Model = {
  find: jest.fn(),
}
const matches = require('../model/mongodb/matches')
jest.mock('../model/mongodb/matches')
const matchesFindByIdMock = jest.fn()
const matchesFindMock = jest.fn()
matches.Model = {
  findById: jest.fn(() => ({ populate: matchesFindByIdMock })),
  find: jest.fn(() => ({ exec: matchesFindMock })),
}
const aws = require('../services/aws')
jest.mock('../services/aws')
const ballchasing = require('../services/ballchasing')
jest.mock('../services/ballchasing')
const wait = require('../util/wait')
jest.mock('../util/wait')

const reportGames = require('../report-match')

describe('report-games', () => {
  process.env.GAMES_QUEUE_URL = 'fake queue url'
  afterEach(() => {
    matchesFindByIdMock.mockClear()
    matchesFindMock.mockClear()
  })
  it('should process new games given urls', async () => {
    // simulate first game reported
    games.Model.find.mockResolvedValueOnce([])
    const result = await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      urls: [
        'https://ballchasing.com/replay/595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'https://ballchasing.com/replay/b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'https://ballchasing.com/replay/a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        'https://ballchasing.com/replay/877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
      reply_to_channel: '692994579305332806',
    })
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      type: 'MATCH_PROCESS_INIT',
      detail: {
        league_id: '5ebc62b1d09245d2a7c63516',
        game_ids: [
          '595ac248-5f25-48a5-bf39-9b50f25e97a1',
          'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
          'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
          '877f66a5-23c9-4397-9c47-97c9870351c0',
        ],
        reply_to_channel: '692994579305332806',
      },
    })
    const replayLocations = {
      replays: [
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
    }
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
      detail: replayLocations,
    })
    expect(result).toMatchObject(replayLocations)
  })
  it('should not allow reported games to be re-reported', async () => {
    matchesFindMock.mockResolvedValueOnce([])
    games.Model.find.mockResolvedValueOnce([{}])
    await expect(
      reportGames({
        league_id: '5ebc62b1d09245d2a7c63516',
        urls: [
          'https://ballchasing.com/replay/5ebc62afd09245d2a7c63355',
          'https://ballchasing.com/replay/5ebc62afd09245d2a7c6333b',
          'https://ballchasing.com/replay/5ebc62afd09245d2a7c63326',
        ],
      }),
    ).rejects.toEqual(new Error('games have already been reported - please use the !reprocess command'))
  })
})

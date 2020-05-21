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

const reportGames = require('../report-games')

describe('report-games', () => {
  process.env.GAMES_QUEUE_URL = 'fake queue url'
  afterEach(() => {
    aws.sqs.sendMessage.mockClear()
    matchesFindByIdMock.mockClear()
    matchesFindMock.mockClear()
  })
  it('should report games given a match_id', async () => {
    matchesFindByIdMock.mockResolvedValueOnce({
      _id: new ObjectId('5ebc62b0d09245d2a7c63401'),
      games: [
        { _id: new ObjectId('5ebc62afd09245d2a7c63310'), ballchasing_id: '595ac248-5f25-48a5-bf39-9b50f25e97a1' },
        { _id: new ObjectId('5ebc62afd09245d2a7c63304'), ballchasing_id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e' },
        { _id: new ObjectId('5ebc62afd09245d2a7c632f5'), ballchasing_id: 'a1ed2167-3f3f-46e0-b198-ef765d4adac6' },
        { _id: new ObjectId('5ebc62afd09245d2a7c63302'), ballchasing_id: '877f66a5-23c9-4397-9c47-97c9870351c0' },
      ],
    })
    const result = await reportGames({ match_id: '5ebc62b0d09245d2a7c63401' })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      game_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
      match_id: '5ebc62b0d09245d2a7c63401',
    })
    expect(result).toMatchObject({
      recorded_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
    })
  })
  it('should process new games given game_ids', async () => {
    // simulate first game reported
    games.Model.find.mockResolvedValueOnce([])
    const result = await reportGames({
      game_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
    })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      game_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
      match_id: undefined,
    })
    expect(result).toMatchObject({
      recorded_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
    })
  })
  it('should not allow reported games to be re-reported', async () => {
    matchesFindMock.mockResolvedValueOnce([])
    games.Model.find.mockResolvedValueOnce([{}])
    await expect(
      reportGames({
        game_ids: ['5ebc62afd09245d2a7c63355', '5ebc62afd09245d2a7c6333b', '5ebc62afd09245d2a7c63326'],
      }),
    ).rejects.toEqual(new Error('games have already been reported - please use the !reprocess command'))
  })
  it('should throw an error if there is not a match id or game ids in the body', async () => {
    await expect(reportGames({})).rejects.toEqual(new Error('expected match_id or game_ids[] in request body'))
  })
})

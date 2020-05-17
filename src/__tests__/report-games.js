const { ObjectId } = require('mongodb')

// mocks
jest.mock('../services/mongodb')
const games = require('../model/mongodb/games')
jest.mock('../model/mongodb/games')
const matches = require('../model/mongodb/matches')
jest.mock('../model/mongodb/matches')
const matchesFindByIdMock = jest.fn()
const matchesFindMock = jest.fn()
matches.Model = {
  findById: jest.fn(() => ({ exec: matchesFindByIdMock })),
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
      game_ids: [
        new ObjectId('5ebc62afd09245d2a7c63310'),
        new ObjectId('5ebc62afd09245d2a7c63304'),
        new ObjectId('5ebc62afd09245d2a7c632f5'),
        new ObjectId('5ebc62afd09245d2a7c63302'),
      ],
    })
    const result = await reportGames({ match_id: '5ebc62b0d09245d2a7c63401' })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      game_ids: [
        '5ebc62afd09245d2a7c63310',
        '5ebc62afd09245d2a7c63304',
        '5ebc62afd09245d2a7c632f5',
        '5ebc62afd09245d2a7c63302',
      ],
      match_id: '5ebc62b0d09245d2a7c63401',
    })
    expect(result).toMatchObject({
      recorded_ids: [
        '5ebc62afd09245d2a7c63310',
        '5ebc62afd09245d2a7c63304',
        '5ebc62afd09245d2a7c632f5',
        '5ebc62afd09245d2a7c63302',
      ],
    })
  })
  it('should process games given game_ids', async () => {
    // simulate first game reported
    matchesFindMock.mockResolvedValueOnce([])
    const result = await reportGames({
      game_ids: [
        '5ebc62afd09245d2a7c63310',
        '5ebc62afd09245d2a7c63304',
        '5ebc62afd09245d2a7c632f5',
        '5ebc62afd09245d2a7c63302',
      ],
    })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      game_ids: [
        '5ebc62afd09245d2a7c63310',
        '5ebc62afd09245d2a7c63304',
        '5ebc62afd09245d2a7c632f5',
        '5ebc62afd09245d2a7c63302',
      ],
      match_id: undefined,
    })
    expect(result).toMatchObject({
      recorded_ids: [
        '5ebc62afd09245d2a7c63310',
        '5ebc62afd09245d2a7c63304',
        '5ebc62afd09245d2a7c632f5',
        '5ebc62afd09245d2a7c63302',
      ],
    })
  })
  it('should process a new set of game_ids into a match', async () => {
    matchesFindMock.mockResolvedValueOnce([
      {
        _id: new ObjectId('5ebc62b0d09245d2a7c63408'),
        game_ids: [
          new ObjectId('5ebc62afd09245d2a7c63355'),
          new ObjectId('5ebc62afd09245d2a7c6333b'),
          new ObjectId('5ebc62afd09245d2a7c63326'),
        ],
      },
    ])
    const result = await reportGames({
      game_ids: ['5ebc62afd09245d2a7c63355', '5ebc62afd09245d2a7c6333b', '5ebc62afd09245d2a7c63326'],
    })
    expect(result).toMatchObject({
      recorded_ids: ['5ebc62afd09245d2a7c63355', '5ebc62afd09245d2a7c6333b', '5ebc62afd09245d2a7c63326'],
    })
  })
  it('should not process games from different matches', async () => {
    matchesFindMock.mockResolvedValueOnce([
      { _id: new ObjectId('5ebc62b0d09245d2a7c63408') },
      { _id: new ObjectId('5ebc62b0d09245d2a7c63401') },
    ])
    await expect(
      reportGames({
        game_ids: [
          '5ebc62afd09245d2a7c63310',
          '5ebc62afd09245d2a7c63304',
          '5ebc62afd09245d2a7c632f5',
          '5ebc62afd09245d2a7c63302',
          '5ebc62afd09245d2a7c63302',
        ],
      }),
    ).rejects.toEqual(
      new Error(
        'cannot report games from multiple matches at once: 5ebc62b0d09245d2a7c63408, 5ebc62b0d09245d2a7c63401',
      ),
    )
  })
  it('should not process games of different length than existing match', async () => {
    matchesFindMock.mockResolvedValueOnce([
      {
        _id: new ObjectId('5ebc62b0d09245d2a7c63408'),
        game_ids: [
          new ObjectId('5ebc62afd09245d2a7c63355'),
          new ObjectId('5ebc62afd09245d2a7c6333b'),
          new ObjectId('5ebc62afd09245d2a7c63326'),
        ],
      },
    ])
    await expect(
      reportGames({
        game_ids: [
          '5ebc62afd09245d2a7c63310',
          '5ebc62afd09245d2a7c63304',
          '5ebc62afd09245d2a7c632f5',
          '5ebc62afd09245d2a7c63302',
          '5ebc62afd09245d2a7c63302',
        ],
      }),
    ).rejects.toEqual(
      new Error(
        'expected same number of games to be reported as games in match: 5ebc62b0d09245d2a7c63408, expected 3 but got 5',
      ),
    )
  })
})

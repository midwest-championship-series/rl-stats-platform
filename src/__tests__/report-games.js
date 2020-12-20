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
  it('should process new games given game_ids', async () => {
    // simulate first game reported
    games.Model.find.mockResolvedValueOnce([])
    const result = await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      game_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
      reply_to_channel: '692994579305332806',
    })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      league_id: '5ebc62b1d09245d2a7c63516',
      game_ids: [
        '595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
        '877f66a5-23c9-4397-9c47-97c9870351c0',
      ],
      reply_to_channel: '692994579305332806',
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
  it('should report a forfeit', async () => {
    await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ec9358e8c0dd900074685c3',
      reply_to_channel: '692994579305332806',
    })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      league_id: '5ebc62b1d09245d2a7c63516',
      match_id: '5f2c5e4e08c88e00084b44a6',
      forfeit_team_id: '5ec9358e8c0dd900074685c3',
      reply_to_channel: '692994579305332806',
    })
  })
  it('should validate forfeit', async () => {
    const expectedErr = new Error('need league_id, forfeit_team_id and match_id to process forfeit')
    await expect(
      reportGames({
        league_id: '5ebc62b1d09245d2a7c63516',
        forfeit_team_id: '5ec9358e8c0dd900074685c3',
      }),
    ).rejects.toEqual(expectedErr)
    await expect(
      reportGames({
        match_id: '5f2c5e4e08c88e00084b44a6',
        forfeit_team_id: '5ec9358e8c0dd900074685c3',
      }),
    ).rejects.toEqual(expectedErr)
  })
  it('should not allow reported games to be re-reported', async () => {
    matchesFindMock.mockResolvedValueOnce([])
    games.Model.find.mockResolvedValueOnce([{}])
    await expect(
      reportGames({
        league_id: '5ebc62b1d09245d2a7c63516',
        game_ids: ['5ebc62afd09245d2a7c63355', '5ebc62afd09245d2a7c6333b', '5ebc62afd09245d2a7c63326'],
      }),
    ).rejects.toEqual(new Error('games have already been reported - please use the !reprocess command'))
  })
  it('should throw an error if there is not a match id or game ids in the body', async () => {
    await expect(reportGames({})).rejects.toEqual(new Error('request requires league_id and game_ids'))
  })
})

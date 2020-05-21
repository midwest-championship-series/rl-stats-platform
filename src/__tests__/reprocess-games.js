const { ObjectId } = require('mongodb')

// mocks
jest.mock('../services/mongodb')
const matches = require('../model/mongodb/matches')
jest.mock('../model/mongodb/matches')
const matchesFindMock = jest.fn()
matches.Model = {
  find: jest.fn(() => ({ populate: matchesFindMock })),
}
const aws = require('../services/aws')
jest.mock('../services/aws')

const reprocessGames = require('../reprocess-games')

describe('reprocess-games', () => {
  process.env.GAMES_QUEUE_URL = 'fake queue url'
  it('should reprocess matches', async () => {
    matchesFindMock.mockResolvedValueOnce([
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
    ])
    await reprocessGames({ season: 1 })
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
})

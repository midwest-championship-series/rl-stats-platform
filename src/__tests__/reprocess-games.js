const reprocessGames = require('../reprocess-games')

// mocks
const games = require('../model/sheets/games')
jest.mock('../model/sheets/games')
const schedules = require('../model/sheets/schedules')
jest.mock('../model/sheets/schedules')
const aws = require('../services/aws')
jest.mock('../services/aws')

describe('reprocess-games', () => {
  process.env.GAMES_QUEUE_URL = 'fake queue url'
  it('should reprocess games', async () => {
    schedules.get.mockResolvedValue([{ id: '123' }, { id: '456' }, { id: '789' }])
    games.get.mockResolvedValue([
      { game_id: 'game 1 id', match_id: '123' },
      { game_id: 'game 2 id', match_id: '123' },
      { game_id: 'game 3 id', match_id: '123' },
      { game_id: 'game 1 id', match_id: '789' },
    ])
    await reprocessGames({ season: 1 })
    expect(aws.sqs.sendMessageBatch).toHaveBeenCalledWith('fake queue url', [
      {
        game_ids: ['game 1 id', 'game 2 id', 'game 3 id'],
        match_id: '123',
      },
      { game_ids: ['game 1 id'], match_id: '789' },
    ])
  })
})

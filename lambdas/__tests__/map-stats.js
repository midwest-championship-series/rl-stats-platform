const fs = require('fs')
const path = require('path')

const { handler: map } = require('../map-stats')

jest.mock('../../src/services/aws')
const aws = require('../../src/services/aws')

jest.mock('../../src/services/rl-bot')

const getGameData = () => {
  return fs.readFileSync(path.join(__dirname, 'example-game.json'))
}

describe('map-stats', () => {
  it('should map stats for a game', async () => {
    aws.s3.get = jest.fn().mockResolvedValue({ Body: getGameData() })
    const mockEvent = {
      type: '',
      detail: {
        parsed_replays: [
          {
            bucket: {
              source: 'rl-stats-producer-event-stats-dev-us-east-1',
              key: 'ballchasing:70cea233-0c8d-47d4-a973-1d63377ca5a0.json',
            },
          },
        ],
      },
    }
    await map(mockEvent)
    expect(aws.s3.get).toHaveBeenCalledWith(
      'rl-stats-producer-event-stats-dev-us-east-1',
      'ballchasing:70cea233-0c8d-47d4-a973-1d63377ca5a0.json',
    )
  })
})

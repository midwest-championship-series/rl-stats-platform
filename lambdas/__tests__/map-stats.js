const fs = require('fs')
const path = require('path')
const { gunzipObject } = require('../../src/util/gzip')

const { handler: map } = require('../map-stats')

jest.mock('../../src/services/aws')
const aws = require('../../src/services/aws')

jest.mock('../../src/services/rl-bot')
jest.mock('../../src/services/mongodb')
jest.mock('../../src/model/mongodb/players')

describe('map-stats', () => {
  beforeEach(async () => {
    aws.s3.get.mockClear()
    const getMatchGames = await gunzipObject(path.join(__dirname, 'games.json.gz'))
    getMatchGames.forEach((game) => {
      aws.s3.get.mockResolvedValue({ Body: JSON.stringify(game) })
    })
  })
  it('should map stats for a game', async () => {
    const mockEvent = {
      type: '',
      detail: {
        parsed_replays: [
          {
            bucket: {
              source: 'rl-stats-producer-event-stats-dev-us-east-1',
              key: 'ballchasing:3ff70d9e-078f-47fd-901b-5b92a1aea2d3.json',
            },
          },
          {
            bucket: {
              source: 'rl-stats-producer-event-stats-dev-us-east-1',
              key: 'ballchasing:7a462c90-ad57-4ce9-a73e-0a49652d3824.json',
            },
          },
          {
            bucket: {
              source: 'rl-stats-producer-event-stats-dev-us-east-1',
              key: 'ballchasing:a1dcfeff-eba5-4880-9b25-137f5fe83d33.json',
            },
          },
          {
            bucket: {
              source: 'rl-stats-producer-event-stats-dev-us-east-1',
              key: 'ballchasing:f02e4f07-4e8c-43b1-9397-e1ecba5284a0.json',
            },
          },
        ],
      },
    }
    await map(mockEvent)
    expect(aws.s3.get).toBeCalledTimes(4)
  })
})

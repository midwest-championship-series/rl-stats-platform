const fs = require('fs')
const path = require('path')
const { gunzipObject } = require('../../src/util/gzip')

const { handler: map } = require('../map-stats')

const mockPlayers = require('../mocks/players')
const mockTeams = require('../mocks/teams')
const mockEvent = {
  type: '',
  detail: {
    parsed_replays: [
      {
        bucket: {
          source: 'rl-stats-producer-event-stats-dev-us-east-1',
          key: 'ballchasing:b8135479-b364-41d0-a78a-7a49ed468521.json',
        },
      },
      {
        bucket: {
          source: 'rl-stats-producer-event-stats-dev-us-east-1',
          key: 'ballchasing:984bd5a4-4a3e-4e2f-b520-47a5bdf8388c.json',
        },
      },
      {
        bucket: {
          source: 'rl-stats-producer-event-stats-dev-us-east-1',
          key: 'ballchasing:7b30993d-bc1e-4c7c-81c5-6ed226888dc8.json',
        },
      },
      {
        bucket: {
          source: 'rl-stats-producer-event-stats-dev-us-east-1',
          key: 'ballchasing:5abd5cb5-e760-45da-8df2-ba0356cf778f.json',
        },
      },
      {
        bucket: {
          source: 'rl-stats-producer-event-stats-dev-us-east-1',
          key: 'ballchasing:5229c01b-9229-4821-86cc-59171b541b70.json',
        },
      },
    ],
  },
}

jest.mock('../../src/services/aws')
const aws = require('../../src/services/aws')

jest.mock('../../src/services/rl-bot')
jest.mock('../../src/services/mongodb')
jest.mock('../../src/model/mongodb')
const models = require('../../src/model/mongodb')

describe('map-stats', () => {
  beforeEach(async () => {
    aws.s3.get.mockClear()
    const getMatchGames = await gunzipObject(path.join(__dirname, 'games.json.gz'))
    getMatchGames.forEach((game) => {
      aws.s3.get.mockResolvedValue({ Body: JSON.stringify(game) })
    })
  })
  it('should map stats for a game', async () => {
    models.Players.find.mockResolvedValue(mockPlayers)
    models.Teams.find.mockResolvedValue(mockTeams)
    await map(mockEvent)
    expect(aws.s3.get).toBeCalledTimes(5)
  })
})

const fs = require('fs')
const path = require('path')
const { gunzipObject } = require('../../src/util/gzip')

const { handler: map } = require('../map-stats')

const mockLeague = require('../mocks/league')
const mockPlayers = require('../mocks/players')
const mockTeams = require('../mocks/teams')
const mockMatch = require('../mocks/match')
const mockEventReplaysParsed = {
  type: 'MATCH_PROCESS_REPLAYS_PARSED',
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
const mockEventMatchReprocess = {
  type: 'MATCH_PROCESS_REPLAYS_PARSED',
  detail: {
    match_id: '6102ff0234129d000872c442',
    parsed_replays: [...mockEventReplaysParsed.detail.parsed_replays],
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
  it('should map stats for a new match', async () => {
    models.Players.find.mockResolvedValue(mockPlayers)
    models.Teams.find.mockResolvedValue(mockTeams)
    models.Leagues.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockLeague),
    })
    models.Matches.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMatch),
    })
    await map(mockEventReplaysParsed)
    expect(aws.s3.get).toBeCalledTimes(5)
  })
  it('should map stats for an existing match', async () => {
    models.Players.find.mockResolvedValue(mockPlayers)
    models.Teams.find.mockResolvedValue(mockTeams)
    models.Leagues.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockLeague),
    })
    models.Matches.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMatch),
    })
    await map(mockEventMatchReprocess)
    expect(aws.s3.get).toBeCalledTimes(5)
  })
})

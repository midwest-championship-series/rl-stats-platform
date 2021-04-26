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
ballchasing.getReplayIdsFromGroup.mockResolvedValue([
  'a1ed2167-3f3f-46e0-b198-ef765d4adac6',
  '877f66a5-23c9-4397-9c47-97c9870351c0',
])
jest.mock('../services/ballchasing')
const wait = require('../util/wait')
jest.mock('../util/wait')

const reportGames = require('../report-match')

describe('report-games', () => {
  afterEach(() => {
    matchesFindByIdMock.mockClear()
    matchesFindMock.mockClear()
    ballchasing.getReplayIdsFromGroup.mockClear()
  })
  it('should process new games given urls', async () => {
    // simulate first game reported
    games.Model.find.mockResolvedValueOnce([])
    const result = await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      urls: [
        'https://ballchasing.com/replay/595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'https://ballchasing.com/replay/b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
        'https://ballchasing.com/group/test-upload-gmix5xcfhp',
      ],
      reply_to_channel: '692994579305332806',
    })
    const gameReports = [
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
    ]
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
      detail: {
        league_id: '5ebc62b1d09245d2a7c63516',
        reply_to_channel: '692994579305332806',
        replays: gameReports,
      },
    })
    expect(result).toMatchObject({
      league_id: '5ebc62b1d09245d2a7c63516',
      reply_to_channel: '692994579305332806',
      replays: gameReports,
    })
  })
  it('should process new games with a mix of urls and manual reports', async () => {
    // simulate first game reported
    games.Model.find.mockResolvedValueOnce([])
    const result = await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      urls: [
        'https://ballchasing.com/replay/595ac248-5f25-48a5-bf39-9b50f25e97a1',
        'https://ballchasing.com/replay/b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
      ],
      mentioned_team_ids: ['5ec9358d8c0dd900074685bd', '5ec9358e8c0dd900074685c3'],
      manual_reports: [
        { winning_team_id: '5ec9358d8c0dd900074685bd', game_number: 2, forfeit: true },
        { winning_team_id: '5ec9358e8c0dd900074685c3', game_number: 3 },
      ],
      reply_to_channel: '692994579305332806',
    })
    const gameReports = [
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
        report_type: 'MANUAL_REPORT',
        winning_team_id: '5ec9358d8c0dd900074685bd',
        game_number: 2,
        forfeit: true,
      },
      {
        report_type: 'MANUAL_REPORT',
        winning_team_id: '5ec9358e8c0dd900074685c3',
        game_number: 3,
      },
    ]
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
      detail: {
        league_id: '5ebc62b1d09245d2a7c63516',
        reply_to_channel: '692994579305332806',
        replays: gameReports,
        mentioned_team_ids: ['5ec9358d8c0dd900074685bd', '5ec9358e8c0dd900074685c3'],
      },
    })
    expect(result).toMatchObject({
      league_id: '5ebc62b1d09245d2a7c63516',
      reply_to_channel: '692994579305332806',
      replays: gameReports,
    })
  })
  it('should process new games only manual reports', async () => {
    // simulate first game reported
    games.Model.find.mockResolvedValueOnce([])
    const result = await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      mentioned_team_ids: ['5ec9358d8c0dd900074685bd', '5ec9358e8c0dd900074685c3'],
      manual_reports: [
        { winning_team_id: '5ec9358d8c0dd900074685bd', game_number: 1 },
        { winning_team_id: '5ec9358d8c0dd900074685bd', game_number: 2, forfeit: true },
        { winning_team_id: '5ec9358e8c0dd900074685c3', game_number: 3 },
        { winning_team_id: '5ec9358d8c0dd900074685bd', game_number: 4 },
      ],
      reply_to_channel: '692994579305332806',
    })
    const gameReports = [
      {
        report_type: 'MANUAL_REPORT',
        winning_team_id: '5ec9358d8c0dd900074685bd',
        game_number: 1,
      },
      {
        report_type: 'MANUAL_REPORT',
        winning_team_id: '5ec9358d8c0dd900074685bd',
        game_number: 2,
        forfeit: true,
      },
      {
        report_type: 'MANUAL_REPORT',
        winning_team_id: '5ec9358e8c0dd900074685c3',
        game_number: 3,
      },
      {
        report_type: 'MANUAL_REPORT',
        winning_team_id: '5ec9358d8c0dd900074685bd',
        game_number: 4,
      },
    ]
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
      detail: {
        league_id: '5ebc62b1d09245d2a7c63516',
        reply_to_channel: '692994579305332806',
        replays: gameReports,
        mentioned_team_ids: ['5ec9358d8c0dd900074685bd', '5ec9358e8c0dd900074685c3'],
      },
    })
    expect(result).toMatchObject({
      league_id: '5ebc62b1d09245d2a7c63516',
      reply_to_channel: '692994579305332806',
      replays: gameReports,
    })
  })
  it('should report a match with a group url', async () => {
    games.Model.find.mockResolvedValue([])
    const result = await reportGames({
      league_id: '5ebc62b1d09245d2a7c63516',
      urls: ['https://ballchasing.com/group/test-upload-gmix5xcfhp/player-stats'],
      reply_to_channel: '692994579305332806',
    })
    expect(ballchasing.getReplayIdsFromGroup).toHaveBeenCalledWith('test-upload-gmix5xcfhp')
  })
  it('should not allow reported games to be re-reported', async () => {
    matchesFindMock.mockResolvedValue([])
    games.Model.find.mockResolvedValue([{}])
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

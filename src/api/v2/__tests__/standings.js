const path = require('path')
const fs = require('fs')

jest.mock('../../../services/mongodb')
jest.mock('../../../model/mongodb/seasons')
const Seasons = require('../../../model/mongodb/seasons')
const seasonsFindByIdMock = jest.fn()
Seasons.Model = {
  findById: jest.fn(() => ({ populate: jest.fn(() => ({ lean: seasonsFindByIdMock })) })),
}
jest.mock('../../../model/sheets/team-games')
const teamGames = require('../../../model/sheets/team-games')
teamGames.get = jest.fn()

const standings = require('../standings')

describe('season standings', () => {
  beforeEach(() => {
    seasonsFindByIdMock.mockResolvedValue({ teams: JSON.parse(fs.readFileSync(path.join(__dirname, 'teams.json'))) })
    teamGames.get.mockResolvedValue(JSON.parse(fs.readFileSync(path.join(__dirname, 'team-games.json'))))
  })
  it('should calculate season standings', async () => {
    const mockRequest = { params: { season_id: '5ebc62b0d09245d2a7c63477' } }
    const mockNext = jest.fn()
    await standings(mockRequest, {}, mockNext)
    expect(mockRequest).toHaveProperty('context')
    expect(mockRequest.context).toMatchObject([
      {
        _id: '5ebc62aad09245d2a7c62ef9',
        match_wins: 2,
        game_differential: 6,
      },
      {
        _id: '5ebc62aad09245d2a7c62efc',
        match_wins: 2,
        game_differential: 4,
      },
      {
        _id: '5ebc62aad09245d2a7c62eed',
        match_wins: 2,
        game_differential: 3,
      },
      {
        _id: '5ebc62a9d09245d2a7c62e5a',
        match_wins: 2,
        game_differential: 1,
      },
      {
        _id: '5ebc62a9d09245d2a7c62e82',
        match_wins: 2,
        game_differential: 1,
      },
      {
        _id: '5ebc62a9d09245d2a7c62eb3',
        match_wins: 1,
        game_differential: 0,
      },
      {
        _id: '5ebc62a9d09245d2a7c62e86',
        match_wins: 1,
        game_differential: 0,
      },
      {
        _id: '5ebc62aad09245d2a7c62ef8',
        match_wins: 1,
        game_differential: -1,
      },
      {
        _id: '5ebc62a9d09245d2a7c62eba',
        match_wins: 0,
        game_differential: -6,
      },
      {
        _id: '5ebc62a9d09245d2a7c62eae',
        match_wins: 0,
        game_differential: -8,
      },
    ])
    expect(mockNext).toHaveBeenCalledTimes(1)
  })
})

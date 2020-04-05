const reportGames = require('../report-games')

// mocks
const ballchasing = require('../services/ballchasing')
jest.mock('../services/ballchasing')
const games = require('../model/games')
jest.mock('../model/games')
const teamGames = require('../model/team-games')
jest.mock('../model/team-games')
const playerGames = require('../model/player-games')
jest.mock('../model/player-games')
const processMatch = require('../producers')
jest.mock('../producers')
jest.mock('../services/aws')

describe('report-games', () => {
  it('should report games given a match_id', async () => {
    games.get.mockResolvedValue([
      '7ea390d1-2a7c-451a-b4a2-8778a2089096',
      '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
      'd4687e39-2848-4958-90b7-264f266ea849',
      '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
    ])
    await reportGames({ match_id: '7b33907d-8132-4027-beda-489aaad70ef' })
  })
  // it('should re-process games given game_ids')
  it('should process a new set of game_ids into a match', async () => {
    ballchasing.getReplays.mockResolvedValue([
      { id: '7ea390d1-2a7c-451a-b4a2-8778a2089096' },
      { id: '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6' },
      { id: 'd4687e39-2848-4958-90b7-264f266ea849' },
      { id: '4fb8a123-6b75-49df-918d-ed5ae85dbfaf' },
    ])
    games.get.mockResolvedValue([])
    processMatch.mockResolvedValue({})
    await reportGames({
      game_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
    })
  })
  it.skip('should not process games from different matches', () => {})
  it.skip('should not process games of different length than existing match', () => {})
  it.skip('should not add a game to an existing match', () => {})
})

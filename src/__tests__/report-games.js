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

describe('report-games', () => {
  it.skip('should report games given a match_id', async () => {
    await reportGames({ match_id: '7b33907d-8132-4027-beda-489aaad70ef' })
  })
  // it('should re-process games given game_ids')
  // it('should process a new set of game_ids into a match')
  // it('should not process games from different matches')
  // it('should not process games of different length than existing match')
  // it('should not add a game to an existing match')
})

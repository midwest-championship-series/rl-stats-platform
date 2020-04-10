const processMatch = require('../process-match')

const schedules = require('../model/schedules')
jest.mock('../model/schedules')
const ballchasing = require('../services/ballchasing')
jest.mock('../services/ballchasing')
const processGame = require('../producers')
jest.mock('../producers')
const teamGames = require('../model/team-games')
jest.mock('../model/team-games')
const playerGames = require('../model/player-games')
jest.mock('../model/player-games')
const games = require('../model/games')
jest.mock('../model/games')

describe('process-match', () => {
  const ballchasingGames = [
    { id: 'd2d31639-1e42-4f0b-9537-545d8d19f63b' },
    { id: '1c76f735-5d28-4dcd-a0f2-bd9a5b129772' },
    { id: '2bfd1be8-b29e-4ce8-8d75-49499354d8e0' },
    { id: '4ed12225-7251-4d63-8bb6-15338c60bcf2' },
  ]
  ballchasing.getReplays.mockResolvedValue(ballchasingGames)
  const match = { id: '69d14320-5103-4c12-bd5b-7bb10719a1da' }
  schedules.get.mockResolvedValue([match])
  processGame.mockResolvedValue({ gameStats: 'game stats', teamStats: 'team stats', playerStats: 'player stats' })
  it('should process a match', async () => {
    const result = await processMatch({
      match_id: '69d14320-5103-4c12-bd5b-7bb10719a1da',
      game_ids: [
        'd2d31639-1e42-4f0b-9537-545d8d19f63b',
        '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
        '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
        '4ed12225-7251-4d63-8bb6-15338c60bcf2',
      ],
    })
    expect(result).toEqual([
      'd2d31639-1e42-4f0b-9537-545d8d19f63b',
      '1c76f735-5d28-4dcd-a0f2-bd9a5b129772',
      '2bfd1be8-b29e-4ce8-8d75-49499354d8e0',
      '4ed12225-7251-4d63-8bb6-15338c60bcf2',
    ])
    expect(processGame).toHaveBeenCalledWith(ballchasingGames, match)
    expect(games.upsert.mock.calls.length).toBe(1)
    expect(games.upsert).toHaveBeenCalledWith({ data: 'game stats' })
    expect(teamGames.upsert.mock.calls.length).toBe(1)
    expect(teamGames.upsert).toHaveBeenCalledWith({ data: 'team stats' })
    expect(playerGames.upsert.mock.calls.length).toBe(1)
    expect(playerGames.upsert).toHaveBeenCalledWith({ data: 'player stats' })
  })
})

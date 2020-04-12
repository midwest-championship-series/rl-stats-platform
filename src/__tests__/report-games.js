const reportGames = require('../report-games')

// mocks
const games = require('../model/games')
jest.mock('../model/games')
const processMatch = require('../producers')
jest.mock('../producers')
const aws = require('../services/aws')
jest.mock('../services/aws')

describe('report-games', () => {
  process.env.GAMES_QUEUE_URL = 'fake queue url'
  afterEach(() => {
    aws.sqs.sendMessage.mockClear()
  })
  it('should report games given a match_id', async () => {
    games.get.mockResolvedValue([
      { game_id: '7ea390d1-2a7c-451a-b4a2-8778a2089096' },
      { game_id: '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6' },
      { game_id: 'd4687e39-2848-4958-90b7-264f266ea849' },
      { game_id: '4fb8a123-6b75-49df-918d-ed5ae85dbfaf' },
    ])
    const result = await reportGames({ match_id: '7b33907d-8132-4027-beda-489aaad70ef3' })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      game_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
      match_id: '7b33907d-8132-4027-beda-489aaad70ef3',
    })
    expect(result).toMatchObject({
      recorded_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
    })
  })
  it('should process games given game_ids', async () => {
    // simulate first game reported
    games.get.mockResolvedValue([])
    const result = await reportGames({
      game_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
    })
    expect(aws.sqs.sendMessage).toHaveBeenCalledWith('fake queue url', {
      game_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
      match_id: undefined,
    })
    expect(result).toMatchObject({
      recorded_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
    })
  })
  it('should process a new set of game_ids into a match', async () => {
    games.get.mockResolvedValue([
      { game_id: '7ea390d1-2a7c-451a-b4a2-8778a2089096', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: 'd4687e39-2848-4958-90b7-264f266ea849', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: '4fb8a123-6b75-49df-918d-ed5ae85dbfaf', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
    ])
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
  it('should not process games from different matches', async () => {
    games.get.mockResolvedValue([
      { game_id: '7ea390d1-2a7c-451a-b4a2-8778a2089096', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: 'd4687e39-2848-4958-90b7-264f266ea849', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: '4fb8a123-6b75-49df-918d-ed5ae85dbfaf', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: '877f66a5-23c9-4397-9c47-97c9870351c0', match_id: 'ff8158fa-972b-4784-adbb-6258139fc683' },
    ])
    processMatch.mockResolvedValue({})
    await expect(
      reportGames({
        game_ids: [
          '7ea390d1-2a7c-451a-b4a2-8778a2089096',
          '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
          'd4687e39-2848-4958-90b7-264f266ea849',
          '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
          '877f66a5-23c9-4397-9c47-97c9870351c0',
        ],
      }),
    ).rejects.toEqual(
      new Error(
        'cannot report games from multiple matches at once: 7b33907d-8132-4027-beda-489aaad70ef3, ff8158fa-972b-4784-adbb-6258139fc683',
      ),
    )
  })
  it('should not process games of different length than existing match', async () => {
    games.get.mockResolvedValue([
      { game_id: '7ea390d1-2a7c-451a-b4a2-8778a2089096', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
      { game_id: 'd4687e39-2848-4958-90b7-264f266ea849', match_id: '7b33907d-8132-4027-beda-489aaad70ef3' },
    ])
    processMatch.mockResolvedValue({})
    await expect(
      reportGames({
        game_ids: [
          '7ea390d1-2a7c-451a-b4a2-8778a2089096',
          '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
          'd4687e39-2848-4958-90b7-264f266ea849',
          '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
          '877f66a5-23c9-4397-9c47-97c9870351c0',
        ],
      }),
    ).rejects.toEqual(
      new Error(
        'expected same number of games to be reported as games in match: 7b33907d-8132-4027-beda-489aaad70ef3, expected 3 but got 5',
      ),
    )
  })
  it('should resolve if a match is not found for the gameids', async () => {
    games.get.mockResolvedValue([])
    processMatch.mockResolvedValue({})
    const result = await reportGames({
      game_ids: [
        '7ea390d1-2a7c-451a-b4a2-8778a2089096',
        '0ecbfb6e-c1bf-40c9-8403-856a955c9ca6',
        'd4687e39-2848-4958-90b7-264f266ea849',
        '4fb8a123-6b75-49df-918d-ed5ae85dbfaf',
      ],
    })
  })
})

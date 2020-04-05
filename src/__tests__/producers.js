const fs = require('fs')
const path = require('path')

const processMatch = require('../producers')
const replays = JSON.parse(fs.readFileSync(path.join(__dirname, 'replays.json')))

// mocks
const seasons = require('../model/seasons')
jest.mock('../model/seasons')
const members = require('../model/members')
jest.mock('../model/members')
const players = require('../model/players')
jest.mock('../model/players')
const schedule = require('../model/schedule')
jest.mock('../model/schedule')
// this is mocking both teams.get and members.get because jest thinks they're the same function :( it's weird but it works
const createMocks = () => {
  players.get.mockResolvedValue([
    {
      id: '373ff47a-6ac2-4a41-925d-39716aa1231c',
      discord_id: '193136322762899467',
      team_id: '2b7c8fa9-b1fc-4463-ad2e-ed77e6631c58',
      screen_name: 'Tero',
    },
    {
      id: '94d6904c-0076-4547-8d06-52c98ca14b3c',
      discord_id: '347193291219009537',
      team_id: '2b7c8fa9-b1fc-4463-ad2e-ed77e6631c58',
      screen_name: 'IamGatman',
    },
    {
      id: '8875e5f2-b0f0-4ae6-ab42-e43e61b19475',
      discord_id: '215913177035177994',
      team_id: '2b7c8fa9-b1fc-4463-ad2e-ed77e6631c58',
      screen_name: 'Smurf',
    },
    {
      id: '78dacf77-42b2-4be1-b980-bdeb58fb9378',
      discord_id: '191639902100783108',
      team_id: '14c44087-6711-434e-bcfc-199b98800d74',
      screen_name: 'Calster',
    },
    {
      id: '9eb5f497-7ea7-492e-86cb-a7e4c03d3de3',
      discord_id: '369948469986852874',
      team_id: '14c44087-6711-434e-bcfc-199b98800d74',
      screen_name: 'Cheezy',
    },
    {
      id: 'be5c1af1-0beb-45a8-be4d-d5e795212630',
      discord_id: '198638770390564864',
      team_id: '14c44087-6711-434e-bcfc-199b98800d74',
      screen_name: 'Delephant',
    },
    {
      id: '782cd9e8-c5c2-48d4-9421-c44f5e98fefc',
      discord_id: '171031002536214529',
      team_id: 'b59d2f52-7001-4820-a5ef-89f673397bfd',
      screen_name: 'MARKsmanRL',
    },
    {
      id: 'd98ddaf9-305e-4f6b-bd89-49bdf806c22a',
      discord_id: '560642215144194068',
      team_id: 'b59d2f52-7001-4820-a5ef-89f673397bfd',
      screen_name: 'Pace.',
    },
    {
      id: 'ce9355b2-a326-42dc-a719-8c982e403d92',
      discord_id: '312301326841151490',
      team_id: 'b59d2f52-7001-4820-a5ef-89f673397bfd',
      screen_name: 'Lege',
    },
  ])
  members.get.mockResolvedValue([
    {
      id: '78dacf77-42b2-4be1-b980-bdeb58fb9378',
      discord_id: '191639902100783108',
      platform: 'steam',
      platform_id: '76561198059743159',
      screen_name: 'Calster',
    },
    {
      id: 'c892eb60-1cb7-4918-b35a-29f90e6f676d',
      discord_id: '298195039287508992',
      platform: 'steam',
      platform_id: '76561198325466976',
      screen_name: 'ambrosia',
    },
    {
      id: '373ff47a-6ac2-4a41-925d-39716aa1231c',
      discord_id: '193136322762899467',
      platform: 'steam',
      platform_id: '76561198115574246',
      screen_name: 'Tero',
    },
    {
      id: '373ff47a-6ac2-4a41-925d-39716aa1231c',
      discord_id: '193136322762899467',
      platform: 'xbox',
      platform_id: 'YzI5MTA4NjQ3MTQ2MWEwMzQ2N2ZkMTUxMTMxMzQ0YjkyZTdiZWZjZjg5ZTY3Mjc1NDE5NTk1MWJjNmMyZDJjNQ',
      screen_name: 'Tero',
    },
    {
      id: '9eb5f497-7ea7-492e-86cb-a7e4c03d3de3',
      discord_id: '369948469986852874',
      platform: 'steam',
      platform_id: '76561198247336622',
      screen_name: 'Cheezy',
    },
    {
      id: '69d8c005-0afc-4cb1-a035-13485128c095',
      discord_id: '163818869322940418',
      platform: 'steam',
      platform_id: '76561198293474733',
      screen_name: 'Mexi',
    },
    {
      id: '608006d5-8de6-4dcb-9f58-142df5e11922',
      discord_id: '158619040221233152',
      platform: 'steam',
      platform_id: '76561198084814513',
      screen_name: 'Prussia',
    },
    {
      id: 'ce9355b2-a326-42dc-a719-8c982e403d92',
      discord_id: '312301326841151490',
      platform: 'steam',
      platform_id: '76561198397509094',
      screen_name: 'Lege',
    },
    {
      id: '94f9f66d-ee7b-48b0-bbb0-b19b119d50b8',
      discord_id: '148648273811472386',
      platform: 'steam',
      platform_id: '76561198196004874',
      screen_name: 'North*',
    },
    {
      id: '94d6904c-0076-4547-8d06-52c98ca14b3c',
      discord_id: '347193291219009537',
      platform: 'steam',
      platform_id: '76561198828393741',
      screen_name: 'IamGatman',
    },
    {
      id: '94d6904c-0076-4547-8d06-52c98ca14b3c',
      discord_id: '347193291219009537',
      platform: 'xbox',
      platform_id: 'ldkrkYVtYSDA3Q-YzU0OjPOGpOT40ps1KRjF9mXOjzA',
      screen_name: 'IamGatman',
    },
    {
      id: 'be5c1af1-0beb-45a8-be4d-d5e795212630',
      discord_id: '198638770390564864',
      platform: 'steam',
      platform_id: '76561198047988955',
      screen_name: 'Delephant',
    },
    {
      id: 'a9d48457-6794-4ba9-be4d-f91332c6a9bc',
      discord_id: '247435967990988801',
      platform: 'steam',
      platform_id: '76561198304145805',
      screen_name: 'Jives',
    },
    {
      id: '3ef585ea-bafd-4ca8-b137-0e3b08831d67',
      discord_id: '339872932954374145',
      platform: 'steam',
      platform_id: '76561198855702736',
      screen_name: 'Veltri',
    },
    {
      id: 'f33dfd0f-97c0-4caf-9bfe-0424d82ef51a',
      discord_id: '291057124597825537',
      platform: 'steam',
      platform_id: '76561198372477204',
      screen_name: 'cheeriojf',
    },
  ])
}

describe('game stats producer', () => {
  const matchId = '69d14320-5103-4c12-bd5b-7bb10719a1da'
  it('should process game stats', async () => {
    createMocks()
    const { gameStats } = await processMatch(replays, matchId)
    const game = gameStats[0]
    expect(game).toMatchObject({
      game_id: '6903ac8a-d480-4f41-84a0-321ffb5cd17d',
      match_id: '69d14320-5103-4c12-bd5b-7bb10719a1da',
      date_time_played: '2020-03-19T21:35:38Z',
    })
    expect(game).toHaveProperty('date_time_processed')
  })
  it('should process team stats', async () => {
    createMocks()
    const { teamStats } = await processMatch(replays, matchId)
    expect(teamStats).toHaveLength(8)
    expect(teamStats[0]).toMatchObject({
      team_id: '14c44087-6711-434e-bcfc-199b98800d74',
      opponent_team_id: 'b59d2f52-7001-4820-a5ef-89f673397bfd',
      team_color: 'blue',
      match_id: '69d14320-5103-4c12-bd5b-7bb10719a1da',
      match_id_win: '69d14320-5103-4c12-bd5b-7bb10719a1da',
      game_id: '6903ac8a-d480-4f41-84a0-321ffb5cd17d',
      game_id_win: '6903ac8a-d480-4f41-84a0-321ffb5cd17d',
      wins: 1,
      shots: 5,
      opponent_shots: 7,
      goals: 3,
      opponent_goals: 2,
      saves: 5,
      opponent_saves: 1,
      assists: 3,
      opponent_assists: 2,
      ms_played: 351000,
      demos_inflicted: 2,
      demos_taken: 5,
      bpm: 1194,
      avg_amount: 139.37,
      amount_collected: 6608,
      amount_stolen: 1225,
      amount_used_while_supersonic: 797,
      ms_zero_boost: 162580,
      ms_full_boost: 79400,
    })
    /** @todo write test for opposing team */
  })
  it('should process player stats', async () => {
    createMocks()
    const { playerStats } = await processMatch(replays, matchId)
    // a 4-game match will all linked players would have 24, but not all players in test match are linked
    expect(playerStats).toHaveLength(16)
    expect(playerStats[0]).toMatchObject({
      player_id: '78dacf77-42b2-4be1-b980-bdeb58fb9378',
      screen_name: 'Calster',
      team_id: '14c44087-6711-434e-bcfc-199b98800d74',
      team_color: 'blue',
      opponent_team_id: 'b59d2f52-7001-4820-a5ef-89f673397bfd',
      match_id: '69d14320-5103-4c12-bd5b-7bb10719a1da',
      match_id_win: '69d14320-5103-4c12-bd5b-7bb10719a1da',
      game_id: '6903ac8a-d480-4f41-84a0-321ffb5cd17d',
      game_id_win: '6903ac8a-d480-4f41-84a0-321ffb5cd17d',
      wins: 1,
      shots: 2,
      goals: 1,
      saves: 2,
      assists: 1,
      score: 493,
      mvps: 1,
      ms_played: 351728,
      demos_inflicted: 0,
      demos_taken: 2,
      bpm: 416,
      avg_amount: 49.66,
      amount_collected: 2461,
      amount_stolen: 410,
      amount_used_while_supersonic: 212,
      ms_zero_boost: 52950,
      ms_full_boost: 23460,
    })
    expect(playerStats[1]).toMatchObject({
      mvps: 0,
    })
  })
})

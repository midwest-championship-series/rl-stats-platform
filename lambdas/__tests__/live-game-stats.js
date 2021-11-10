const liveStats = require('../live-game-events').handler

const aws = require('../../src/services/aws')
jest.mock('../../src/services/aws')
const rlBot = require('../../src/services/rl-bot')
jest.mock('../../src/services/rl-bot')

const events = [
  {
    data: 'game_round_started_go',
    event: 'game:round_started_go',
    time: 300,
    timestamp: '2021-08-04T23:42:13.674Z',
  },
  {
    data: {
      event_name: 'Shot',
      main_target: { id: 'Casper_3', name: 'Casper', team_num: 0 },
      match_guid: '5160BB9E11EBF5752AEE6FBE6E4F2067',
      secondary_target: { id: '', name: '', team_num: -1 },
      type: 'Shot on Goal',
    },
    event: 'game:statfeed_event',
    time: 250.3824920654297,
    timestamp: '2021-08-04T23:43:05.464Z',
  },
  {
    data: {
      event_name: 'Win',
      main_target: { id: 'Squall_1', name: 'Squall', team_num: 0 },
      match_guid: '5160BB9E11EBF5752AEE6FBE6E4F2067',
      secondary_target: { id: '', name: '', team_num: -1 },
      type: 'Win',
    },
    event: 'game:statfeed_event',
    time: 234.47161865234375,
    timestamp: '2021-08-04T23:43:35.448Z',
  },
]

describe('live-game-stats', () => {
  it('should save the stats to s3', async () => {
    await liveStats({ type: 'LIVE_GAME_EVENTS', detail: { events } })
    expect(aws.s3.uploadJSON).toHaveBeenCalledTimes(1)
    expect(rlBot.sendToChannel).toHaveBeenCalledTimes(1)
    expect(rlBot.sendToChannel.mock.calls[0]).toEqual(['692994579305332806', 'Casper put a :soccer: shot on goal'])
  })
})

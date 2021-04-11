const { handler: index } = require('../index-elastic')

jest.mock('../../src/services/elastic')
const elastic = require('../../src/services/elastic')
jest.mock('../../src/services/aws')
const aws = require('../../src/services/aws')
const stats = {
  player_games: [
    {
      player_name: 'Tero.',
      player_id: '5ec9358f8c0dd900074685c7',
      team_name: 'Hibbing Rangers',
      team_id: '5ec9358e8c0dd900074685c3',
    },
  ],
  team_games: [
    {
      team_name: 'Hibbing Rangers',
      team_id: '5ec9358e8c0dd900074685c3',
    },
  ],
  processedAt: 1618089471185,
  matchId: '5ec935998c0dd900074686c9',
}
aws.s3.get.mockResolvedValue({ Body: JSON.stringify(stats) })

const event = {
  version: '0',
  id: '8560c0eb-6534-c39b-88b7-f7f60aabe7e3',
  'detail-type': 'MATCH_PROCESS_ENDED',
  source: 'rl-stats',
  account: '695296178223',
  time: '2021-04-11T04:07:02Z',
  region: 'us-east-1',
  resources: [],
  detail: {
    match_id: '5ec935998c0dd900074686c9',
    bucket: {
      source: 'rl-stats-produced-stats-dev-us-east-1',
      key: 'match:5ec935998c0dd900074686c9.json',
    },
  },
}

describe('index-elastic', () => {
  it('should index to elasticsearch', async () => {
    elastic.indexDocs.mockResolvedValue({ body: {} })
    elastic.deleteByQuery.mockResolvedValue({ deleted: 4 })
    await index(event)
    expect(elastic.indexDocs).toHaveBeenCalledTimes(2)
    expect(elastic.indexDocs).toHaveBeenLastCalledWith(
      [
        {
          epoch_processed: 1618089471185,
          player_id: '5ec9358f8c0dd900074685c7',
          player_name: 'Tero.',
          team_id: '5ec9358e8c0dd900074685c3',
          team_name: 'Hibbing Rangers',
        },
      ],
      'test_stats_player_games',
      ['player_id', 'game_id_total'],
    )
    expect(aws.eventBridge.emitEvent).toHaveBeenCalledWith({
      type: 'MATCH_ELASTIC_STATS_LOADED',
      detail: { match_id: '5ec935998c0dd900074686c9' },
    })
  })
})

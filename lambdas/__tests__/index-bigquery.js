const { handler: index } = require('../index-bigquery')

jest.mock('../../src/services/bigquery')
const bq = require('../../src/services/bigquery')
jest.mock('../../src/services/aws')
const aws = require('../../src/services/aws')
const stats = {
  playerStats: [
    {
      player_name: 'Tero.',
      player_id: '5ec9358f8c0dd900074685c7',
      team_name: 'Hibbing Rangers',
      team_id: '5ec9358e8c0dd900074685c3',
    },
  ],
  teamStats: [
    {
      team_name: 'Hibbing Rangers',
      team_id: '5ec9358e8c0dd900074685c3',
    },
  ],
  processedAt: 1618089471185,
  matchId: '5ec935998c0dd900074686c9',
}
aws.s3.get.mockResolvedValue({ Body: JSON.stringify(stats) })
bq.load.mockResolvedValue({ errors: [] })
const now = Date.now()
Date.prototype.now = () => now

const event = {
  Records: [
    {
      eventVersion: '2.1',
      eventSource: 'aws:s3',
      awsRegion: 'us-east-1',
      eventTime: '2021-04-10T20:52:26.061Z',
      eventName: 'ObjectCreated:Put',
      userIdentity: {
        principalId: 'AWS:AROA2DYXBXAXQHW4IFK6L:rl-stats-process-match-dev',
      },
      requestParameters: {
        sourceIPAddress: '52.206.204.100',
      },
      responseElements: {
        'x-amz-request-id': 'E5GF99J6NPM3KKK6',
        'x-amz-id-2':
          'Gvz9WiqH48vSba0Q2WvmLY0vwensFdvS60uvQuxhmG0HmHhPLwBayacLwJ4XAW5YS6CGH/M+lvodsEaqzOsYdVJKX8Kal+Qz',
      },
      s3: {
        s3SchemaVersion: '1.0',
        configurationId: 'rl-stats-index-bigquery-dev-68a737133cefb25bff959852b8f04754',
        bucket: {
          name: 'rl-stats-produced-stats-dev-us-east-1',
          ownerIdentity: {
            principalId: 'A206CTAY98T2VV',
          },
          arn: 'arn:aws:s3:::rl-stats-produced-stats-dev-us-east-1',
        },
        object: {
          key: 'match%3A5ec935998c0dd900074686c9.json',
          size: 74436,
          eTag: 'e84bbfab8a2c31596f3a0af45614e1e0',
          sequencer: '00607210103985D643',
        },
      },
    },
  ],
}

describe('index-bigquery', () => {
  it('should index records', async () => {
    await index(event)
    expect(aws.s3.get).toHaveBeenCalledWith(
      'rl-stats-produced-stats-dev-us-east-1',
      'match:5ec935998c0dd900074686c9.json',
    )
    expect(bq.load).toHaveBeenCalledTimes(2)
    expect(bq.load).toHaveBeenLastCalledWith(
      [{ epoch_processed: 1618089471185, team_id: '5ec9358e8c0dd900074685c3', team_name: 'Hibbing Rangers' }],
      'team_games',
    )
    expect(bq.query).toHaveBeenCalledTimes(2)
    expect(bq.query).toHaveBeenLastCalledWith(
      'DELETE',
      'team_games',
      "epoch_processed < 1618089471185 AND match_id = '5ec935998c0dd900074686c9'",
    )
  })
})

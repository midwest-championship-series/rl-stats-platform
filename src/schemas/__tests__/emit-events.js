const validate = require('../emit-events')

describe('emit-events', () => {
  it('should validate an event object', () => {
    const valid = {
      type: 'MATCH_PROCESS_ENDED',
      detail: {
        match_id: '600fac63be0bbe0008ffddcd',
        bucket: {
          source: 'somebucket',
          key: 'filename',
        },
      },
    }
    const result = validate(valid)
    expect(result).toMatchObject(valid)
  })
  it('should throw for unregistered schema', () => {
    const unregistered = {
      type: 'NO_SCHEMA',
    }
    expect(() => validate(unregistered)).toThrowError('no schema match found for event type: NO_SCHEMA')
  })
  it('should throw for invalid schema', () => {
    const invalid = {
      type: 'MATCH_PROCESS_ENDED',
    }
    expect(() => validate(invalid)).toThrowError('"detail" is required')
  })
  describe('process match schemas', () => {
    it('should validate a match reprocess', () => {
      validate({
        type: 'MATCH_REPROCESS',
        detail: {
          collection: 'matches',
          params: { week: 1 },
        },
      })
    })
    it('should validate a process match end', () => {
      validate({
        type: 'MATCH_PROCESS_ENDED',
        detail: {
          match_id: '600fac63be0bbe0008ffddcd',
          bucket: {
            source: 'somebucket',
            key: 'filename',
          },
        },
      })
    })
    it('should validate a process match init event', () => {
      validate({
        type: 'MATCH_PROCESS_INIT',
        detail: {
          report_games: [
            {
              bucket: {
                key: 'ballchasing:b201a81b-3e83-47dc-9c68-5883b43724b5.replay',
                source: 'mock-bucket',
              },
              id: 'b201a81b-3e83-47dc-9c68-5883b43724b5',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:631dddc2-941f-4e63-9fda-f9455495b57e.replay',
                source: 'mock-bucket',
              },
              id: '631dddc2-941f-4e63-9fda-f9455495b57e',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:05b634d3-5df1-4088-b104-cdd5ea404391.replay',
                source: 'mock-bucket',
              },
              id: '05b634d3-5df1-4088-b104-cdd5ea404391',
              upload_source: 'ballchasing',
            },
          ],
          league_id: '5ec9359b8c0dd900074686d3',
          reply_to_channel: '692994579305332806',
        },
      })
      validate({
        type: 'MATCH_PROCESS_INIT',
        detail: {
          report_games: [
            {
              bucket: {
                key: 'ballchasing:b201a81b-3e83-47dc-9c68-5883b43724b5.replay',
                source: 'mock-bucket',
              },
              id: 'b201a81b-3e83-47dc-9c68-5883b43724b5',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:631dddc2-941f-4e63-9fda-f9455495b57e.replay',
                source: 'mock-bucket',
              },
              id: '631dddc2-941f-4e63-9fda-f9455495b57e',
              upload_source: 'ballchasing',
            },
            {
              bucket: {
                key: 'ballchasing:05b634d3-5df1-4088-b104-cdd5ea404391.replay',
                source: 'mock-bucket',
              },
              id: '05b634d3-5df1-4088-b104-cdd5ea404391',
              upload_source: 'ballchasing',
            },
          ],
          match_id: '5ec9359b8c0dd900074686d3',
        },
      })
      validate({
        type: 'MATCH_PROCESS_INIT',
        detail: {
          report_games: [
            {
              report_type: 'MANUAL_REPORT',
              game_number: 3,
              winning_team_id: '5ebc62a9d09245d2a7c62eb3',
              forfeit: true,
            },
          ],
          match_id: '5ec9359b8c0dd900074686d3',
        },
      })
    })
    it('should validate a replays obtained event', () => {
      validate({
        type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
        detail: {
          league_id: '5ec9359b8c0dd900074686d3',
          reply_to_channel: '692994579305332806',
          replays: [
            {
              bucket: {
                key: 'ballchasing:b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e.replay',
                source: 'mock-bucket',
              },
              id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
              upload_source: 'ballchasing',
            },
          ],
        },
      })
    })
    it('should validate a replays parsed event', () => {
      validate({
        type: 'MATCH_PROCESS_REPLAYS_PARSED',
        detail: {
          league_id: '5ec9359b8c0dd900074686d3',
          reply_to_channel: '692994579305332806',
          parsed_replays: [
            {
              bucket: {
                key: 'ballchasing:b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e.replay',
                source: 'mock-bucket',
              },
              id: 'b63a3a3b-6b3d-433a-ab21-8a6c02d6bd8e',
              upload_source: 'ballchasing',
            },
          ],
        },
      })
    })
    it('should validate a bigquery stats load event', () => {
      validate({
        type: 'MATCH_BIGQUERY_STATS_LOADED',
        detail: {
          match_id: '600fac63be0bbe0008ffddcd',
        },
      })
    })
    it('should validate an elastic stats load event', () => {
      validate({
        type: 'MATCH_ELASTIC_STATS_LOADED',
        detail: {
          match_id: '600fac63be0bbe0008ffddcd',
        },
      })
    })
  })
})

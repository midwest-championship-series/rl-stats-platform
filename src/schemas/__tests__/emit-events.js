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
    it('should validate a process match end', () => {
      const end = {
        type: 'MATCH_PROCESS_ENDED',
        detail: {
          match_id: '600fac63be0bbe0008ffddcd',
          bucket: {
            source: 'somebucket',
            key: 'filename',
          },
        },
      }
      validate(end)
    })
    it('should validate a process match init event', () => {
      const event = {
        type: 'MATCH_PROCESS_INIT',
        detail: {
          game_ids: [
            'b201a81b-3e83-47dc-9c68-5883b43724b5',
            '631dddc2-941f-4e63-9fda-f9455495b57e',
            '05b634d3-5df1-4088-b104-cdd5ea404391',
          ],
          league_id: '5ec9359b8c0dd900074686d3',
          reply_to_channel: '692994579305332806',
        },
      }
      validate(event)
    })
    it('should validate a bigquery stats load event', () => {
      const event = {
        type: 'MATCH_BIGQUERY_STATS_LOADED',
        detail: {
          match_id: '600fac63be0bbe0008ffddcd',
        },
      }
      validate(event)
    })
    it('should validate an elastic stats load event', () => {
      const event = {
        type: 'MATCH_ELASTIC_STATS_LOADED',
        detail: {
          match_id: '600fac63be0bbe0008ffddcd',
        },
      }
      validate(event)
    })
  })
})

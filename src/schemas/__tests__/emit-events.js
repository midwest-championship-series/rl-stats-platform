const validate = require('../emit-events')

describe('emit-events', () => {
  it('should validate an event object', () => {
    const valid = {
      type: 'MATCH_PROCESS_ENDED',
      detail: {
        match_id: '1234567890',
        s3_data_url: 'https://s3.com',
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
          match_id: '1234567890',
          s3_data_url: 'https://s3.com',
        },
      }
      validate(end)
    })
  })
})

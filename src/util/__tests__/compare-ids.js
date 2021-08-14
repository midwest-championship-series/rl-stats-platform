const { ObjectId } = require('bson')

const compare = require('../compare-ids')

describe('compare-ids', () => {
  it('should compare two strings', () => {
    expect(compare('hi', 'hello')).toBeFalsy()
    expect(compare('hello', 'hi')).toBeFalsy()
    expect(compare('hello', 'hello')).toBeTruthy()
  })
  it('should compare a string and an ObjectId', () => {
    expect(compare(new ObjectId('6102ff0234129d000872c442'), 'hello')).toBeFalsy()
    expect(compare('hello', new ObjectId('6102ff0234129d000872c442'))).toBeFalsy()
    expect(compare(new ObjectId('6102ff0234129d000872c442'), '6102ff0234129d000872c442')).toBeTruthy()
    expect(compare('6102ff0234129d000872c442', new ObjectId('6102ff0234129d000872c442'))).toBeTruthy()
  })
  it('should compare two ObjectIds', () => {
    expect(compare(new ObjectId('6102ff0234129d000872c442'), new ObjectId('6102ff0234129d000872c445'))).toBeFalsy()
    expect(compare(new ObjectId('6102ff0234129d000872c445'), new ObjectId('6102ff0234129d000872c442'))).toBeFalsy()
    expect(compare(new ObjectId('6102ff0234129d000872c442'), new ObjectId('6102ff0234129d000872c442'))).toBeTruthy()
    expect(compare(new ObjectId('6102ff0234129d000872c442'), new ObjectId('6102ff0234129d000872c442'))).toBeTruthy()
  })
})

const { ObjectId } = require('mongodb')
const idEquals = require('../compare-ids')

describe('mongodb', () => {
  describe('idEquals', () => {
    it('should be true if both ids are equal', () => {
      expect(idEquals(new ObjectId('619c6fbf3637c89ae6b8e9be'), new ObjectId('619c6fbf3637c89ae6b8e9be'))).toBeTruthy()
    })
    it('should be false if both ids are not equal', () => {
      expect(idEquals(new ObjectId('619c6fbf3637c89ae6b8e9bc'), new ObjectId('619c6fbf3637c89ae6b8e9be'))).toBeFalsy()
    })
    it('should be true if an id and a string are equal', () => {
      expect(idEquals(new ObjectId('619c6fbf3637c89ae6b8e9be'), '619c6fbf3637c89ae6b8e9be')).toBeTruthy()
    })
    it('should be false if an id and a string are not equal', () => {
      expect(idEquals(new ObjectId('619c6fbf3637c89ae6b8e9bc'), '619c6fbf3637c89ae6b8e9be')).toBeFalsy()
    })
    it('should be true if a string and an id are equal', () => {
      expect(idEquals('619c6fbf3637c89ae6b8e9be', new ObjectId('619c6fbf3637c89ae6b8e9be'))).toBeTruthy()
    })
    it('should be false if a string and an id are not equal', () => {
      expect(idEquals('619c6fbf3637c89ae6b8e9bc', new ObjectId('619c6fbf3637c89ae6b8e9be'))).toBeFalsy()
    })
    it('should be true if two strings are equal', () => {
      expect(idEquals('619c6fbf3637c89ae6b8e9be', '619c6fbf3637c89ae6b8e9be')).toBeTruthy()
    })
    it('should be false if two strings are not equal', () => {
      expect(idEquals('619c6fbf3637c89ae6b8e9bc', '619c6fbf3637c89ae6b8e9be')).toBeFalsy()
    })
  })
})

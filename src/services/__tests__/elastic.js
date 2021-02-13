const { indexDocs } = require('../elastic')

jest.mock('elasticsearch')
const elastic = require('elasticsearch')
const bulkMock = jest.fn()
elastic.Client = jest.fn().mockImplementation(() => {
  return {
    bulk: bulkMock,
  }
})

describe('elasticsearch', () => {
  describe('indexDocs', () => {
    it('should make a call to index documents', async () => {
      const docs = [{ _id: '12345', title: 'new1' }, { title: 'new2' }]
      await indexDocs(docs, 'stats')
      elastic.Client.mock.instances[0]
      expect(bulkMock).toHaveBeenCalledWith({
        body: [
          { index: { _id: '12345', _index: 'stats' } },
          { _id: '12345', title: 'new1' },
          { index: { _index: 'stats' } },
          { title: 'new2' },
        ],
      })
    })
  })
})

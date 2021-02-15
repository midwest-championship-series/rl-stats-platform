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
      const docs = [
        { title: 'new1', team_id: 'abcdefg', game_id: 'hijklmnop' },
        { title: 'new2', team_id: 'abcdefg', game_id: 'qrstuv' },
      ]
      await indexDocs(docs, 'stats', ['team_id', 'game_id'])
      elastic.Client.mock.instances[0]
      expect(bulkMock).toHaveBeenCalledWith({
        body: [
          { index: { _index: 'stats', _id: 'team_id:abcdefg:game_id:hijklmnop' } },
          { game_id: 'hijklmnop', team_id: 'abcdefg', title: 'new1' },
          { index: { _index: 'stats', _id: 'team_id:abcdefg:game_id:qrstuv' } },
          { game_id: 'qrstuv', team_id: 'abcdefg', title: 'new2' },
        ],
      })
    })
  })
})

const { indexDocs, deleteByQuery } = require('../elastic')

jest.mock('elasticsearch')
const elastic = require('elasticsearch')
const bulkMock = jest.fn()
const deleteByQueryMock = jest.fn()
elastic.Client = jest.fn().mockImplementation(() => {
  return {
    bulk: bulkMock,
    deleteByQuery: deleteByQueryMock,
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
      expect(bulkMock).toHaveBeenCalledWith({
        refresh: true,
        body: [
          { index: { _index: 'stats', _id: 'team_id:abcdefg:game_id:hijklmnop' } },
          { game_id: 'hijklmnop', team_id: 'abcdefg', title: 'new1' },
          { index: { _index: 'stats', _id: 'team_id:abcdefg:game_id:qrstuv' } },
          { game_id: 'qrstuv', team_id: 'abcdefg', title: 'new2' },
        ],
      })
    })
  })
  describe('deleteByProperty', () => {
    it('should delete documents by property', async () => {
      const query = {
        query: {
          terms: {
            match_id: ['5ec935998c0dd900074686c9'],
          },
        },
      }
      await deleteByQuery(query)
      expect(deleteByQueryMock).toHaveBeenCalledWith({ body: query, index: 'test_stats_*', refresh: true })
    })
  })
})

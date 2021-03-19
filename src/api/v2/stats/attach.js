const filterQuery = require('./filter-query')
const rawQuery = require('./raw-query')
const docs = require('./docs')

module.exports = (indexName, schema) => {
  const router = require('express').Router()
  router.get(`/${indexName}`, filterQuery(indexName))
  router.get(`/${indexName}/_docs`, docs(schema))
  router.post(`/${indexName}`, rawQuery(indexName))
  return router
}

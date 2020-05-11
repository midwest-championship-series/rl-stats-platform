const express = require('express')

const populateQuery = (query, populations) => {
  if (populations) {
    populations.forEach(p => {
      query = query.populate(p)
    })
  }
  return query
}

module.exports = model => {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    req.context = await populateQuery(model.find(req.query), req.populate).exec()
    next()
  })

  router.get('/:id', async (req, res, next) => {
    req.context = await populateQuery(model.findById(req.params.id), req.populate).exec()
    next()
  })

  return router
}

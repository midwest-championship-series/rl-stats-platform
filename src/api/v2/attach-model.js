const express = require('express')

const populateQuery = (query, populations) => {
  if (populations) {
    populations.forEach(p => {
      query = query.populate(p)
    })
  }
  return query
}

module.exports = Model => {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    req.context = await populateQuery(Model.find(req.query), req.populate).exec()
    next()
  })

  router.get('/:id', async (req, res, next) => {
    req.context = await populateQuery(Model.findById(req.params.id), req.populate).exec()
    next()
  })

  router.put('/:id', async (req, res, next) => {
    const doc = await Model.findById(req.params.id).exec()
    if (!model) {
      return res.status(404).send()
    }
    for (let property of req.body) {
      doc[property] = req.body[property]
    }
    req.context = await doc.save()
    next()
  })

  router.post('/', async (req, res, next) => {
    req.context = await Model.create(req.body)
    next()
  })

  router.delete('/:id', async (req, res, next) => {
    const { n, deletedCount } = await Model.deleteOne({ _id: req.params.id }).exec()
    if (n > 0 && deletedCount > 0) {
      req.context = { success: true }
    } else {
      res.status(404)
    }
    next()
  })

  return router
}

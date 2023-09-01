const express = require('express')

const docsHandler = require('./docs')
const buildSchema = require('./build-schema')
const stripFunctionParameters = require('../../util/strip-function-parameters')

class InvalidQueryError extends Error {
  constructor(msg) {
    super(msg)
    this.name = 'InvalidQueryError'
  }
}

const buildQuery = (model, params, { limit, skip, sort }) => {
  let query = model.find()
  if (limit) {
    query = query.limit(limit)
  }
  if (skip) {
    query = query.skip(skip)
  }
  if (sort) {
    query = query.sort(sort)
  }
  for (let key in model.schema.query) {
    const functionParameters = stripFunctionParameters(model.schema.query[key])
    const queryHelper = []
    for (let param in params) {
      if (param.startsWith(key)) {
        /** identify all parameters starting with that key and log their values */
        queryHelper.push([`${param.substring(key.length + 1)}`, params[param]])
        /** delete the key from params so they don't pollute the query later */
        delete params[param]
      }
    }
    if (queryHelper.length === 0) continue
    if (queryHelper.length < functionParameters.length) {
      let msg = `Received ${queryHelper.length} parameters for query helper ${key} but expected ${functionParameters.length}. `
      msg += `Parameters received: ${queryHelper
        .map(([helperName]) => {
          return helperName
        })
        .join(', ')}`
      throw new Error(msg)
    }
    query = model.schema.query[key].apply(
      query,
      functionParameters.map((name) => {
        console.log('name', name)
        return queryHelper.find((h) => h[0] === name)[1]
      }),
    )
  }
  if (params.text_search) {
    params.$text = { $search: params.text_search }
    delete params.text_search
  }
  if (params.populate) {
    delete params.populate
  }
  if (params.limit) {
    delete params.limit
  }
  if (params.skip) {
    delete params.skip
  }
  if (params.sort) {
    delete params.sort
  }
  if (params.or) {
    if (typeof params.or === 'string') {
      params.or = [params.or]
    }
    params.or.forEach((p) => {
      const orQuery = {}
      if (!params[p]) {
        throw new InvalidQueryError(`${p} is listed as an 'or' parameter but does not exist in query params`)
      }
      orQuery[p] = params[p]
      query = query.or(orQuery)
      delete params[p]
    })
    delete params.or
  }
  return query.where(params)
}

const populateQuery = (query, populations) => {
  if (populations) {
    populations.forEach((p) => {
      console.info('populating', p)
      const arr = p.split('.')
      if (arr.length === 1) {
        query = query.populate(p)
      } else {
        const pop = {}
        let currentLevel = pop
        arr.forEach((level, i) => {
          currentLevel.path = level
          if (i !== arr.length - 1) {
            currentLevel.populate = {}
            currentLevel = currentLevel.populate
          }
        })
        query.populate(pop)
      }
    })
  }
  return query
}

module.exports = (Model) => {
  const router = express.Router()

  router.get('/_docs', docsHandler(Model))

  router.get('/_schema', (req, res, next) => {
    try {
      res.status(200).send(buildSchema(Model.schema.obj))
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

  router.post('/_aggregate', require('./aggregate')(Model))

  router.get('/', async (req, res, next) => {
    req.context = await populateQuery(
      buildQuery(Model, req.query, { limit: req.limit, skip: req.skip, sort: req.sort }),
      req.populate,
    ).exec()
    next()
  })

  router.get('/:id', async (req, res, next) => {
    const data = await populateQuery(
      buildQuery(Model, { _id: req.params.id }, { limit: req.limit, skip: req.skip, sort: req.sort }),
      req.populate,
    ).exec()
    req.context = data && data.length > 0 ? data[0] : {}
    next()
  })

  router.put('/:id', async (req, res, next) => {
    const doc = await Model.findById(req.params.id).exec()
    if (!doc) {
      return res.status(404).send()
    }
    for (let property in req.body) {
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

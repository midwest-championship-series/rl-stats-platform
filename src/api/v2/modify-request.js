module.exports = (req, res, next) => {
  try {
    const { query } = req
    if (query.populate) {
      if (typeof query.populate === 'string') {
        req.populate = [query.populate]
      } else {
        req.populate = query.populate
      }
      delete req.query.populate
    }
    /** @todo make this work. for some reason it's not deleting the parameters from req.query so I do it later in attach-model when the query is built. */
    if (query.limit) {
      req.limit = parseInt(query.limit)
      delete req.query.limit
    }
    if (query.skip) {
      req.skip = parseInt(query.skip)
      delete req.query.skip
    }
    if (query.sort) {
      req.sort = query.sort
      delete req.query.sort
    }
    if (query.text_search) {
      req.text_search = query.text_search
      delete req.query.text_search
    }
    next()
  } catch (err) {
    next(err)
  }
}

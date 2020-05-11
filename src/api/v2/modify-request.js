module.exports = (req, res, next) => {
  const { query } = req
  if (query.populate) {
    if (typeof query.populate === 'string') {
      req.populate = [query.populate]
    } else {
      req.populate = query.populate
    }
    delete query.populate
  }
  return next()
}

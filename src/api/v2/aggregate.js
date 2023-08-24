const ejson = require('ejson')

module.exports = (Model) => {
  return async (req, res, next) => {
    try {
      if (!req.body.query) return res.status(400).send({ error: 'parameter [query] is required' })
      const query = ejson.parse(JSON.stringify(req.body.query))
      req.context = await Model.aggregate(query)
      next()
    } catch (err) {
      next(err)
    }
  }
}

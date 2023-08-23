const router = require('express').Router()

const v1Handler = async (req, res, next) => {
  const { table } = req.params
  // handle v0 api
  const body = await require('./v1')[req.method.toUpperCase()]({
    table,
    queryStringParameters: req.query,
    body: req.body,
  })
  res.status(200).send(body)
}

router.use(require('../util/header-management'))
router.use('/auth', require('./auth'))
router.get('/v1/:table', v1Handler)
router.put('/v1/:table', v1Handler)
router.use('/v2', require('./v2'))

module.exports = router

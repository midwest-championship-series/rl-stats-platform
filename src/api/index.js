const router = require('express').Router()

const v0Handler = async (req, res, next) => {
  const { table } = req.params
  // handle v0 api
  const body = await require('./v0')[req.method.toUpperCase()]({ table, queryStringParameters: req.query })
  res.status(200).send(body)
}

const v1Handler = async (req, res, next) => {
  const { table } = req.params
  // handle v0 api
  const body = await require('./v1')[req.method.toUpperCase()]({ table, queryStringParameters: req.query })
  res.status(200).send(body)
}

router.get('/api/:table', v0Handler)
router.put('/api/:table', v0Handler)
router.get('/v1/:table', v1Handler)
router.put('/v1/:table', v1Handler)

router.use('/v2', require('./v2'))

module.exports = router

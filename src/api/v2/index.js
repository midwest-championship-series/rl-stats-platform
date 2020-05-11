const router = require('express').Router()

router.get('/', (req, res, next) => {
  return res.status(200).send({ message: 'successful v2' })
})

module.exports = router

const router = require('express').Router()

router.use('/standings', require('./standings'))

module.exports = router

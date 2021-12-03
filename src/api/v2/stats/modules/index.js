const router = require('express').Router()

router.use('/standings', require('./standings'))
router.use('/player-totals', require('./player-totals'))

module.exports = router

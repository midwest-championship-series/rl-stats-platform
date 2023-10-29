const router = require('express').Router()

router.get('/standings', require('./standings'))
router.post('/player-totals', require('./player-totals'))
router.post('/natural-query', require('./natural-query'))

module.exports = router

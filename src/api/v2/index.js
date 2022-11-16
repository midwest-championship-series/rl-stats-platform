const router = require('express').Router()
const override = require('method-override')

const attachModel = require('./attach-model')
const errorHandler = require('./errors')

const { Franchises, Teams, Players, Leagues, Seasons, Matches, Games } = require('../../model/mongodb')

router.use(require('./modify-request'))
router.use('/modules', require('./modules'))
router.use('/events', require('./events'))
router.use('/franchises', attachModel(Franchises))
router.use('/teams', attachModel(Teams))
router.use('/players', attachModel(Players))
router.use('/leagues', attachModel(Leagues))
router.use('/seasons', attachModel(Seasons))
router.use('/seasons/:season_id/standings', require('./standings'))
router.use('/matches', attachModel(Matches))
router.use('/games', attachModel(Games))
router.use('/stats', require('./stats'))
router.use(require('./send-request'))
router.use(override())
router.use(errorHandler)

module.exports = router

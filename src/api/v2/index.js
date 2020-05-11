const router = require('express').Router()
const attachModel = require('./attach-model')
const { model: Leagues } = require('../../model/mongodb/leagues')
const { model: Teams } = require('../../model/mongodb/teams')
const { model: Players } = require('../../model/mongodb/players')

router.use(require('./modify-request'))
router.use('/leagues', attachModel(Leagues))
router.use('/teams', attachModel(Teams))
router.use('/players', attachModel(Players))
router.use(require('./send-request'))

module.exports = router

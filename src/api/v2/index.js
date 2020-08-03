const router = require('express').Router()
const attachModel = require('./attach-model')
const { Model: Teams } = require('../../model/mongodb/teams')
const { Model: Players } = require('../../model/mongodb/players')
const { Model: Leagues } = require('../../model/mongodb/leagues')
const { Model: Seasons } = require('../../model/mongodb/seasons')
const { Model: Matches } = require('../../model/mongodb/matches')
const { Model: Games } = require('../../model/mongodb/games')

router.use(require('./modify-request'))
router.use('/teams', attachModel(Teams))
router.use(
  '/players',
  (req, res, next) => {
    if (req.query.team_id) {
      req.query['team_history.team_id'] = req.query.team_id
      delete req.query.team_id
    }
    next()
  },
  attachModel(Players),
)
router.use('/leagues', attachModel(Leagues))
router.use('/seasons', attachModel(Seasons))
router.use('/seasons/:season_id/standings', require('./standings'))
router.use('/matches', attachModel(Matches))
router.use('/games', attachModel(Games))
router.use(require('./send-request'))

module.exports = router

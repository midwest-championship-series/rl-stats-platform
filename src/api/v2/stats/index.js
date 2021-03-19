const router = require('express').Router()
const attach = require('./attach')
const { player_games, team_games } = require('./../../../schemas')

router.use(attach('player_games', player_games))
router.use(attach('team_games', team_games))

module.exports = router

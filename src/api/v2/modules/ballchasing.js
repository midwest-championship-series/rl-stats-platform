const router = require('express').Router()
const ballchasing = require('../../../services/ballchasing')

router.get('/:gameId', async (req, res, next) => {
  const { gameId } = req.params
  const [ballchasingData] = await ballchasing.getReplayData([gameId])
  req.context = ballchasingData
  next()
})

router.get('/:gameId/player-info', async (req, res, next) => {
  const { gameId } = req.params
  const [ballchasingData] = await ballchasing.getReplayData([gameId])
  const players = ['orange', 'blue'].reduce((result, color) => {
    result.push(...ballchasingData[color].players.map((p) => ({ ...p, color })))
    return result
  }, [])
  req.context = players
  next()
})

module.exports = router

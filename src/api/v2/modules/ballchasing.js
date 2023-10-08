const router = require('express').Router()
const ballchasing = require('../../../services/ballchasing')

router.get('/gameinfo/:gameId', async (req, res, next) => {
  const { gameId } = req.params
  const [ballchasingData] = await ballchasing.getReplayData([gameId])
  req.context = ballchasingData
  next()
})

router.get('/gameinfo/:gameId/player-info', async (req, res, next) => {
  const { gameId } = req.params
  const [ballchasingData] = await ballchasing.getReplayData([gameId])
  const players = ['orange', 'blue'].reduce((result, color) => {
    result.push(...ballchasingData[color].players.map((p) => ({ ...p, color })))
    return result
  }, [])
  req.context = players
  next()
})

router.get('/matchinfo/:groupId', async (req, res, next) => {
  const { groupId } = req.params
  req.context = await ballchasing.getReplaysFromGroup(groupId)
  next()
})

module.exports = router

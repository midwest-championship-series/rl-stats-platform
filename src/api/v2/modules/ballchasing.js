const router = require('express').Router()
const ballchasing = require('../../../services/ballchasing')

router.use('/:gameId/player-info', async (req, res, next) => {
  const { gameId } = req.params
  const [ballchasingData] = await ballchasing.getReplayData([gameId])
  const players = ['orange', 'blue'].reduce((result, color) => {
    result.push(...ballchasingData[color].players.map((p) => ({ ...p, color })))
    return result
  }, [])
  req.context = players
  next()
})

/** @todo figure out how to make this not run at the same time as other /:gameId middleware */
// router.use('/:gameId', async (req, res, next) => {
//   const { gameId } = req.params
//   const [ballchasingData] = await ballchasing.getReplayData([gameId])
//   req.context = ballchasingData
//   next()
// })

module.exports = router

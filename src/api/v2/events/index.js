const { Router } = require('express')
const router = new Router()
const { eventBridge } = require('../../../services/aws')

router.post('/', async (req, res, next) => {
  const { body } = req
  try {
    if (body instanceof Array) {
      req.context = await eventBridge.emitEvents(body)
    } else {
      req.context = await eventBridge.emitEvent(body)
    }
    next()
  } catch (err) {
    err.source = 'event-validation'
    next(err)
  }
})

module.exports = router

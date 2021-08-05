const joi = require('../../util/validator')
const registerSchema = require('./register')

module.exports = [
  registerSchema({
    type: 'LIVE_GAME_EVENTS',
    detail: joi
      .object()
      .keys({
        events: joi.array().items(joi.object().unknown(true)),
      })
      .required(),
  }),
]

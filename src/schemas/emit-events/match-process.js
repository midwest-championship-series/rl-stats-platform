const joi = require('joi')
const registerSchema = require('./register')

module.exports = [
  registerSchema({
    type: 'MATCH_PROCESS_ENDED',
    detail: joi
      .object()
      .keys({
        match_id: joi.string().required(),
        bucket: joi
          .object()
          .keys({
            key: joi.string().required(),
            source: joi.string().required(),
          })
          .required(),
      })
      .required(),
  }),
]

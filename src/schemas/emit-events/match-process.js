const joi = require('joi')
const registerSchema = require('./register')

module.exports = [
  registerSchema({
    type: 'MATCH_PROCESS_ENDED',
    detail: joi
      .object()
      .keys({
        match_id: joi.string(),
        s3_data_url: joi.string(),
      })
      .required(),
  }),
]

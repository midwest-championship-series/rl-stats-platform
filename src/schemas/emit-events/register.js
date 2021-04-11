const joi = require('joi')

module.exports = ({ type, detail }) => {
  return {
    type,
    schema: joi.object().keys({
      type,
      detail,
    }),
  }
}

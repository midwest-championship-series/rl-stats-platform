const joi = require('../../util/validator')

module.exports = ({ type, detail }) => {
  return {
    type,
    schema: joi.object().keys({
      type,
      detail,
    }),
  }
}

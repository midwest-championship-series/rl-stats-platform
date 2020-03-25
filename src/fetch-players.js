const { members } = require('./model')

module.exports = criteria => {
  return members.get({ criteria, json: true })
}

const ballchasing = require('./services/ballchasing')

module.exports = (query) => {
  return ballchasing.getReplays(query)
}
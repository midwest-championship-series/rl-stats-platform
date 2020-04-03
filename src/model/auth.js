const Table = require('../services/dynamodb')
const schema = {
  id: 'S',
  api_key: 'S',
  permissions: 'L',
}
module.exports = new Table('auth', schema)

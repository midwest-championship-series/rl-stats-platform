const Table = require('../services/aws').dynamodb
module.exports = new Table('auth')

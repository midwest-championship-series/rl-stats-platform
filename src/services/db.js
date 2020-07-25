const { ssm } = require('./aws')

const Sequelize = require('sequelize')

const models = {}
const connection = {}

module.exports = async () => {
  console.log('trying ssm')
  const {
    value: { port, host, username, password },
  } = await ssm.getSecret(process.env.DB_SECRET_NAME)
  const sequelize = new Sequelize('mnrl', username, password, {
    dialect: 'mysql',
    host,
    port,
  })
  await sequelize.authenticate()
  console.log('authenticated')
  await sequelize.sync()
}

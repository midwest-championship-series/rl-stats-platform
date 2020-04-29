const { ssm } = require('./aws')

const Sequelize = require('sequelize')
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: 'mysql',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
// })

const models = {}
const connection = {}

module.exports = async () => {
  console.log('trying ssm')
  const {
    value: { port, host, username, password },
  } = await ssm.getSecret(process.env.DB_SECRET_NAME)
  console.log('value', value)
  const sequelize = new Sequelize('mnrl', username, password, {
    dialect: 'mysql',
    host,
    port,
  })
  await sequelize.authenticate()
  console.log('authenticated')
  await sequelize.sync()
}
// module.exports = async () => {
//   if (connection.isConnected) {
//     console.log('=> Using existing connection.')
//     return Models
//   }
//   const {
//     value: { port, host, username, password },
//   } = await ssm.getSecret(process.env.DB_SECRET_NAME)
//   await sequelize.sync()
//   await sequelize.authenticate()
//   connection.isConnected = true
//   console.log('=> Created a new connection.')
//   return Models
// }

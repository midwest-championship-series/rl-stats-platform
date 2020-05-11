const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

// const apis = require('../src/api')
/**
 * @todo re-implement warmer
 */
const warmerIntercept = require('../src/util/warmer-intercept')

app.use(bodyParser.json())
app.get('/healthcheck', (req, res, next) => {
  return res.status(200).send({ status: 'ok' })
})
app.use('/', require('../src/api'))

const handler = serverless(app)
// const handler = async event => {
//   if (warmerIntercept(event)) return
//   return serverless(app)
// }
// const handler = async event => {
//   if (warmerIntercept(event)) return
//   if (event.body) {
//     event.body = JSON.parse(event.body)
//   }

//   const {
//     requestContext: { httpMethod },
//     pathParameters: { version, table },
//     queryStringParameters,
//     body,
//   } = event
//   try {
//     const api = apis[version || 'v0']
//     const tables = api.tables
//     if (!tables[table]) {
//       return { statusCode: 404 }
//     }
//     const data = await api[httpMethod]({ table, body, queryStringParameters })
//     return {
//       statusCode: 200,
//       body: JSON.stringify(data),
//     }
//   } catch (err) {
//     console.error(err)
//     return {
//       statusCode: 500,
//       body: JSON.stringify(err),
//     }
//   }
// }

module.exports = { handler }

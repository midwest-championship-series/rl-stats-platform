const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())
app.get('/healthcheck', (req, res, next) => {
  return res.status(200).send({ status: 'ok' })
})
app.use('/', require('../src/api'))

// or as a promise
const api = serverless(app)
const handler = async (event, context) => {
  const warmerIntercept = require('../src/util/warmer-intercept')
  if (warmerIntercept(event)) return
  const result = await api(event, context)
  return result
}

module.exports = { handler }

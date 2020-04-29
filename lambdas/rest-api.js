const api = require('../src/rest-api')
const warmerIntercept = require('../src/util/warmer-intercept')
const tables = api.tables

const handler = async event => {
  if (warmerIntercept(event)) return
  if (event.body) {
    event.body = JSON.parse(event.body)
  }

  const {
    requestContext: { httpMethod },
    pathParameters: { table },
    queryStringParameters,
    body,
  } = event
  try {
    if (!tables[table]) {
      return { statusCode: 404 }
    }
    const data = await api[httpMethod]({ table, body, queryStringParameters })
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    }
  }
}

module.exports = { handler }

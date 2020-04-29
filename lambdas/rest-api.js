const apis = require('../src/api')
const warmerIntercept = require('../src/util/warmer-intercept')

const handler = async event => {
  if (warmerIntercept(event)) return
  if (event.body) {
    event.body = JSON.parse(event.body)
  }

  const {
    requestContext: { httpMethod },
    pathParameters: { version, table },
    queryStringParameters,
    body,
  } = event
  try {
    const api = apis[version || 'v0']
    const tables = api.tables
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

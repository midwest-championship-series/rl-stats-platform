const api = require('../src/rest-api')
const tables = api.tables

const handler = async event => {
  // console.log(event.requestContext.authorizer)
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

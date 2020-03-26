const tables = require('../src/model')

const api = {
  GET: table => tables[table].get({ json: true }),
  PUT: (table, body) => {
    return tables[table].add({ data: body[table], json: true })
  },
}

const handler = async (event, context) => {
  const {
    requestContext: { httpMethod },
    pathParameters: { table },
    body,
  } = event
  try {
    const data = await api[httpMethod](table, JSON.parse(body))
    console.log('data', data)
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

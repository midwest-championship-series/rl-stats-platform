const tables = {
  teams: require('../src/model/teams'),
  players: require('../src/model/players'),
  games: require('../src/model/games'),
  members: require('../src/model/members'),
  schedule: require('../src/model/schedule'),
  'match-games': require('../src/model/match-games'),
}

const api = {
  GET: ({ table, queryStringParameters }) => tables[table].get({ criteria: queryStringParameters, json: true }),
  PUT: ({ table, body }) => {
    return tables[table].add({ data: body[table], json: true })
  },
}

const handler = async (event, context) => {
  try {
    event.body = JSON.parse(event.body)
  } catch (err) {
    // some requests won't have bodies and that's ok
  }
  const {
    requestContext: { httpMethod },
    pathParameters: { table },
    queryStringParameters,
    body,
  } = event
  try {
    if (!Object.keys(tables).includes(table)) {
      return { statusCode: 404 }
    }
    // const data = await api[httpMethod](table, JSON.parse(body), queryStringParameters)
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

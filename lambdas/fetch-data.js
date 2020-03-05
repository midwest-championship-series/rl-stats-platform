const tables = require('../src/model')

const handler = async (event, context) => {
  const { table } = event.pathParameters
  try {
    const data = await tables[table].get()
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = { handler }

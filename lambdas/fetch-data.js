const tables = require('../src/model')

const handler = async (event, context) => {
  const { table } = event.pathParameters
  try {
    const data = await tables[table].get()
    return data
  } catch (err) {
    console.error(err)
  }
}

module.exports = { handler }

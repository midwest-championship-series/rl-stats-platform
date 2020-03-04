const {list} = require('../src/model/team')

const handler = async () => {
  try {
    return list()
  } catch(err) {
    console.error(err)
  }
}

module.exports = { handler }
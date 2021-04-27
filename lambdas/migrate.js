require('../src/model/mongodb')
const { Games } = require('../src/model/mongodb')

const handler = async () => {
  const { nModified } = await Games.updateMany(
    {},
    {
      $unset: {
        ballchasing_id: '',
      },
    },
  )
  console.log(`updated ${nModified} games`)
}

module.exports = { handler }

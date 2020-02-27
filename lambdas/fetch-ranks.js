const fetchRanks = require('../src/fetch-ranks')

const handler = async (event, context) => {
  const { platform, platformId } = event.pathParameters
  const ranks = await fetchRanks(platform, platformId)
  return {
    statusCode: 200,
    body: JSON.stringify(ranks)
  }
}

module.exports = { handler }
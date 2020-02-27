const axios = require('axios')

export default async (platform, platformId) => {
  const webpage = await axios.get(`https://rocketleague.tracker.network/profile/${platform}/${platformId}`)
  return cheerio.load(webpage.data)
}
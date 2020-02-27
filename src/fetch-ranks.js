const cheerio = require('cheerio')
const axios = require('axios')

const fetchData = async (platform, platformId) => {
  const webpage = await axios.get(`https://rocketleague.tracker.network/profile/${platform}/${platformId}`)
  return cheerio.load(webpage.data)
}

module.exports = async (platform, platformId) => {
  const $ = await fetchData(platform, platformId)
  const ranks = []
  $('.season-table').each((index, table) => {
    $(table).find($('table:last-child tr')).each((index, row) => {
      const playlist = $(row).find($('td:nth-child(2)')).contents().first().text().trim()
      const mmr = parseInt($(row).find($('td:nth-child(4)')).contents().first().text().trim().replace(/,/g, ''))
      if (playlist) {
        ranks.push({ rank: playlist, mmr })
      }
    })
  })

  return {
    player: {
      platform,
      id: platformId
    },
    ranks
  }
}
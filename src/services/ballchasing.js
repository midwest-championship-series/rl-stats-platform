const axios = require('axios').default
const API_KEY = process.env.BALLCHASING_KEY
const BASE_URL = 'https://ballchasing.com/api'
const bluebird = require('bluebird')

const wait = async seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000)
  })
}

const getReplays = async (params = {}) => {
  if (params.game_ids) {
    return bluebird.mapSeries(params.game_ids, async id => {
      const { data } = await axios.get(`${BASE_URL}/replays/${id}`, { params, headers: { Authorization: API_KEY } })
      await wait(1) // workaround for api rate limit which is currently 2rps
      return data
    })
  } else {
    const { data } = await axios.get(`${BASE_URL}/replays`, { params, headers: { Authorization: API_KEY } })
    return data
  }
}

module.exports = {
  getReplays,
}

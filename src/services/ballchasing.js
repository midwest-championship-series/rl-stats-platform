const stream = require('stream')
const axios = require('axios').default
const API_KEY = process.env.BALLCHASING_KEY
const BASE_URL = 'https://ballchasing.com/api'
const bluebird = require('bluebird')
const wait = require('../util/wait')

const getReplayData = async (params = {}) => {
  if (params.game_ids) {
    return bluebird.mapSeries(params.game_ids, async (id) => {
      const { data } = await axios.get(`${BASE_URL}/replays/${id}`, { params, headers: { Authorization: API_KEY } })
      await wait(1) // workaround for api rate limit which is currently 2rps
      return data
    })
  } else {
    const { data } = await axios.get(`${BASE_URL}/replays`, { params, headers: { Authorization: API_KEY } })
    return data
  }
}

const getReplayStream = async (id) => {
  const response = await axios.get(`${BASE_URL}/replays/${id}/file`, {
    responseType: 'stream',
    headers: { Authorization: API_KEY },
  })
  return response.data
}

module.exports = {
  getReplayData,
  getReplayStream,
}

const axios = require('axios').default
const API_KEY = process.env.BALLCHASING_KEY
const BASE_URL = 'https://ballchasing.com/api'

const getReplays = async (params = {}) => {
  const { data } = await axios.get(`${BASE_URL}/replays`, { params, headers: { Authorization: API_KEY } })
  return data
}

module.exports = {
  getReplays,
}

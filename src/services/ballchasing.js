const axios = require('axios').default
const API_KEY = process.env.BALLCHASING_KEY
const BASE_URL = 'https://ballchasing.com/api'
const bluebird = require('bluebird')
const wait = require('../util/wait')
const { UnRecoverableError } = require('../util/errors')

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

const getReplayIdsFromGroup = async (groupId) => {
  const MAX_GAMES = 9
  const {
    data: { list, count },
  } = await axios.get(`${BASE_URL}/replays?group=${groupId}`, { headers: { Authorization: API_KEY } })
  if (count > MAX_GAMES) {
    throw new UnRecoverableError(
      'BALLCHASING_MAX_GAMES_REPORT',
      `expected replay group to contain less than ${MAX_GAMES} replays but got ${count}`,
    )
  }
  return list.map((g) => g.id)
}

module.exports = {
  getReplayData,
  getReplayIdsFromGroup,
  getReplayStream,
}

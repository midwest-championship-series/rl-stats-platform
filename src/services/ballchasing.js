const axios = require('axios').default
const API_KEY = process.env.BALLCHASING_KEY
const BASE_URL = 'https://ballchasing.com/api'
const bluebird = require('bluebird')
const wait = require('../util/wait')
const { UnRecoverableError } = require('../util/errors')

const callForReplayData = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/replays/${id}`, { headers: { Authorization: API_KEY } })
    return response.data
  } catch (err) {
    if (err.response && err.response.status === 429) {
      console.info('debouncing ballchasing request')
      await wait(1)
      return callForReplayData(id)
    }
    throw err
  }
}

const getReplayData = async (gameIds) => {
  return bluebird.mapSeries(gameIds, async (id) => {
    return callForReplayData(id)
  })
}

const getReplayStream = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/replays/${id}/file`, {
      responseType: 'stream',
      headers: { Authorization: API_KEY },
    })
    return response.data
  } catch (err) {
    if (err.response && err.response.status === 429) {
      console.info('debouncing ballchasing request')
      await wait(1)
      return getReplayStream(id)
    }
    throw err
  }
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

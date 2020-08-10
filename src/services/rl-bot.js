const axios = require('axios').default

const botUrl = process.env.MNRL_BOT_URL

const reportError = error => {
  return axios.post([botUrl, 'api', 'v1', 'errors'].join('/'), { error: error.stack || error.message || error })
}

const sendToChannel = (channelId, message) => {
  return axios.post([botUrl, 'api', 'v1', 'channels', channelId].join('/'), { message })
}

module.exports = {
  reportError,
  sendToChannel,
}

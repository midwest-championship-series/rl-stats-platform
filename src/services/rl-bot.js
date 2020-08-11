const axios = require('axios').default

const botUrl = process.env.MNRL_BOT_URL
const errorChannelId = process.env.ERROR_CHANNEL_ID

const reportError = error => {
  return sendToChannel(errorChannelId, error.stack || error.message || error)
}

const sendToChannel = (channelId, message) => {
  return axios.post([botUrl, 'api', 'v1', 'channels', channelId].join('/'), {
    message: `${process.env.SERVERLESS_STAGE}:\n${message}`,
  })
}

module.exports = {
  reportError,
  sendToChannel,
}

const axios = require('axios').default

const botUrl = process.env.MNRL_BOT_URL
const errorChannelId = process.env.ERROR_CHANNEL_ID

const reportError = async (error, context, copyToChannel) => {
  const message = `context:\n${context}\n${error.stack || error.message || error}`
  await sendToChannel(errorChannelId, message)
  if (copyToChannel) {
    await sendToChannel(copyToChannel, error.message)
  }
}

const sendToChannel = (channelId, message) => {
  const stageMsg = process.env.SERVERLESS_STAGE !== 'prod' ? `${process.env.SERVERLESS_STAGE}:\n` : ''
  return axios.post([botUrl, 'api', 'v1', 'channels', channelId].join('/'), {
    message: `${stageMsg}${message}`,
  })
}

const sendEmbedToChannel = (channelId, embed) => {
  return axios.post([botUrl, 'api', 'v1', 'channels', channelId].join('/'), { embed })
}

module.exports = {
  reportError,
  sendEmbedToChannel,
  sendToChannel,
}

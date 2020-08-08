const axios = require('axios').default

const botUrl = process.env.MNRL_BOT_URL

const reportError = error => {
  return axios.post([botUrl, 'api', 'v1', 'errors'].join('/'), { error: error.stack || error.message || error })
}

module.exports = {
  reportError,
}

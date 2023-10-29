const axios = require('axios').default

const baseUrl = 'https://api.openai.com/v1/chat/completions'

const sendChat = async (messages) => {
  return axios.post(
    baseUrl,
    {
      model: 'gpt-4',
      messages,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
    },
  )
}

module.exports = {
  sendChat,
}

const { SecretsManager: Client } = require('aws-sdk')

const client = new Client()

const getSecret = name => {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: name }, (err, data) => {
      if (err) return reject(err)
      if ('SecretString' in data) {
        data.value = JSON.parse(data.SecretString)
      } else {
        let buff = new Buffer(data.SecretBinary, 'base64')
        data.value = buff.toString('ascii')
      }
      return resolve(data)
    })
  })
}

module.exports = { getSecret }

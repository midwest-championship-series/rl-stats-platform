const fs = require('fs')
if (fs.existsSync('.google.json')) return // don't bother doing anything if the file exists

var AWS = require('aws-sdk'),
  region = 'us-east-1',
  secretName = 'google_vision_credentials',
  secret

var client = new AWS.SecretsManager({
  region: region,
})

client.getSecretValue({ SecretId: secretName }, function (err, data) {
  if (err) {
    throw new Error(`${err.code}: ${err.message}`)
  }
  secret = JSON.parse(JSON.parse(data.SecretString).GOOGLE_APPLICATION_CREDENTIALS)
  fs.writeFileSync('.google.json', JSON.stringify(secret, null, 2))
})

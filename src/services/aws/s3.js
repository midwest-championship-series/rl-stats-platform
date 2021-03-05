const { S3: Client } = require('aws-sdk')
const s3 = new Client({ apiVersion: '2006-03-01' })
const fs = require('fs')

const uploadJSON = (bucket, fileName, content) => {
  const defaults = {
    acl: 'private',
  }
  // only stringify if not already a string
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  const opts = {
    ...defaults,
    Bucket: bucket,
    Key: fileName,
    ContentType: 'application/json',
    Body: Buffer.from(content).toString('utf8'),
  }
  return s3.upload(opts).promise()
}

const get = (bucket, fileName) => {
  const options = {
    Bucket: bucket,
    Key: fileName,
  }
  return s3.getObject(options).promise()
}

const writeToFile = (key, source, writePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(writePath)
    getObject({ Key: key, Bucket: source })
      .createReadStream()
      .pipe(file)
      .on('error', err => reject(err))
      .on('close', () => resolve())
  })
}

module.exports = {
  uploadJSON,
  get,
  writeToFile,
}

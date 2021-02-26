const { S3: Client } = require('aws-sdk')
const s3 = new Client({ apiVersion: '2006-03-01' })

function uploadJSON(bucket, fileName, content) {
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
    ACL: acl,
    ContentType: 'application/json',
    Body: Buffer.from(content).toString('utf8'),
  }
  return s3.upload(opts).promise()
}

module.exports = {
  uploadJSON,
}

const getS3Location = (record) => {
  const source = record.s3.bucket.name
  // got the following line from: https://github.com/serverless/examples/blob/master/aws-node-s3-file-replicator/handler.js#L32
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
  return { source, key }
}

module.exports = {
  getS3Location,
}

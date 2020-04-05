const { SQS: Client } = require('aws-sdk')
const { chunk } = require('lodash')

const SQS = new Client({ apiVersion: '2012-11-05' })

const sendMessage = (queueUrl, body) => {
  const MessageBody = typeof body === 'string' ? body : JSON.stringify(body)
  const params = {
    QueueUrl: queueUrl,
    MessageBody,
  }
  return SQS.sendMessage(params).promise()
}

const sendMessageBatch = async (queue, messages, batchSize) => {
  if (!batchSize) batchSize = 10
  const messageGroups = chunk(
    messages.map((msg, i) => ({
      Id: i + '',
      MessageBody: typeof msg === 'string' ? msg : JSON.stringify(msg),
    })),
    batchSize,
  )
  for (let Entries of messageGroups) {
    const params = {
      QueueUrl: queue,
      Entries,
    }
    await SQS.sendMessageBatch(params).promise()
  }
}

module.exports = {
  sendMessage,
  sendMessageBatch,
}

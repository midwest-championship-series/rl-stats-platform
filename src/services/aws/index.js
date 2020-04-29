const AWS = require('aws-sdk')

/** this is the default config for AWS which will be adopted by any service, unless overridden when service is initialized */
AWS.config.update({ region: process.env.SERVERLESS_REGION })

module.exports = {
  sqs: require('./sqs'),
  dynamodb: require('./dynamodb'),
  ssm: require('./ssm'),
  aurora: require('./aurora'),
}

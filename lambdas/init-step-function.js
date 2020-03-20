// import * as AWS from 'aws-sdk'
const AWS = require('aws-sdk')

const stepfunctions = new AWS.StepFunctions()

const handler = async () => {
  try {
    await stepfunctions
      .startExecution({
        stateMachineArn: process.env.MATCH_STATE_MACHINE_ARN,
        input: JSON.stringify({}),
      })
      .promise()
  } catch (err) {
    console.error(err)
  }
}

module.exports = { handler }

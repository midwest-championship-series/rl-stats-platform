const { DynamoDB } = require('aws-sdk')

let instance

const getDb = () => {
  if (instance) return instance
  return new DynamoDB.DocumentClient({ region: process.env.SERVERLESS_REGION })
}

class Table {
  constructor(name) {
    this.name = `${name}-table-${process.env.SERVERLESS_STAGE}`
  }
  get({ criteria }) {
    const params = {
      Key: criteria,
      TableName: this.name,
    }
    return new Promise((resolve, reject) => {
      getDb().get(params, (err, data) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(data.Item)
        }
      })
    })
  }
}

module.exports = Table

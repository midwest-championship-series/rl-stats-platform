const { DynamoDB } = require('aws-sdk')

let instance

const getDb = () => {
  if (instance) return instance
  return new DynamoDB({ region: process.env.SERVERLESS_REGION })
}

class Table {
  constructor(name, schema) {
    this.name = `${name}-table-${process.env.SERVERLESS_STAGE}`
    this.schema = schema
  }
  reduceItem(item) {
    return Object.keys(item).reduce((result, key) => {
      result[key] = item[key][this.schema[key]]
      return result
    }, {})
  }
  get({ criteria }) {
    const params = {
      Key: {},
      TableName: this.name,
    }
    for (let key in criteria) {
      console.log('setting key', key)
      params.Key[key] = { [this.schema[key]]: criteria[key] }
    }
    return new Promise((resolve, reject) => {
      getDb().getItem(params, (err, data) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(this.reduceItem(data.Item))
        }
      })
    })
  }
}

module.exports = Table

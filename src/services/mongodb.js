const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const connStr = `mongodb+srv://mnrl_stats:${process.env.MONGODB_PASSWORD}@mnrl-7nmqy.mongodb.net/mnrl`

mongoose.Promise = Promise

let connectionConfigured = false

const setup = () => {
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
  mongoose.connection.once('open', () => console.log('Connected to Mongo!'))

  // when something interrupts the process, disconnect from mongodb
  process.on('SIGINT', () => {
    mongoose.disconnect(err => {
      process.exit(err ? 1 : 0)
    })
  })
}

const connect = () => {
  if (!connectionConfigured) {
    setup()
    connectionConfigured = true
  }

  if (mongoose.connection.readyState !== 1) {
    console.log('wiring up the database for ' + process.env.SERVERLESS_STAGE)
    mongoose.connect(connStr, {
      socketTimeoutMS: 120000,
      useNewUrlParser: true,
      retryWrites: true,
    })
  }
  return mongoose
}

const createModel = (modelName, schemaJson, decorator) => {
  connect()
  if (mongoose.models[modelName]) return mongoose.models[modelName]
  const schema = new mongoose.Schema(schemaJson, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  })
  schema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })
  if (typeof decorator === 'function') {
    decorator(schema)
  }
  return mongoose.model(modelName, schema)
}

module.exports = createModel

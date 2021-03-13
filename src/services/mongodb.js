const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const connStr = `mongodb+srv://mnrl_stats:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/mnrl`

mongoose.Promise = Promise

mongoose.connectionConfigured = false
mongoose.connecting = false

const setup = () => {
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
  mongoose.connection.once('open', () => {
    console.log('Connected to Mongo!')
    mongoose.connecting = false
  })

  // when something interrupts the process, disconnect from mongodb
  process.on('SIGINT', () => {
    mongoose.disconnect(err => {
      process.exit(err ? 1 : 0)
    })
  })
}

const connect = () => {
  if (!mongoose.connectionConfigured) {
    console.info('configuring mongodb connection')
    setup()
    mongoose.connectionConfigured = true
  }

  if (!mongoose.connecting && mongoose.connection.readyState !== 1) {
    mongoose.connecting = true
    console.info('wiring up the database for ' + process.env.SERVERLESS_STAGE)
    mongoose.connect(connStr, {
      socketTimeoutMS: 120000,
      useNewUrlParser: true,
      retryWrites: true,
      useUnifiedTopology: true,
    })
  }
  return mongoose
}

const createModel = (modelName, schemaJson, decorator) => {
  connect()
  if (mongoose.models[modelName]) return mongoose.models[modelName]
  const schema = new mongoose.Schema(schemaJson, {
    id: false,
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

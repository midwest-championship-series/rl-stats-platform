const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const connStr = `mongodb+srv://mnrl_stats:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/mnrl`

mongoose.Promise = Promise

mongoose.connectionConfigured = false
mongoose.connecting = false

const setup = () => {
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
  mongoose.connection.once('open', () => {
    console.info('Connected to Mongo!')
    mongoose.connecting = false
  })
}

const connect = (hardRefresh, cb) => {
  if (hardRefresh === true || (!mongoose.connecting && mongoose.connection.readyState !== 1)) {
    if (hardRefresh === true) {
      mongoose.connection.once('open', cb)
      console.info('hard refreshing connection')
    }
    if (!mongoose.connectionConfigured) {
      console.info('configuring mongodb connection')
      setup()
      mongoose.connectionConfigured = true
    }
    mongoose.connecting = true
    console.info('wiring up the database for ' + process.env.SERVERLESS_STAGE)
    mongoose.connect(connStr, {
      socketTimeoutMS: 120000,
      useNewUrlParser: true,
      retryWrites: true,
      useUnifiedTopology: true,
    })
  }
}

const transform = (doc, ret) => {
  delete ret.__v
}

const createModel = (modelName, schemaJson, decorator) => {
  connect()
  if (mongoose.models[modelName]) return mongoose.models[modelName]
  const schema = new mongoose.Schema(schemaJson, {
    id: false,
    toObject: {
      transform,
      virtuals: true,
    },
    toJSON: {
      transform,
      virtuals: true,
    },
  })
  /** add indexes https://stackoverflow.com/questions/24714166/full-text-search-with-weight-in-mongoose */
  const indexes = Object.entries(schema.obj).reduce((result, [key, value]) => {
    if (value.index) {
      result[key] = value.index
    }
    return result
  }, {})
  schema.index(indexes)
  schema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })
  if (typeof decorator === 'function') {
    decorator(schema)
  }
  return mongoose.model(modelName, schema)
}

module.exports = { createModel, connect }

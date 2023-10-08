const mongoose = require('mongoose')
const MONGO_URI = `mongodb+srv://mnrl_stats:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/mnrl`
mongoose.Promise = Promise

let mongooseConnection

const connect = async () => {
  // If mongooseConnection is defined and we're connected or connecting, return it
  if (mongooseConnection && (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
    return mongooseConnection
  }

  // Set up connection events only once
  if (!mongoose.connectionConfigured) {
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose default connection disconnected')
      mongooseConnection = null // Clear the reference to force a reconnect on next invocation
    })
    mongoose.connectionConfigured = true
  }

  // Connect to MongoDB
  mongooseConnection = await mongoose.connect(MONGO_URI, {
    socketTimeoutMS: 20000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  return mongooseConnection
}

const transform = (doc, ret) => {
  delete ret.__v
}

const createModel = (modelName, schemaJson, decorator) => {
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

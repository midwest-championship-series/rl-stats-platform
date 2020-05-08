const mongoose = require('mongoose')

const connStr = `mongodb+srv://mnrl_stats:${process.env.MONGODB_PASSWORD}@mnrl-7nmqy.mongodb.net/mnrl`

mongoose.Promise = Promise

module.exports = async () => {
  console.log('wiring up the database for ' + process.env.SERVERLESS_STAGE)

  mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
  mongoose.connection.once('open', function() {
    console.log('Connected to Mongo!')
  })

  // when something interrupts the process, disconnect from mongodb
  process.on('SIGINT', () => {
    mongoose.disconnect(err => {
      process.exit(err ? 1 : 0)
    })
  })

  if (mongoose.connection.readyState !== 'connected') {
    await mongoose.connect(connStr, {
      socketTimeoutMS: 120000,
      useNewUrlParser: true,
      retryWrites: true,
    })
  }
  return mongoose
}

const AWS = require('aws-sdk')
const credentials = new AWS.SharedIniFileCredentials({ profile: 'rl-stats' })
AWS.config.credentials = credentials
const bb = require('bluebird')
const path = require('path')
const axios = require('axios').default
require('dotenv').config()
const { s3, eventBridge } = require('../src/services/aws')
const { gzipObject } = require('../src/util/gzip')

const apiKey = process.env.RL_STATS_API_KEY
const outName = path.join(__dirname, '..', 'lambdas', '__tests__', 'games.json.gz')
const bucket = 'rl-stats-producer-event-stats-dev-us-east-1'
const files = [
  'ballchasing:3ff70d9e-078f-47fd-901b-5b92a1aea2d3.json',
  'ballchasing:7a462c90-ad57-4ce9-a73e-0a49652d3824.json',
  'ballchasing:a1dcfeff-eba5-4880-9b25-137f5fe83d33.json',
  'ballchasing:f02e4f07-4e8c-43b1-9397-e1ecba5284a0.json',
]

const fetchData = () => {
  return bb.mapSeries(files, (file) => {
    return s3.get(bucket, file).then(({ Body }) => JSON.parse(Body))
  })
}

try {
  fetchData().then((replays) => {
    return gzipObject(outName, replays)
  })
} catch (err) {
  console.error(err)
}

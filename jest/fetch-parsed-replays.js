const AWS = require('aws-sdk')
const credentials = new AWS.SharedIniFileCredentials({ profile: 'rl-stats' })
AWS.config.credentials = credentials
const bb = require('bluebird')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { s3, eventBridge } = require('../src/services/aws')
const { gzipObject } = require('../src/util/gzip')

const outPath = path.join(__dirname, '..', 'lambdas', '__tests__')
const bucket = 'rl-stats-producer-event-stats-dev-us-east-1'
const files = [
  'ballchasing:b8135479-b364-41d0-a78a-7a49ed468521.json',
  'ballchasing:984bd5a4-4a3e-4e2f-b520-47a5bdf8388c.json',
  'ballchasing:7b30993d-bc1e-4c7c-81c5-6ed226888dc8.json',
  'ballchasing:5abd5cb5-e760-45da-8df2-ba0356cf778f.json',
  'ballchasing:5229c01b-9229-4821-86cc-59171b541b70.json',
]

const fetchData = () => {
  return bb.mapSeries(files, (file) => {
    return s3.get(bucket, file).then(({ Body }) => JSON.parse(Body))
  })
}

try {
  fetchData().then((replays) => {
    fs.writeFileSync(path.join(outPath, 'example-game.json'), JSON.stringify(replays[0], null, 2))
    return gzipObject(path.join(outPath, 'games.json.gz'), replays)
  })
} catch (err) {
  console.error(err)
}

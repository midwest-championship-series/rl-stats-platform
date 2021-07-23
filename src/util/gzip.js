const fs = require('fs')
const zlib = require('zlib')

const gzipObject = (location, data) => {
  return new Promise((resolve, reject) => {
    zlib.gzip(JSON.stringify(data), (err, buffer) => {
      if (err) return reject(err)
      return resolve(buffer)
    })
  }).then((buffer) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(location, buffer, () => {
        return resolve()
      })
    })
  })
}

const gunzipObject = (location) => {
  return new Promise((resolve, reject) => {
    fs.readFile(location, (err, buffer) => {
      if (err) return reject(err)
      return resolve(buffer)
    })
  }).then((buffer) => {
    return new Promise((resolve, reject) => {
      zlib.gunzip(buffer, (err, data) => {
        if (err) return reject(err)
        return resolve(JSON.parse(data.toString()))
      })
    })
  })
}

module.exports = { gzipObject, gunzipObject }

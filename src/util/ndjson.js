const fs = require('fs')

module.exports = (path, data) => {
  return new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(path)
    outStream.on('error', err => {
      return reject(err)
    })
    outStream.on('finish', () => {
      return resolve()
    })
    for (let chunk of data) {
      outStream.write(`${JSON.stringify(chunk)}\n`)
    }
    outStream.close()
  })
}

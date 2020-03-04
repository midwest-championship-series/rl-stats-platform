const { GoogleSpreadsheet } = require('google-spreadsheet')

const path = require('path')

const connect = async () => {
  const doc = new GoogleSpreadsheet(process.env.STAT_SHEET_ID)
  await doc.useServiceAccountAuth(require(path.join(__dirname, '..', '..', '.google.creds.json')))
  await doc.loadInfo()

  return doc
}

const getSheet = async id => {
  const doc = await connect()
  return doc.sheetsById[id]
}

module.exports = {
  connect,
  getSheet,
}

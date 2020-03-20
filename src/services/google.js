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

class Table {
  constructor(name, sheetId) {
    this.name = name
    this.sheetId = sheetId
    this.sheet = undefined
  }

  async getSheet() {
    if (!this.sheet) {
      this.sheet = await getSheet(this.sheetId)
    }
    return this.sheet
  }

  async get(criteria = {}, options = {}) {
    const sheet = await this.getSheet()
    const rows = await sheet.getRows()
    return rows
      .filter(r => {
        return Object.keys(criteria).every(p => r[p] === criteria[p])
      })
      .map(r => (options.json ? r._rawData : r))
  }

  async add(rows) {
    const sheet = await this.getSheet()
    return sheet.addRows(rows)
  }
}

const tables = {}

const registerModel = (name, sheetId) => {
  tables[name] = new Table(name, sheetId)
}

module.exports = {
  registerModel,
  tables,
}

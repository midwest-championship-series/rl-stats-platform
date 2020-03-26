const { GoogleSpreadsheet } = require('google-spreadsheet')

const path = require('path')

const connect = async spreadsheetId => {
  const doc = new GoogleSpreadsheet(spreadsheetId)
  await doc.useServiceAccountAuth(require(path.join(__dirname, '..', '..', '.google.creds.json')))
  await doc.loadInfo()

  return doc
}

const getSheet = async (spreadsheetId, sheetId) => {
  const doc = await connect(spreadsheetId)
  return doc.sheetsById[sheetId]
}

const rowToJSON = (headerValues, rowData) => {
  return headerValues.reduce((memo, column, i) => {
    return { ...memo, [column]: rowData[i] }
  }, {})
}

class Table {
  constructor(name, spreadsheetId, sheetId) {
    this.name = name
    this.spreadsheetId = spreadsheetId
    this.sheetId = sheetId
    this.sheet = undefined
  }

  async getSheet() {
    if (!this.sheet) {
      this.sheet = await getSheet(this.spreadsheetId, this.sheetId)
    }
    return this.sheet
  }

  async get({ criteria, json } = {}) {
    if (!criteria) criteria = {}
    const sheet = await this.getSheet()
    const rows = await sheet.getRows()
    return rows
      .filter(r => Object.keys(criteria).every(p => r[p] === criteria[p]))
      .map(r => (json ? rowToJSON(sheet.headerValues, r._rawData) : r))
  }

  async add({ data, json }) {
    const sheet = await this.getSheet()
    const rows = await sheet.addRows(data)
    return rows.map(r => (json ? rowToJSON(sheet.headerValues, r._rawData) : r))
  }
}

const tables = {}

const registerModel = (name, tableRegistry) => {
  tables[name] = new Table(name, tableRegistry.spreadsheetId, tableRegistry[name])
}

module.exports = {
  registerModel,
  tables,
}

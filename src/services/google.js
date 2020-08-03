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

const rowToJSON = row => {
  return row._sheet.headerValues.reduce((memo, column, i) => {
    return { ...memo, [column]: row._rawData[i] }
  }, {})
}

class Table {
  constructor(name, spreadsheetId, sheetId, keys) {
    this.name = name
    this.spreadsheetId = spreadsheetId
    this.sheetId = sheetId
    this.keys = keys || []
    this.sheet = undefined
    this.populations = undefined
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
    return rows.filter(r => Object.keys(criteria).every(p => r[p] === criteria[p])).map(r => (json ? rowToJSON(r) : r))
  }

  async add({ data, json }) {
    const sheet = await this.getSheet()
    const rows = await sheet.addRows(data)
    return rows.map(r => (json ? rowToJSON(r) : r))
  }

  async upsert({ data }) {
    const sheet = await this.getSheet()
    const rows = await sheet.getRows()
    const { newRows, updateRows } = data.reduce(
      (result, d) => {
        const updateRows = rows.filter(r => this.keys.every(key => r[key] === d[key]))
        if (updateRows.length === 0) {
          result.newRows = result.newRows.concat(d)
        } else {
          updateRows.forEach(r => {
            Object.keys(d).forEach(key => (r[key] = d[key]))
          })
          result.updateRows = result.updateRows.concat(updateRows)
        }
        return result
      },
      { newRows: [], updateRows: [] },
    )
    const promises = []
    if (newRows.length > 0) promises.push(sheet.addRows(newRows))
    if (updateRows.length > 0) updateRows.forEach(r => promises.push(r.save()))
    await Promise.all(promises)
  }

  async populate(data, populate) {
    if (!this.populations) return data
    for (let popName of populate) {
      // validate that we can handle the population
      const { table, localField, foreignField, as } = this.populations.find(p => p.table === popName)
      if (!table) throw new Error(`no population on table ${this.name} for ${popName}`)
      const results = await table.get()
    }
  }

  addPopulation(pop) {
    if (!this.populations) this.populations = []
    this.populations.push(pop)
  }
}

module.exports = Table

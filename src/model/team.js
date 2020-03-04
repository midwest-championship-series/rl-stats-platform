const { getSheet } = require('../services/google')

const SHEET_ID = '1167027768'

const columns = ['mncs_id', 'name']

const getData = row => columns.reduce((memo, val) => ({ ...memo, [val]: row[val] }), {})

const list = async () => {
  const sheet = await getSheet(SHEET_ID)
  const rows = await sheet.getRows()
  return rows.map(r => getData(r))
}

module.exports = { list }

const { team_games, player_games } = require('../src/schemas')
const { bigquery, dataSetId } = require('../src/services/bigquery')
const types = require('../src/schemas/types')

const createSchema = (name, columns) => {
  return {
    name,
    schema: columns
      .map(col => {
        return `${col.name}:${col.type.default}`
      })
      .join(','),
    columns,
  }
}

const tableSchemas = [createSchema('player_games', player_games), createSchema('team_games', team_games)]

const ensureDataset = async () => {
  const [sets] = await bigquery.getDatasets()
  let set = sets.find(s => s.id === dataSetId)
  if (!set) {
    console.info(`creating dataset: ${dataSetId}`)
    set = (await bigquery.createDataset(dataSetId))[0]
  }
  return set
}

const ensureTable = async ({ name, schema, columns }, dataset, tables) => {
  let table = tables.find(t => t.id === name)
  if (!table) {
    console.info('creating table')
    await dataset.createTable(name, { schema })
  } else {
    const [tableInfo] = await table.getMetadata()
    const columnDiff = columns.filter(({ name }) => !tableInfo.schema.fields.find(f => name === f.name))
    if (columnDiff.length > 0) {
      let query = `ALTER TABLE ${table.id} `
      query += columnDiff
        .reduce((result, item) => {
          result.push(`ADD COLUMN ${item.name} ${item.type.DDL ? item.type.DDL : item.type.default}`)
          return result
        }, [])
        .join(', ')
      console.info(query)
      table
        .createQueryStream(query)
        .on('error', console.error)
        .on('data', row => {
          console.log('row', row)
        })
        .on('end', () => console.log('ended!'))
    }
  }
}

const handler = async () => {
  const set = await ensureDataset()
  const [tables] = await set.getTables()
  for (let schema of tableSchemas) {
    await ensureTable(schema, set, tables)
  }
}

module.exports = { handler }

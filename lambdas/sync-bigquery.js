const { team_games, player_games } = require('../src/schemas')
const { bigquery, dataSetId, createTableName } = require('../src/services/bigquery')

const createSchema = (name, columns) => {
  return {
    name,
    schema: columns
      .map((col) => {
        return `${col.name}:${col.type.default}`
      })
      .join(','),
    columns,
  }
}

const tableSchemas = [createSchema('player_games', player_games), createSchema('team_games', team_games)]
const viewSchemas = [
  {
    name: 'player_games_dedup',
    view: `SELECT
    x.*
    FROM(
        SELECT o.*,ROW_NUMBER() OVER(PARTITION BY game_id_total,player_id ORDER BY epoch_processed DESC) rownum
        FROM ${createTableName('player_games')} o
        --WHERE game_id_total = 'match:5f2c60fa398c1700080a94b6:game:1' AND team_id = '5f2c5517754b2f00087df298'
    ) x
    WHERE x.rownum = 1`,
  },
  {
    name: 'team_games_dedup',
    view: `SELECT
    x.*
    FROM(
        SELECT o.*,ROW_NUMBER() OVER(PARTITION BY game_id_total,team_id ORDER BY epoch_processed DESC) rownum
        FROM ${createTableName('team_games')} o
        --WHERE game_id_total = 'match:5f2c60fa398c1700080a94b6:game:1' AND team_id = '5f2c5517754b2f00087df298'
    ) x
    WHERE x.rownum = 1`,
  },
  {
    name: 'match_results',
    view: `SELECT league_name,season_name,team_name,week,league_id,season_id,team_id,match_id,opponent_team_id,ROW_NUMBER() OVER(PARTITION BY league_id,season_id,team_id ORDER BY match_id) match_number
    ,COUNT(game_id_win_total)game_wins
    ,COUNT(CASE WHEN wins = 0 THEN game_id_total ELSE NULL END)game_losses
    ,CASE WHEN COUNT(game_id_win_total) > COUNT(CASE WHEN wins = 0 THEN game_id_total ELSE NULL END) THEN 'Win' ELSE 'Loss' END match_result
    ,CASE WHEN COUNT(game_id_win_total) > COUNT(CASE WHEN wins = 0 THEN game_id_total ELSE NULL END) THEN team_id ELSE opponent_team_id END team_id_win
    ,CASE WHEN COUNT(game_id_win_total) < COUNT(CASE WHEN wins = 0 THEN game_id_total ELSE NULL END) THEN team_id ELSE opponent_team_id END team_id_loss
    FROM ${createTableName('team_games')} 
    --WHERE league_name = 'clmn' and season_name = '4'
    GROUP BY league_name,season_name,team_name,week,league_id,season_id,team_id,match_id,opponent_team_id
    ORDER BY league_name,season_name,team_name,week`,
  },
]

const ensureDataset = async () => {
  const [sets] = await bigquery.getDatasets()
  let set = sets.find((s) => s.id === dataSetId)
  if (!set) {
    console.info(`creating dataset: ${dataSetId}`)
    set = (await bigquery.createDataset(dataSetId))[0]
  }
  return set
}

const ensureTable = async ({ name, schema, columns }, dataset, tables) => {
  let table = tables.find((t) => t.id === name)
  if (!table) {
    console.info('creating table')
    await dataset.createTable(name, { schema })
  } else {
    const [tableInfo] = await table.getMetadata()
    const columnDiff = columns.filter(({ name }) => !tableInfo.schema.fields.find((f) => name === f.name))
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
        .on('data', (row) => {})
        .on('end', () => console.info('end query stream'))
    }
  }
}

const ensureView = async ({ name, view }, dataset, tables) => {
  let table = tables.find((t) => t.id === name)
  if (!table) {
    console.info('creating table')
    await dataset.createTable(name, { view })
  }
}

const handler = async () => {
  const set = await ensureDataset()
  const [tables] = await set.getTables()
  for (let schema of tableSchemas) {
    await ensureTable(schema, set, tables)
  }
  for (let schema of viewSchemas) {
    await ensureView(schema, set, tables)
  }
}

module.exports = { handler }

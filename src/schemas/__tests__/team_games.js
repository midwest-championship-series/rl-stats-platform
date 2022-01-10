const { team_games } = require('..')

describe('team_games context', () => {
  const findSchemaElement = (name) => team_games.find((item) => item.name === name)
  it.only('should create player game context', () => {
    expect(findSchemaElement('game_id_total')).toMatchObject({
      name: 'game_id_total',
      skipOpponent: true,
      type: {
        default: 'string',
      },
    })
  })
})

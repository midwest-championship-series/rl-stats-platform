class Games {
  constructor(game) {
    this.save = jest.fn()
  }
}

module.exports = {
  Players: {
    create: jest.fn(),
    find: jest.fn(),
    onTeams: jest.fn(),
  },
  Teams: {
    find: jest.fn(),
  },
  Leagues: {
    findById: jest.fn(),
  },
  Matches: {
    findById: jest.fn(),
  },
  Games,
}

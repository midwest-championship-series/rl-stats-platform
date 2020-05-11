module.exports = () => {
  if (process.env.SERVERLESS_STAGE === 'prod') {
    return {
      MNCS: {
        spreadsheetId: process.env.MNCS_STAT_SHEET_ID,
        teams: '1167027768',
        players: '494574480',
        games: '628902249',
        schedule: '1647203076',
        teamGames: '966495728',
        playerGames: '1992851802',
        leagues: '2141101954',
      },
      MNRL: {
        spreadsheetId: process.env.MNRL_SHEET_ID,
        members: '427844088',
      },
    }
  } else {
    return {
      MNCS: {
        spreadsheetId: process.env.MNCS_STAT_SHEET_ID,
        teams: '1167027768',
        players: '494574480',
        games: '628902249',
        schedule: '1647203076',
        teamGames: '966495728',
        playerGames: '1992851802',
        leagues: '1266408426',
      },
      MNRL: {
        spreadsheetId: process.env.MNRL_SHEET_ID,
        members: '427844088',
      },
    }
  }
}

module.exports = () => {
  if (process.env.SERVERLESS_STAGE === 'prod') {
    return {
      MNCS: {
        spreadsheetId: process.env.MNCS_STAT_SHEET_ID,
        teamGames: '966495728',
        playerGames: '1992851802',
      },
    }
  } else {
    return {
      MNCS: {
        spreadsheetId: process.env.MNCS_STAT_SHEET_ID,
        teamGames: '966495728',
        playerGames: '1992851802',
      },
    }
  }
}

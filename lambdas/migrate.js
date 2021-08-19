const fs = require('fs')
const path = require('path')
const { Matches, Leagues, Seasons } = require('../src/model/mongodb')

const handler = async () => {
  const leagues = await Leagues.find()
  for (let league of leagues) {
    league.default_timezone = 'America/Chicago'
    await league.save()
  }
}

module.exports = { handler }

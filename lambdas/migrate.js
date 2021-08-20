const fs = require('fs')
const path = require('path')
const { Matches, Leagues, Seasons } = require('../src/model/mongodb')

const handler = async () => {
  const [league] = await Leagues.find({ name: 'nsi' }).populate({
    path: 'seasons',
    populate: {
      path: 'matches',
      populate: {
        path: 'games',
      },
    },
  })
  for (let season of league.seasons) {
    for (let match of season.matches) {
      for (let game of match.games) {
        console.log('deleting game', game._id)
        await game.remove()
      }
      console.log('deleting match', match._id)
      await match.remove()
    }
    console.log('deleting season', season._id)
    await season.remove()
  }
  console.log('deleting league', league._id)
  await league.remove()
}

module.exports = { handler }

const fs = require('fs')
const path = require('path')
const { Leagues, Matches, Seasons, Games } = require('../src/model/mongodb')

const deleteOrphans = async (baseModel, subModel, propName) => {
  const baseDocs = await baseModel.find()
  const orphans = await subModel.find({
    _id: {
      $nin: baseDocs.reduce((result, doc) => {
        result.push(...doc[propName])
        return result
      }, []),
    },
  })

  for (let orphan of orphans) {
    console.log(`deleting orphan ${subModel.collection.name}`, orphan._id)
    await orphan.remove()
  }
}

const handler = async () => {
  await deleteOrphans(Matches, Games, 'game_ids')
  await deleteOrphans(Seasons, Matches, 'match_ids')
  await deleteOrphans(Leagues, Seasons, 'season_ids')
  console.log('finished')
}

module.exports = { handler }

const router = require('express').Router()

router.use('/ballchasing', require('./ballchasing'))

const { Players } = require('../../../model/mongodb')
const stripFunctionParameters = require('../../../util/strip-function-parameters')

router.get('/player-teams', async (req, res) => {
  // try {
  //     const players = await Players.find().on_teams(['5ec9358e8c0dd900074685c3'], new Date())
  //     res.status(200).send({players})
  // } catch (err) {
  //     console.error(err)
  //     res.status(500).send({error: err.message})
  // }
  console.log('query', Players.schema.query)

  res.status(200).send({
    query: Object.entries(Players.schema.query),
    stuff: Players.schema.query.on_teams.toString(),
    stripped: stripFunctionParameters(Players.schema.query.on_teams),
  })
})

module.exports = router

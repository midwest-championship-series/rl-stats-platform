const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const schema = {
  name: { type: String, required: true },
  discord_id: { type: String, required: true, unique: true },
  urls: {
    type: [
      {
        name: String,
        url: String,
      },
    ],
  },
}

const Model = createModel('Franchise', schema, (schema) => {
  schema.path('urls').validate(function (val) {
    const allNames = val.map(({ name }) => name)
    const uniqueNames = [...new Set(allNames)]
    return allNames.length === uniqueNames.length
  }, 'expected `{PATH}` to contain only unique url names')
  schema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'franchise_id',
  })
})

module.exports = { Model }

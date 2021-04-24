const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  name: { type: String, required: true },
  current_season_id: { type: Schema.Types.ObjectId },
  current_week: { type: String },
  season_ids: [{ type: Schema.Types.ObjectId }],
  command_channel_ids: [{ type: String, unique: true }],
  report_channel_ids: [{ type: String, required: true }],
  urls: {
    type: [
      {
        name: String,
        url: String,
      },
    ],
  },
}

const Model = createModel('League', schema, (schema) => {
  schema.path('urls').validate(function (val) {
    const allNames = val.map(({ name }) => name)
    const uniqueNames = [...new Set(allNames)]
    return allNames.length === uniqueNames.length
  }, 'expected `{PATH}` to contain only unique url names')
  schema.virtual('seasons', {
    ref: 'Season',
    localField: 'season_ids',
    foreignField: '_id',
  })
  schema.virtual('current_season', {
    ref: 'Season',
    localField: 'current_season_id',
    foreignField: '_id',
    justOne: true,
  })
})

module.exports = { Model }

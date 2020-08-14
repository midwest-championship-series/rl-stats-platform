const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  name: { type: String, required: true },
  current_season_id: { type: Schema.Types.ObjectId },
  current_week: { type: String },
  season_ids: [{ type: Schema.Types.ObjectId }],
  command_channel_ids: [{ type: String, unique: true }],
}

const Model = createModel('League', schema, schema => {
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

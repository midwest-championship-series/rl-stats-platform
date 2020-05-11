const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  old_id: { type: String, required: true },
  name: { type: String },
  league_id: { type: Schema.Types.ObjectId },
  old_league_id: { type: String, required: true },
  league: { type: String }, // should go away in favor of league_id
  discord_id: { type: String },
  hex_color: { type: String },
}

const Model = createModel('Team', schema)

module.exports = {
  get: ({ criteria }) => Model.find(criteria).exec(),
  add: ({ data }) =>
    Promise.all(
      data.map(d => Model.findOneAndUpdate({ old_id: d.old_id }, { $set: d }, { new: true, upsert: true }).exec()),
    ),
  model: Model,
}

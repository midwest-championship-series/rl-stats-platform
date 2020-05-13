const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  old_id: { type: String, required: true },
  discord_id: { type: String },
  team_id: { type: Schema.Types.ObjectId },
  old_team_id: { type: String },
  screen_name: { type: String },
  league_id: { type: Schema.Types.ObjectId },
  old_league_id: { type: String },
  accounts: {
    type: [
      {
        platform: { type: String },
        platform_id: { type: String },
        screen_name: { type: String },
      },
    ],
    default: [],
  },
}

const Model = createModel('Player', schema, schema => {
  schema.set('toJSON', {
    ...schema.toJSON,
    transform: function(doc, ret) {
      delete ret.accounts
    },
  })
})

module.exports = {
  get: ({ criteria }) => Model.find(criteria).exec(),
  add: ({ data }) =>
    Promise.all(
      data.map(d =>
        Model.findOneAndUpdate(
          { old_id: d.old_id },
          { $set: d },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    ),
  Model,
}

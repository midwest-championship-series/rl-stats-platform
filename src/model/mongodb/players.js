const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  discord_id: { type: String, unique: true },
  team_history: {
    type: [
      {
        team_id: { type: Schema.Types.ObjectId, required: true },
        date_joined: { type: Date, required: true, default: Date.now },
        date_left: Date,
      },
    ],
    default: [],
  },
  screen_name: { type: String },
  league_id: { type: Schema.Types.ObjectId },
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
  /** @deprecated all the below properties are deprecated 8/3/2020 */
  old_id: { type: String },
  old_league_id: { type: String },
  team_id: { type: Schema.Types.ObjectId },
  old_team_id: { type: String },
}

const Model = createModel('Player', schema, schema => {
  schema.set('toJSON', {
    ...schema.toJSON,
    transform: function(doc, ret) {
      /** @todo remove ret.accounts */
      if (ret.team_history && ret.team_history[0]) {
        ret.team_id = ret.team_history[0].team_id
      }
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
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
        ).exec(),
      ),
    ),
  Model,
}

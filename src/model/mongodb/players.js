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
  avatar: { type: String }, // url with discord avatar url, to which a ?size=128 parameter can be added with desired size
  screen_name: { type: String },
  accounts: {
    type: [
      {
        platform: { type: String },
        platform_id: { type: String },
      },
    ],
    default: [],
  },
  permissions: [{ type: String }],
}

const Model = createModel('Player', schema)

module.exports = { Model }

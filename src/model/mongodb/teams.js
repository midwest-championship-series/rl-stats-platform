const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const schema = {
  name: { type: String, index: 'text', default_display_text: true },
  hex_color: { type: String },
  tier_name: { type: String },
  vars: {
    type: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    default: [],
  },
  avatar: { type: String, default_display_image: true },
  franchise_id: { type: Schema.Types.ObjectId },
}

const Model = createModel('Team', schema, (schema) => {
  schema.virtual('seasons', {
    ref: 'Season',
    localField: '_id',
    foreignField: 'team_ids',
  })
  schema.virtual('players', {
    ref: 'Player',
    localField: '_id',
    foreignField: 'team_history.team_id',
  })
})

module.exports = { Model }

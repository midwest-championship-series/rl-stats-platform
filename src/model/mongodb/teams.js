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

const Model = createModel('Team', schema)

module.exports = { Model }

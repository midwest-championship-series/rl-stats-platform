const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const schema = {
  name: { type: String },
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
  avatar: { type: String },
  franchise_id: { type: Schema.Types.ObjectId },
}

const Model = createModel('Team', schema)

module.exports = { Model }

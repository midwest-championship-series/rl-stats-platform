const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const schema = {
  name: { type: String },
  discord_id: { type: String },
  hex_color: { type: String },
  colors: {
    home_primary: { type: String },
    home_secondary: { type: String },
    away_primary: { type: String },
    away_secondary: { type: String },
  },
  avatar: { type: String },
  franchise_id: { type: Schema.Types.ObjectId },
}

const Model = createModel('Team', schema)

module.exports = { Model }

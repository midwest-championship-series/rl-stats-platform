const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  name: { type: String },
  discord_id: { type: String },
  hex_color: { type: String },
  avatar: { type: String },
}

const Model = createModel('Team', schema)

module.exports = { Model }

const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  name: { type: String },
  discord_id: { type: String },
  hex_color: { type: String },
  /** @deprecated all the below properties are deprecated 8/3/2020 */
  league_id: { type: Schema.Types.ObjectId },
  old_id: { type: String },
  old_league_id: { type: String },
}

const Model = createModel('Team', schema, schema => {
  schema.set('toJSON', {
    ...schema.toJSON,
    transform: function(doc, ret) {
      ret.league = 'mncs'
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

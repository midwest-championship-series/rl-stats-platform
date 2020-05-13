const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const Model = createModel(
  'Season',
  {
    name: { type: String, required: true },
    season_type: { type: String, required: true },
    match_ids: [{ type: Schema.Types.ObjectId, required: true }],
  },
  schema => {
    schema.virtual('matches', {
      ref: 'Match',
      localField: 'match_ids',
      foreignField: '_id',
    })
  },
)

module.exports = {
  get: ({ criteria }) => Model.find(criteria).exec(),
  add: ({ data }) =>
    Promise.all(
      data.map(d =>
        Model.findOneAndUpdate(
          { name: d.name, season_type: d.season_type },
          { $set: d },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    ),
  Model,
}

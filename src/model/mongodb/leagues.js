const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  name: { type: String, required: true },
  current_season: { type: String },
  current_season_id: { type: Schema.Types.ObjectId },
  current_week: { type: String },
  season_ids: [{ type: Schema.Types.ObjectId }],
  /** @deprecated all the below properties are deprecated 8/3/2020 */
  old_id: { type: String },
}

const Model = createModel('League', schema, schema => {
  schema.virtual('seasons', {
    ref: 'Season',
    localField: 'season_ids',
    foreignField: '_id',
  })
  /** named this way due to current_season already being a property - will remove current_season in the future and rename this virtual */
  schema.virtual('current_season_object', {
    ref: 'Season',
    localField: 'current_season_id',
    foreignField: '_id',
    justOne: true,
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

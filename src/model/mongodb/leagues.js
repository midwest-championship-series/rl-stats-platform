const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  name: { type: String, required: true },
  current_season: { type: String },
  current_week: { type: String },
  season_ids: [{ type: Schema.Types.ObjectId }],
  old_id: { type: String },
  team_ids: [{ type: Schema.Types.ObjectId, required: true }],
  player_ids: [{ type: Schema.Types.ObjectId, required: true }],
}

const Model = createModel('League', schema, schema => {
  schema.virtual('players', {
    ref: 'Player',
    localField: 'player_ids',
    foreignField: '_id',
  })
  schema.virtual('teams', {
    ref: 'Team',
    localField: 'team_ids',
    foreignField: '_id',
  })
  schema.virtual('seasons', {
    ref: 'Season',
    localField: 'season_ids',
    foreignField: '_id',
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
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    ),
  Model,
}

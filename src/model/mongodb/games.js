const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const Model = createModel(
  'Game',
  {
    ballchasing_id: { type: String, required: true },
    winning_team_id: { type: Schema.Types.ObjectId },
    date_time_played: { type: Date },
    date_time_processed: { type: Date },
  },
  (schema) => {
    schema.virtual('match', {
      ref: 'Match',
      localField: '_id',
      foreignField: 'game_ids',
      justOne: true,
    })
  },
)

module.exports = { Model }

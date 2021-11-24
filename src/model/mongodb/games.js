const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const Model = createModel(
  'Game',
  {
    ballchasing_id: { type: String },
    rl_game_id: { type: String },
    // where we got the replay from
    replay_origin: {
      type: {
        source: { type: String, required: true },
        // unique identifier used in combination with source to identify resource
        key: { type: String, required: true },
      },
    },
    // where we store the replay internally, s3 at the moment
    replay_stored: {
      type: {
        source: { type: String, required: true },
        key: { type: String, required: true },
      },
    },
    report_type: { type: String },
    forfeit_team_id: { type: Schema.Types.ObjectId },
    winning_team_id: { type: Schema.Types.ObjectId },
    date_time_played: { type: Date },
    date_time_processed: { type: Date },
    game_restarted: { type: Boolean },
    raw_data: { type: Schema.Types.Mixed }, // does not actually get stored on save
  },
  (schema) => {
    schema.virtual('match', {
      ref: 'Match',
      localField: '_id',
      foreignField: 'game_ids',
      justOne: true,
    })
    schema.pre('save', function () {
      this.raw_data = undefined
    })
  },
)

module.exports = { Model }

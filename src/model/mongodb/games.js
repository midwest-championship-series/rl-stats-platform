const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const Model = createModel('Game', {
  old_id: { type: String, required: true },
  ballchasing_id: { type: String, required: true },
  old_match_id: { type: String, required: true },
  status: { type: String, default: 'open' },
  /** @todo add winner_ids to games */
  // winner_id: { type: Schema.Types.ObjectId },
  date_time_played: { type: Date },
  date_time_processed: { type: Date },
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

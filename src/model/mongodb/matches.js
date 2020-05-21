const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const Model = createModel(
  'Match',
  {
    old_id: { type: String, required: true },
    team_ids: [{ type: Schema.Types.ObjectId, required: true }],
    old_team_ids: [{ type: String, required: true }],
    week: { type: String, required: true },
    status: { type: String, default: 'open' },
    game_ids: [{ type: Schema.Types.ObjectId, required: true }],
    best_of: { type: Number },
  },
  schema => {
    schema.virtual('games', {
      ref: 'Game',
      localField: 'game_ids',
      foreignField: '_id',
    })
    schema.virtual('season', {
      ref: 'Season',
      localField: '_id',
      foreignField: 'match_ids',
      justOne: true,
    })
    schema.pre('validate', function() {
      const minGames = Math.ceil(this.best_of / 2)
      if (this.game_ids && this.game_ids.length > 0) {
        // validate that best_of has been met
        if (this.games.length < minGames) {
          this.invalidate(
            'games',
            `number of games (${this.games.length}) must be greater than the minumum to win a best of ${this.best_of} series`,
            this.games.length,
          )
        } else {
          this.status = 'closed'
        }
      }
    })
  },
)

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

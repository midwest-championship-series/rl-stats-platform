const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const Game = createModel('Game', {
  old_id: { type: String, required: true },
  status: { type: String, default: 'open' },
  winner_id: { type: Schema.Types.ObjectId },
  date_time_played: { type: Date },
  date_time_processed: { type: Date },
})

const Match = createModel(
  'Match',
  {
    old_id: { type: String, required: true },
    team_ids: [{ type: Schema.Types.ObjectId }],
    old_team_ids: [{ type: String }],
    week: { type: String },
    league_id: { type: Schema.Types.ObjectId },
    status: { type: String, default: 'open' },
    games: { type: [Game.schema], default: [] },
    best_of: { type: Number },
  },
  schema => {
    schema.pre('validate', function() {
      const minGames = Math.ceil(this.best_of / 2)
      if (this.games && this.games.length > 0 && this.games.length < minGames) {
        this.invalidate(
          'games',
          `number of games (${this.games.length}) must be greater than the minumum to win a best of ${this.best_of} series`,
          this.games.length,
        )
      }
    })
  },
)

const Season = createModel('Season', {
  name: { type: String },
  season_type: { type: String },
  matches: [Match.schema],
})

const schema = {
  name: { type: String },
  current_season: { type: String },
  current_week: { type: String },
  seasons: [Season.schema],
  old_id: { type: String },
  team_ids: [{ type: Schema.Types.ObjectId }],
  player_ids: [{ type: Schema.Types.ObjectId }],
}

const Model = createModel('League', schema)

module.exports = {
  get: ({ criteria }) => Model.find(criteria).exec(),
  add: ({ data }) =>
    Promise.all(
      data.map(d => Model.findOneAndUpdate({ old_id: d.old_id }, { $set: d }, { new: true, upsert: true }).exec()),
    ),
  model: Model,
}

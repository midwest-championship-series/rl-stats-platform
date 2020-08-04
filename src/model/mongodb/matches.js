const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const Model = createModel(
  'Match',
  {
    team_ids: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
      required: true,
    },
    players_to_teams: {
      type: [
        {
          player_id: { type: Schema.Types.ObjectId, required: true },
          team_id: { type: Schema.Types.ObjectId, required: true },
        },
      ],
    },
    week: { type: Number, required: true },
    status: { type: String, default: 'open' },
    game_ids: [{ type: Schema.Types.ObjectId, default: [] }],
    best_of: { type: Number },
    /** @deprecated all the below properties are deprecated 8/3/2020 */
    old_id: { type: String, required: true },
    old_team_ids: [{ type: String }],
  },
  schema => {
    schema.path('team_ids').validate(function(val) {
      return val.length === 2
    })
    schema.virtual('games', {
      ref: 'Game',
      localField: 'game_ids',
      foreignField: '_id',
    })
    schema.virtual('teams', {
      ref: 'Team',
      localField: 'team_ids',
      foreignField: '_id',
    })
    schema.virtual('players', {
      ref: 'Player',
      localField: 'players_to_teams.player_id',
      foreignField: '_id',
    })
    schema.virtual('season', {
      ref: 'Season',
      localField: '_id',
      foreignField: 'match_ids',
      justOne: true,
    })
    schema.set('toJSON', {
      virtuals: true,
      transform: function(doc, ret) {
        if (ret.players && ret.teams) {
          ret.teams.forEach(t => {
            t.match_players = ret.players_to_teams
              .filter(({ team_id }) => t._id.equals(team_id))
              .map(({ player_id }) => ret.players.find(p => p._id.equals(player_id)))
          })
        }
      },
    })
    schema.pre('validate', function() {
      const minGames = Math.ceil(this.best_of / 2)
      if (this.game_ids && this.game_ids.length > 0) {
        // validate that best_of has been met
        if (this.game_ids.length < minGames) {
          this.invalidate(
            'game_ids',
            `number of games (${this.game_ids.length}) must be greater than the minumum to win a best of ${this.best_of} series`,
            this.game_ids.length,
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
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
        ).exec(),
      ),
    ),
  Model,
}

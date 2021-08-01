const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

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
      required: true,
    },
    week: { type: Number, required: true },
    status: { type: String, default: 'open' },
    game_ids: [{ type: Schema.Types.ObjectId, default: [] }],
    best_of: { type: Number },
    forfeited_by_team: { type: Schema.Types.ObjectId },
    forfeit_datetime: { type: Date },
    winning_team_id: { type: Schema.Types.ObjectId },
    scheduled_datetime: { type: Date },
  },
  (schema) => {
    schema.path('team_ids').validate(function (val) {
      return val.length === 2
    }, 'expected `{PATH}` to contain two unique team ids')
    schema.path('players_to_teams').validate(function (val) {
      if (val.length === 0) {
        return true
      }
      return [...new Set(val.map(({ team_id }) => team_id.toHexString()))].length === 2
    }, 'expected `{PATH}` to contain two unique team ids')
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
    schema.pre('validate', function () {
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
      if (this.forfeited_by_team) {
        this.status = 'closed'
        this.winning_team_id = this.team_ids.filter(
          (id) => id.toHexString() !== this.forfeited_by_team.toHexString(),
        )[0]
      }
    })
  },
)

module.exports = { Model }

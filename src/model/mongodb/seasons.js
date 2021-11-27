const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const Model = createModel(
  'Season',
  {
    name: { type: String, required: true },
    season_type: { type: String },
    match_ids: [{ type: Schema.Types.ObjectId, required: true }],
    /**
     * these are denormalized fields which adjusted periodically based on what teams/players have played
     * or are scheduled to play in this season's matches
     * Note: player_ids only contains players which actually played in the season
     */
    team_ids: [{ type: Schema.Types.ObjectId, required: true }],
    player_ids: [{ type: Schema.Types.ObjectId, required: true }],
  },
  (schema) => {
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
    schema.virtual('matches', {
      ref: 'Match',
      localField: 'match_ids',
      foreignField: '_id',
    })
    schema.virtual('league', {
      ref: 'League',
      localField: '_id',
      foreignField: 'season_ids',
      justOne: true,
    })
  },
)

module.exports = { Model }

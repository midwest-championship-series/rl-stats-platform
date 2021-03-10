const { Schema } = require('mongoose')
const createModel = require('../../services/mongodb')

const schema = {
  discord_id: { type: String, unique: true, sparse: true },
  team_history: {
    type: [
      {
        team_id: { type: Schema.Types.ObjectId, required: true },
        date_joined: { type: Date, required: true, default: Date.now },
        date_left: Date,
      },
    ],
    default: [],
  },
  avatar: { type: String }, // url with discord avatar url, to which a ?size=128 parameter can be added with desired size
  screen_name: { type: String },
  accounts: {
    type: [
      {
        platform: { type: String },
        platform_id: { type: String },
      },
    ],
    default: [],
  },
  permissions: [{ type: String }],
}

const Model = createModel('Player', schema, schema => {
  schema.query.onTeams = function(teamIds, date) {
    const query = {
      $or: [],
    }
    // return this.find(query)
    teamIds.forEach(teamId => {
      query.$or.push({
        team_history: {
          $elemMatch: {
            team_id: teamId,
            date_joined: { $lte: date },
            date_left: { $gte: date },
          },
        },
      })
      query.$or.push({
        team_history: {
          $elemMatch: {
            team_id: teamId,
            date_joined: { $lte: date },
            date_left: { $exists: false },
          },
        },
      })
    })
    return this.find(query)
  }
  schema.virtual('teams', {
    ref: 'Team',
    localField: 'team_history.team_id',
    foreignField: '_id',
  })
})

module.exports = { Model }

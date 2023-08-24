const dayjs = require('dayjs')
const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

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
  email: { type: String, select: false },
  avatar: { type: String }, // url with discord avatar url, to which a ?size=128 parameter can be added with desired size
  screen_name: { type: String, index: 'text' },
  accounts: {
    type: [
      {
        platform: { type: String, required: true },
        platform_id: { type: String, required: true },
      },
    ],
    default: [],
  },
  permissions: [{ type: String }],
  discord_linked: { type: Date },
}

const Model = createModel('Player', schema, (schema) => {
  schema.query.on_teams = function (team_ids, date) {
    // @description Finds players that were on a team at a particular date
    // @example GET /players?on_teams_date=8-18-2023&on_teams_team_ids=5ec9358e8c0dd900074685c3,5ec9358e8c0dd900074685c4
    if (!team_ids) throw new Error('missing teamIds')
    if (!date) throw new Error('missing date')
    const teamIds = team_ids.split(',')
    const queryDate = dayjs(date)

    const query = {
      $or: [],
    }
    teamIds.forEach((teamId) => {
      query.$or.push({
        team_history: {
          $elemMatch: {
            team_id: teamId,
            date_joined: { $lte: queryDate },
            date_left: { $gte: queryDate },
          },
        },
      })
      query.$or.push({
        team_history: {
          $elemMatch: {
            team_id: teamId,
            date_joined: { $lte: queryDate },
            date_left: { $exists: false },
          },
        },
      })
    })
    return this.where(query)
  }
  schema.virtual('teams', {
    ref: 'Team',
    localField: 'team_history.team_id',
    foreignField: '_id',
  })
})

module.exports = { Model }

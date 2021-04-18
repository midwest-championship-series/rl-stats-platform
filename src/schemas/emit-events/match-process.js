const joi = require('../../util/validator')
const registerSchema = require('./register')

module.exports = [
  registerSchema({
    type: 'MATCH_REPORT_GAMES',
    detail: joi
      .object()
      .keys({
        league_id: joi.objectId().required(),
        urls: joi.array().min(1).required(),
        reply_to_channel: joi.string().required(),
      })
      .required(),
  }),
  registerSchema({
    type: 'MATCH_REPORT_FORFEIT',
    detail: joi
      .object()
      .keys({
        forfeit_team_id: joi.objectId().required(),
        match_id: joi.objectId().required(),
        reply_to_channel: joi.string().required(),
      })
      .required(),
  }),
  registerSchema({
    type: 'MATCH_PROCESS_INIT',
    detail: joi
      .object()
      .keys({
        game_ids: joi.array().items(joi.string()),
        league_id: joi.objectId().required(),
        reply_to_channel: joi.string().required(),
      })
      .required(),
  }),
  registerSchema({
    type: 'MATCH_PROCESS_ENDED',
    detail: joi
      .object()
      .keys({
        match_id: joi.objectId().required(),
        bucket: joi
          .object()
          .keys({
            key: joi.string().required(),
            source: joi.string().required(),
          })
          .required(),
      })
      .required(),
  }),
  registerSchema({
    type: 'MATCH_BIGQUERY_STATS_LOADED',
    detail: joi
      .object()
      .keys({
        match_id: joi.objectId().required(),
      })
      .required(),
  }),
  registerSchema({
    type: 'MATCH_ELASTIC_STATS_LOADED',
    detail: joi
      .object()
      .keys({
        match_id: joi.objectId().required(),
      })
      .required(),
  }),
]

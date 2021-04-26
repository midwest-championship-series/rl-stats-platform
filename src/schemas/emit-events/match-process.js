const joi = require('../../util/validator')
const registerSchema = require('./register')

const bucketSchema = joi
  .object()
  .keys({
    key: joi.string().required(),
    source: joi.string().required(),
  })
  .required()

module.exports = [
  registerSchema({
    type: 'MATCH_REPROCESS',
    detail: joi
      .object()
      .keys({
        collection: joi.string().required(),
        params: joi.object().unknown(true).required(),
        reply_to_channel: joi.string(),
      })
      .required(),
  }),
  registerSchema({
    type: 'MATCH_PROCESS_GAMES_REPORTED',
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
    type: 'MATCH_PROCESS_FORFEIT_REPORTED',
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
    type: 'MATCH_PROCESS_REPLAYS_OBTAINED',
    detail: joi.alternatives().try(
      joi.object().keys({
        league_id: joi.string().required(),
        reply_to_channel: joi.string().required(),
        replays: joi
          .array()
          .min(1)
          .items({
            id: joi.string().required(),
            upload_source: joi.string().valid('ballchasing').required(),
            bucket: bucketSchema,
          })
          .required(),
      }),
      joi.object().keys({
        match_id: joi.string().required(),
        replays: joi
          .array()
          .min(1)
          .items({
            bucket: bucketSchema,
          })
          .required(),
      }),
    ),
  }),
  registerSchema({
    type: 'MATCH_PROCESS_REPLAYS_PARSED',
    detail: joi.object().keys({
      league_id: joi.string().required(),
<<<<<<< HEAD
<<<<<<< HEAD
      reply_to_channel: joi.string().required(),
=======
>>>>>>> add league_id to replay parsing object
=======
      reply_to_channel: joi.string().required(),
>>>>>>> pass reply_to_channel through replay parsing
      parsed_replays: joi
        .array()
        .min(1)
        .items({
          id: joi.string().required(),
          upload_source: joi.string().valid('ballchasing').required(),
          bucket: bucketSchema,
        })
        .required(),
    }),
  }),
  registerSchema({
    type: 'MATCH_PROCESS_INIT',
    detail: joi
      .alternatives()
      .try(
        joi.object().keys({
          game_ids: joi.array().items(joi.string()),
          league_id: joi.objectId().required(),
          reply_to_channel: joi.string().required(),
        }),
        joi.object().keys({
          game_ids: joi.array().min(1).items(joi.string()),
          match_id: joi.objectId().required(),
        }),
        joi.object().keys({
          match_id: joi.string().required(),
          forfeit_team_id: joi.object().required(), // it's an actual objectid for some reason
        }),
      )
      .required(),
  }),
  registerSchema({
    type: 'MATCH_PROCESS_ENDED',
    detail: joi
      .object()
      .keys({
        match_id: joi.objectId().required(),
        bucket: bucketSchema,
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

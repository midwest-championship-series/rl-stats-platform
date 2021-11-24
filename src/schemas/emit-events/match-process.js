const joi = require('../../util/validator')
const registerSchema = require('./register')

const bucketSchema = joi
  .object()
  .keys({
    key: joi.string().required(),
    source: joi.string().required(),
  })
  .required()

const gameReport = joi.alternatives([
  joi.object().keys({
    id: joi.string().required(),
    upload_source: joi.string().valid('ballchasing').required(),
    bucket: bucketSchema.optional() /** @todo remove .optional() when all games have replays stored */,
  }),
  joi.object().keys({
    report_type: joi.string().valid('MANUAL_REPORT'),
    game_number: joi.number(),
    winning_team_id: joi.string(),
    forfeit: joi.boolean().optional(),
  }),
])

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
        replays: joi.array().min(1).items(gameReport).required(),
      }),
      joi.object().keys({
        league_id: joi.string().required(),
        reply_to_channel: joi.string().required(),
        replays: joi.array().min(1).items(gameReport).required(),
        mentioned_team_ids: joi.array().items(joi.string()),
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
      reply_to_channel: joi.string().required(),
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
          report_games: joi.array().min(1).items(gameReport).required(),
          league_id: joi.objectId().required(),
          reply_to_channel: joi.string().required(),
          mentioned_team_ids: joi.array().items(joi.string()),
        }),
        joi.object().keys({
          report_games: joi.array().min(1).items(gameReport).required(),
          match_id: joi.objectId().required(),
          mentioned_team_ids: joi.array().items(joi.string()),
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

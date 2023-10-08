const { Schema } = require('mongoose')

const identify = (name, prop) => {
  const test = prop.type || prop
  if (test === Schema.Types.ObjectId) {
    return 'objectId'
  } else if (test === Schema.Types.Mixed) {
    return null // used to add things temporarily to models in process-match, not a type of data we store and use for api
  } else if (test === Number) {
    return 'number'
  } else if (test === String) {
    return 'string'
  } else if (test === Date) {
    return 'date'
  } else if (test instanceof Array) {
    return 'array'
  } else if (test instanceof Object) {
    return 'object'
  } else {
    throw new Error(`Met unhandled type for prop: ${name}. Type: ${test}`)
  }
}

const buildSchema = (schema) => {
  return Object.entries(schema).reduce(
    (result, [key, value]) => {
      const type = identify(key, value)
      if (!type) return result
      result[key] = { ...value, type }
      switch (type) {
        case 'object':
          result[key].schema = buildSchema(value.type)
          break
        case 'array':
          if (value.type) {
            result[key].schema = buildSchema(value.type[0])
            break
          }
          result[key].schema = identify(key, value[0].type)
          break
      }
      return result
    },
    {
      _id: {
        type: 'objectId',
        required: true,
      },
      created_at: {
        type: 'date',
        required: true,
      },
      updated_at: {
        type: 'date',
        required: true,
      },
    },
  )
}

module.exports = buildSchema

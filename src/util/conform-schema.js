const _ = require('lodash')

const conformObject = (dataObject, schema) => {
  if (Object.keys(dataObject).length < 1) throw new Error(`dataObject is empty`)
  const reducedObject = _.pick(
    dataObject,
    schema.map((s) => s.name),
  )
  schema.forEach((s) => {
    if (!reducedObject[s.name]) return
    switch (s.type.default) {
      case 'integer':
        reducedObject[s.name] = Math.round(reducedObject[s.name])
    }
  })
  return reducedObject
}

module.exports = (conformThis, schema) => {
  if (conformThis instanceof Array) {
    return conformThis.map((item) => conformObject(item, schema))
  } else if (typeof conformThis === 'object') {
    return conformObject(conformThis, schema)
  } else {
    throw new Error(`cannot conform type of ${typeof conformThis}`)
  }
}

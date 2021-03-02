const _ = require('lodash')

module.exports = (dataObject, schema) => {
  console.log('conforming object', dataObject)
  console.log('conforming to schema', schema)
  if (Object.keys(dataObject).length < 1) throw new Error(`dataObject is empty`)
  const reducedObject = _.pick(
    dataObject,
    schema.map(s => s.name),
  )
  schema.forEach(s => {
    if (!reducedObject[s.name]) return
    switch (s.type.default) {
      case 'integer':
        reducedObject[s.name] = Math.round(reducedObject[s.name])
    }
  })
  console.log('reduced', reducedObject)
  return reducedObject
}

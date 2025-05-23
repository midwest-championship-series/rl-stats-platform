const schemas = [...require('./match-process'), ...require('./live-game')]

module.exports = (event) => {
  const schemaMatch = schemas.find((schema) => schema.type === event.type)
  if (!schemaMatch) throw new Error(`no schema match found for event type: ${event.type}`)
  const { error, value } = schemaMatch.schema.validate(event)
  if (error) {
    console.error('error while processing object: ', JSON.stringify(value))
    throw error
  }
  return value
}

const schemas = [...require('./match-process')]

module.exports = (event) => {
  const schemaMatch = schemas.find((schema) => schema.type === event.type)
  if (!schemaMatch) throw new Error(`no schema match found for event type: ${event.type}`)
  const { error, value } = schemaMatch.schema.validate(event)
  if (error) throw error
  return value
}

const virtuals = Model => {
  const modelVirtuals = Model.schema.virtuals
  const items = Object.keys(modelVirtuals).reduce((result, item) => {
    const virtual = modelVirtuals[item]
    result.push({
      path: item,
      reference_model: virtual.options && virtual.options.ref,
      local_field: virtual.options && virtual.options.localField,
      foreign_field: virtuals.options && virtuals.options.foreignField,
    })
    return result
  }, [])
  let description = `Virtuals can be used to add context to the ${Model.collection.collectionName} documents by adding a ?populate={path} query parameter, `
  description += `where path is the name of the virtual. `
  description += `When a virtual is populated, a new parameter with that virtual's name will appear on the documents. `
  description += `Virtuals can be arrays or a single object, usually indicated by whether or the virtual's name is plural or not. `
  if (items[0]) {
    description += `For example, documents from the ${items[0].reference_model} model can be populated on ${Model.collection.collectionName} by adding ?populate=${items[0].path} to the query. `
  }
  description += `Multiple populations can be made on the same model by adding them to the query as individual parameters, like: ?populate={path1}&populate={path2}. `
  description += `You can also perform deep-population, e.g. GET /v2/leagues/5ec9359b8c0dd900074686d3?populate=seasons.matches.teams will populate seasons on the league, `
  description += `matches on the season, and even teams on those matches. `
  return {
    description,
    items,
  }
}

module.exports = Model => {
  return async (req, res, next) => {
    const docs = {
      virtuals: virtuals(Model),
    }
    return res.status(200).send(docs)
  }
}

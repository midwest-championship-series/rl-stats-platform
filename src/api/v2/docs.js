const virtuals = (Model) => {
  const modelVirtuals = Model.schema.virtuals
  const res = Object.keys(modelVirtuals).reduce((result, item) => {
    result[item] = { ...modelVirtuals[item], ...modelVirtuals[item].options }
    delete result[item].getters
    delete result[item].setters
    delete result[item].options
    return result
  }, {})
  let description = `Virtuals can be used to add context to the ${Model.collection.collectionName} documents by adding a ?populate={path} query parameter, `
  description += `where path is the name of the virtual. `
  description += `When a virtual is populated, a new parameter with that virtual's name will appear on the documents. `
  description += `Virtuals can be arrays or a single object, usually indicated by whether or the virtual's name is plural or not. `
  description += `\n\n`
  description += `Multiple populations can be made on the same model by adding them to the query as individual parameters, like: ?populate={path1}&populate={path2}. `
  description += `You can also perform deep-population, e.g. GET /v2/leagues/5ec9359b8c0dd900074686d3?populate=seasons.matches.teams will populate seasons on the league, `
  description += `matches on the season, and even teams on those matches. You can do multiple deep query populations simply by adding them as another populate parameter. `
  description += `GET /v2/seasons/5ebc62b0d09245d2a7c63477?populate=matches.teams&populate=matches.players would populate matches on the season, then `
  description += `both players and teams on matches.`
  return {
    description,
    virtuals: res,
  }
}

const core = (Model) => {
  let description = `Core properties are properties which belong directly to ${Model.collection.collectionName}. `
  description += `They are queriable by using their name in a query parameter, e.g. GET /v2/${Model.collection.collectionName}?_id=5ebc62b0d09245d2a7c63401 would return an array of one with that id. `
  description += `Since the queries are passed through to mongodb, you can also query for properties in arrays, objects, and arrays of objects using dot notation. For example, `
  description += `matches have a property called team_ids which is an array of team ids. You can find all of the matches a team played by the Minneapolis Miracles with `
  description += `GET /v2/matches?team_ids=5ec9358d8c0dd900074685bd while adding "&team_ids=5ec9358e8c0dd900074685c4" would find all of the matches between the Miracles and the St. Cloud Flyers.\n\n`
  description += `\n\n`
  description += `Querying objects and arrays of objects works similarly. For example, matches also have an array of objects called players_to_teams. Finding matches during which Tero played `
  description += `for the Hibbing Rangers is as easy as GET /v2/matches?players_to_teams.player_id=5ec9358f8c0dd900074685c7&players_to_teams.team_id=5ec9358e8c0dd900074685c3`
  return {
    description,
    model: Model.schema.obj,
  }
}

const query = (Model) => {
  let description = `Query helpers are available on some models in order to support queries which are not possible via a direct match. `
  description += `They are placed in the query parameters on the GET /v2/${Model.collection.collectionName} endpoint. Each query helper has its own description of how it operates.`
  let orDescription = `'or' allows you to specify fields which exist in the query string, but should be considered optional rather than mandatory. `
  orDescription += `For example, if you want to find all of the matches with status: 'open' OR week: 6, you could retrieve it with `
  orDescription += `GET /v2/matches?status=open&week=6&or=status&or=week Note that 'or' should always be specified for multiple parameters, otherwise it is not being useful`
  orDescription += `\n\n`
  orDescription += `If you want to do an 'or' operation on the same field, you do not need to use the 'or' query helper. You can simply specify multiple values for the `
  orDescription += `property in your query, e.g. GET /v2/matches?_id=5ec935988c0dd900074686a5&_id=5ec935988c0dd900074686b1 returns matches with either of those ids. `
  orDescription += `The rest of the properties not specified in 'or' are defaulted to an 'and' condition, and will need to evaluate to true in order to be returned.`
  return {
    description,
    or: {
      path: 'or',
      description: orDescription,
    },
  }
}

module.exports = (Model) => {
  return async (req, res, next) => {
    const docs = {
      core: core(Model),
      virtuals: virtuals(Model),
      query: query(Model),
    }
    return res.status(200).send(docs)
  }
}

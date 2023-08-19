const stripFunctionArgs = require('../../util/strip-function-parameters')

const basics = (Model) => {
  let description = `This API offers GET endpoints that allow deep exploration of each of the models in the API. Each in the database is accessible at the root of /api/v2/{model name}. `
  description += `The model names are: leagues, seasons, matches, games, franchises, players, and teams. `
  description += `You can retrieve each model in 2 ways: either in a list through a GET /api/v2/{model name} request (which can include query params, discussed later), `
  description += `or by getting the exact document via an id, like: GET /api/v2/{model name}/{document id}. `
  description += `The API offers retrieval through querying, special query-building helpers, population of linked documents. Read the other objects here to find more. `
  return description
}

const heirarchy = (Model) => {
  let description = `While each model has its own root endpoint, the heirarchy is important to understand when using populations so that you can effectively get linked data. `
  description += `The heirarchy goes as follows: \n`
  description += `leagues\n--seasons\n----matches\n------games\n------teams\n--------franchises\n--------players\n\n`
  description += `So, you can say "leagues have seasons, seasons have matches, matches have games." But it's also fair to say "matches have teams and teams have both franchises and players."\n\n`
  description += `Look at the population documentation for information on how to recall linked documents. `
  return description
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

const populations = (Model) => {
  const modelPopulations = Model.schema.virtuals
  const res = Object.keys(modelPopulations).reduce((result, item) => {
    result[item] = { ...modelPopulations[item], ...modelPopulations[item].options }
    delete result[item].getters
    delete result[item].setters
    delete result[item].options
    return result
  }, {})
  let description = `Populations can be used to add context to the ${Model.collection.collectionName} documents by adding a ?populate={path} query parameter, `
  description += `where path is the name of the population. `
  description += `When a population is called for, a new parameter with that population's name will appear on the documents. `
  description += `Populations can be arrays or a single object, usually indicated by whether or the population's name is plural or not. `
  description += `\n\n`
  description += `Multiple populations can be made on the same model by adding them to the query as individual parameters, like: ?populate={path1}&populate={path2}. `
  description += `You can also perform deep-population, e.g. GET /v2/leagues/5ec9359b8c0dd900074686d3?populate=seasons.matches.teams will populate seasons on the league, `
  description += `matches on the season, and even teams on those matches. You can do multiple deep query populations simply by adding them as another populate parameter. `
  description += `GET /v2/seasons/5ebc62b0d09245d2a7c63477?populate=matches.teams&populate=matches.players would populate matches on the season, then `
  description += `both players and teams on matches.`
  return {
    description,
    populations: res,
  }
}

function getFunctionDescription(func) {
  const commentPattern = /\/\/ @description ([\s\S]*?)\/\/ @example ([\s\S]*?)(?=\n|$)/
  const match = func.toString().match(commentPattern)
  if (match && match.length > 2) {
    return {
      description: match[1].trim(),
      example: match[2].trim(),
    }
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
  const queryDocs = {
    description,
    or: {
      path: 'or',
      description: orDescription,
    },
  }

  Object.keys(Model.schema.query).forEach((key) => {
    const func = Model.schema.query[key]
    const funcDesc = getFunctionDescription(func)

    queryDocs[key] = {
      path: key,
      parameters: stripFunctionArgs(func),
      description: funcDesc ? funcDesc.description : 'Description not provided.',
      example: funcDesc ? funcDesc.example : 'Example not provided.',
    }
  })

  return queryDocs
}

module.exports = (Model) => {
  return async (req, res, next) => {
    const docs = {
      basics: basics(Model),
      heirarchy: heirarchy(Model),
      core: core(Model),
      populations: populations(Model),
      query: query(Model),
    }
    return res.status(200).send(docs)
  }
}

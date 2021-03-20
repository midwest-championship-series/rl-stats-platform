const reduceSchema = schema => {
  return schema.reduce((result, item) => {
    result[item.name] = item.type.default
    return result
  }, {})
}

const filterDocs = schema => {
  let description = `Simple filtering api which allows specification of filters using query params`
  description += ` (e.g. ?${schema[0].name}=value1&${schema[1].name}=value2).`
  description += ` Also accepts a "size" and "from" parameters for pagination.`
  return {
    core: {
      description,
      model: reduceSchema(schema),
    },
  }
}

const rawDocs = schema => {
  let description = 'API for advanced querying and stats.'
  description +=
    ' Allows pass-through querying of elasticsearch according to these docs: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html.'
  description += ' Returns a simplified response with hits, aggregations, and a total number of accessible hits'
  return {
    core: {
      description,
      model: reduceSchema(schema),
    },
  }
}

module.exports = schema => {
  return (req, res, next) => {
    req.context = {
      GET: filterDocs(schema),
      POST: rawDocs(schema),
    }
    next()
  }
}

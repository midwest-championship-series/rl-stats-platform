const { sendChat } = require('../../../../services/openai')

module.exports = async (req, res, next) => {
  const { query } = req.body
  const { data } = await sendChat([
    {
      role: 'system',
      content:
        'You are an api that takes natural language queries and develops sql queries for bigquery. You respond only with a json object that has 2 properties: message, and query. You never provide anything other than the json object as a response. If you have enough information to develop an SQL query, the that will go in the query property. If you need more information to develop a query, that goes in the message property. Here is the basic information you need: you have access to two tables, mnrl-269717.prod_stats.player_games and mnrl-269717.prod_stats.team_games. They contain rocket league game records for players and teams, respectively, so each player and team has multiple records that each represent a single game. All of the same columns that ballchasing.com includes in its api.',
    },
    { role: 'user', content: query },
  ])
  req.context = JSON.parse(data.choices[0].message.content)
  next()
}

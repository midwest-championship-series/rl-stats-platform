# MNGG Stats Project

This service exists to provide the Minnesota Rocket League community with the ability to manage players and their stats through the Minnesota Championship Series (MNCS) league play and tournament.

## API Docs

### Authentication

Put your api key in a header called `x-api-key`
Use an environment variable within postman to make it easy to swap out variables like the base url and api key, as well as making sure they stay secret - don't share the key

### Collections

Each collection (think of it as a table, e.g. players is a collection) has its own set of REST endpoints which operate the same, for uniformity. Collections are: leagues, seasons, matches, games, players, and teams

### Examples

```
GET /players
GET /players/5ec935928c0dd90007468614
GET /teams
GET /teams/5ec9358d8c0dd900074685bd
```

### Documentation

If you want to know more about the properties that a particular object type can have, or how those properties are related to other documents, there is a dynamic documentation endpoint. Just add "/_docs" to the collection (like `GET /players/_docs`)

### Filtering

On the list endpoints (e.g. `GET /players`) you can filter for objects with specific properties. For example, if you wanted to find SlowHands' player object, you might decide to search with a discord id (you can copy discord ids by finding a message in discord, right clicking and selecting "Copy Id"). His discord id is: `284106325028241409`. You can filter by any property on the object using a query parameter. `GET /players?discord_id=284106325028241409` will return an array with all of the objects matching the query (which of course is just SlowHands).

You can filter by properties which are contained within objects or arrays using "dot notation." E.g. Players have a property called `team_history` which is a nested array of objects. If you want to get a list of all players who have played for a team, that looks like:

`GET /players?team_history.team_id=5ec9358d8c0dd900074685bd`

Note: you cannot filter on populated objects (see `Accessing Related Documents`)

### Collection Structure

Collections are related to each other in the following way:
Leagues have Seasons
Seasons have Matches
Matches have Games and Teams
Players have Teams

Seasons also have denormalized fields for Teams and Players (the fields are essentially a copy of data that exists elsewhere, specifically which players and teams play in matches in that season). That's just for easier access.

### Accessing Related Documents

If you have a league, and want to get all of the seasons in that league without making multiple API calls, you can do that using the populate query parameter.

`GET /leagues?name=mncs&populate=seasons`

populate is a special parameter which works to tell the API to attach the seasons documents to the API response. Since there are multiple seasons in a league, it will come back as an array called seasons. You can tell what you can populate by looking at the _docs endpoint, or fields that have _id or _ids on objects are usually populatable fields (e.g. season_ids on leagues is populatable in the example above). 

You can deep-populate as well. For example, if I wanted to get all of the games played so far in a MNCS Season 4, I could make a call like:

`GET /leagues?name=mncs&populate=seasons.matches.games`

You can also go back up the structure because each child document has a populatable field for its parent. For example, if you wanted to get all of the seasons that Tero played in, you might grab Tero's player id and search:

`/matches?players_to_teams.player_id=5ec9358f8c0dd900074685c7&populate=season`

Multiple populations work as well. The same query could be written to populate the teams and players on that match.

`/matches?players_to_teams.player_id=5ec9358f8c0dd900074685c7&populate=season&populate=teams&populate=players`

## Developing

### Dependencies

You'll need both node an python in order to run these services. I'd recommend getting [nvm](https://github.com/nvm-sh/nvm) and [pyenv](https://github.com/pyenv/pyenv) to manage versions, which are specified in [serverless.yml](./serverless.yml).

Also get `yarn` for node package management

```bash
brew install yarn
```

Still working on successfully managing python packages, but I've been using `pipenv` with success locally. The problem so far has been that the package apparently does not work on lambda. `python-lambda-requirements` was supposed to fix this, and it does for packages like `numpy`, but it does not apparently work for `carball` yet.

### Setup

After deps are installed, `yarn install` and `pipenv install` in order to get the required packages.

### Deployment

This service only lives on CloudFormation, and everything is managed via the Serverless framework.

Command:

```bash
sls deploy
```

Note that you may have to have an aws profile called `personal`, although that can be parameterized in the future

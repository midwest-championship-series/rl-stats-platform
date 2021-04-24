const group = (stats, groupBy) => {
  return stats.reduce((result, gameStats) => {
    const groupVal = gameStats[groupBy]
    if (!result[groupVal]) {
      result[groupVal] = {}
    }
    Object.keys(gameStats).forEach((key) => {
      if (typeof gameStats[key] === 'number') {
        if (result[groupVal].hasOwnProperty(key)) {
          result[groupVal][key] += gameStats[key]
        } else {
          result[groupVal][key] = gameStats[key]
        }
      } else if (typeof gameStats[key] === 'string') {
        // assume it's context and just assign it
        result[groupVal][key] = gameStats[key]
      }
    })
    return result
  }, {})
}

const createSummaryField = (team, groupedStats) => {
  const { shots, goals, saves, assists } = groupedStats
  return {
    name: team.name,
    value: `Shots: ${shots}\nGoals: ${goals}\nSaves: ${saves}\nAssists: ${assists}`,
    inline: true,
  }
}

const matchSummary = (data) => {
  const { league, match, teams, teamStats } = data
  const groupedTeamStats = group(teamStats, 'team_id')
  const winner = teams.find((t) => match.winning_team_id.equals(t._id))
  const loser = teams.find((t) => !match.winning_team_id.equals(t._id))
  const twitchUrl = league.urls && league.urls.find((u) => u.name === 'twitch')
  const statsUrl = league.urls && league.urls.find((u) => u.name === 'stats')
  const thumbUrl = league.urls && league.urls.find((u) => u.name === 'logo')

  return {
    title: `${league.name.toUpperCase()} week ${match.week} ${teams.map((t) => t.name).join(' vs ')}`,
    description: `${winner.name} defeated ${loser.name} (${groupedTeamStats[winner._id.toHexString()].wins}-${
      groupedTeamStats[loser._id.toHexString()].wins
    })`,
    color: league.hex_color || '6caddf',
    url: twitchUrl && twitchUrl.url,
    author: {
      name: 'Minnesota Championship Series',
      url: statsUrl && statsUrl.url,
    },
    thumbnail: {
      url: thumbUrl && thumbUrl.url,
    },
    fields: [
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      createSummaryField(winner, groupedTeamStats[winner._id.toHexString()]),
      createSummaryField(loser, groupedTeamStats[loser._id.toHexString()]),
    ],
    image: winner.avatar ? { url: winner.avatar } : undefined,
    footer: {
      text: 'Stats by Tero & MNCS Stats Team',
    },
  }
}

const forfeitSummary = (data) => {
  const { league, match, teams, forfeit_team_id } = data
  const loser = teams.find((t) => t._id.equals(forfeit_team_id))
  const winner = teams.find((t) => t._id.toHexString() !== loser._id.toHexString())
  const twitchUrl = league.urls && league.urls.find((u) => u.name === 'twitch')
  const statsUrl = league.urls && league.urls.find((u) => u.name === 'stats')
  const thumbUrl = league.urls && league.urls.find((u) => u.name === 'logo')

  return {
    title: `${league.name.toUpperCase()} week ${match.week} ${teams.map((t) => t.name).join(' vs ')}`,
    description: `${loser.name} forfeited to ${winner.name}. Bad ${loser.name} :slight_frown:`,
    color: league.hex_color || '6caddf',
    url: twitchUrl && twitchUrl.url,
    author: {
      name: 'Minnesota Championship Series',
      url: statsUrl && statsUrl.url,
    },
    thumbnail: {
      url: thumbUrl && thumbUrl.url,
    },
    image: winner.avatar ? { url: winner.avatar } : undefined,
    footer: {
      text: 'Stats by Tero & MNCS Stats Team',
    },
  }
}

module.exports = (data) => {
  if (data.forfeit_team_id) {
    return forfeitSummary(data)
  } else {
    return matchSummary(data)
  }
}

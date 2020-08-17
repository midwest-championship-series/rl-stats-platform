const group = (stats, groupBy) => {
  return stats.reduce((result, gameStats) => {
    const groupVal = gameStats[groupBy]
    if (!result[groupVal]) {
      result[groupVal] = {}
    }
    Object.keys(gameStats).forEach(key => {
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

module.exports = data => {
  const { league, match, games, teams, teamStats } = data
  const groupedTeamStats = group(teamStats, 'team_id')
  const winner = teams.find(t => match.winning_team_id.equals(t._id))
  const loser = teams.find(t => !match.winning_team_id.equals(t._id))

  return {
    title: `${league.name.toUpperCase()} week ${match.week} ${teams.map(t => t.name).join(' vs ')}`,
    description: `${winner.name} defeated ${loser.name} (${groupedTeamStats[winner._id.toHexString()].wins}-${
      groupedTeamStats[loser._id.toHexString()].wins
    })`,
    color: league.hex_color || '6caddf',
    url: 'https://www.twitch.tv/videos',
    author: {
      name: 'Minnesota Championship Series',
      url: 'https://datastudio.google.com/s/gYDmjMXTvZk',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/692994579305332806/744778007314563092/mncs_logo_clear.webp',
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

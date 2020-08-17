const { ObjectId } = require('mongodb')
const matchSummary = require('../match-summary')

describe('match-summary', () => {
  it('should generate a match summary embed', () => {
    const data = {
      league: { name: 'mncs', hex_color: '6caddf' },
      teams: [
        {
          _id: new ObjectId('5ec9358e8c0dd900074685c5'),
          name: 'Bloomington Maulers',
          avatar:
            'https://cdn.discordapp.com/attachments/692994579305332806/744660313785368748/mncs_bloomingtonmaulers.png',
        },
        { _id: new ObjectId('5ec9358e8c0dd900074685c4'), name: 'St. Cloud Flyers' },
      ],
      match: {
        winning_team_id: new ObjectId('5ec9358e8c0dd900074685c5'),
        week: 4,
      },
      teamStats: [
        { team_id: '5ec9358e8c0dd900074685c5', wins: 1, shots: 4, goals: 3, saves: 6, assists: 2 },
        { team_id: '5ec9358e8c0dd900074685c4', wins: 0, shots: 10, goals: 2, saves: 1, assists: 1 },
        { team_id: '5ec9358e8c0dd900074685c5', wins: 1, shots: 11, goals: 3, saves: 10, assists: 1 },
        { team_id: '5ec9358e8c0dd900074685c4', wins: 0, shots: 13, goals: 2, saves: 4, assists: 2 },
        { team_id: '5ec9358e8c0dd900074685c5', wins: 0, shots: 3, goals: 1, saves: 6, assists: 0 },
        { team_id: '5ec9358e8c0dd900074685c4', wins: 1, shots: 11, goals: 2, saves: 1, assists: 2 },
        { team_id: '5ec9358e8c0dd900074685c5', wins: 1, shots: 10, goals: 5, saves: 3, assists: 4 },
        { team_id: '5ec9358e8c0dd900074685c4', wins: 0, shots: 7, goals: 2, saves: 3, assists: 1 },
      ],
    }
    const embed = matchSummary(data)
    expect(embed).toMatchObject({
      title: `MNCS week 4 Bloomington Maulers vs St. Cloud Flyers`,
      description: `Bloomington Maulers defeated St. Cloud Flyers (3-1)`,
      color: '6caddf',
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
        {
          name: 'Bloomington Maulers',
          value: 'Shots: 28\nGoals: 12\nSaves: 25\nAssists: 7',
          inline: true,
        },
        {
          name: 'St. Cloud Flyers',
          value: 'Shots: 41\nGoals: 8\nSaves: 9\nAssists: 6',
          inline: true,
        },
      ],
      image: {
        url: 'https://cdn.discordapp.com/attachments/692994579305332806/744660313785368748/mncs_bloomingtonmaulers.png',
      },
      footer: {
        text: 'Stats by Tero & MNCS Stats Team',
      },
    })
  })
})

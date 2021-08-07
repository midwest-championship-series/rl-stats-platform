const { ObjectId } = require('bson')

module.exports = [
  {
    _id: new ObjectId('5ec9358d8c0dd900074685c2'),
    created_at: new Date('2020-05-23T14:39:09.945Z'),
    discord_id: '688286382921089056',
    hex_color: '8014E8',
    name: 'Rochester Rhythm',
    updated_at: new Date('2021-05-18T01:37:16.094Z'),
    avatar: 'https://cdn.discordapp.com/attachments/692994579305332806/744660367682043974/mncs_rochesterrhythm.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddc8'),
    vars: [
      {
        _id: new ObjectId('60a31a4cf766b70008b4dc0a'),
        key: 'display_name',
        value: 'Rhythm',
      },
    ],
  },
  {
    _id: new ObjectId('5ec9358e8c0dd900074685c4'),
    created_at: new Date('2020-05-23T14:39:09.945Z'),
    discord_id: '688286435177922562',
    hex_color: '886C63',
    name: 'St. Cloud Flyers',
    updated_at: new Date('2021-05-18T01:36:32.779Z'),
    avatar: 'https://cdn.discordapp.com/attachments/692994579305332806/744660372224475266/mncs_stcloudflyers.png',
    franchise_id: new ObjectId('600fac63be0bbe0008ffddca'),
    vars: [
      {
        _id: new ObjectId('60a31a20f766b70008b4dc07'),
        key: 'display_name',
        value: 'Flyers',
      },
    ],
  },
]

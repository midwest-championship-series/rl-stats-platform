const path = require('path')
const csv = require('csvtojson')
const { Matches, Leagues, Seasons, Players } = require('../src/model/mongodb')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const handler = async () => {
  console.info('adding stream links')
  const leagues = await Leagues.find().populate({
    path: 'current_season',
    populate: 'matches',
  })
  for (let league of leagues) {
    if (league.name.toLowerCase() !== 'prospect') {
      const streamLink = 'https://www.twitch.tv/mnchampionshipseries'
      for (let match of league.current_season.matches) {
        if (!match.stream_link) {
          match.stream_link = streamLink
          await match.save()
          console.log(`saved match: ${match._id}`)
        }
      }
    }
  }

  console.log('adjusting times')
  const minDate = new Date('2022-06-15T22:22:17.938+00:00')
  const matches = await Matches.find({
    scheduled_datetime: { $gte: minDate },
  })
  for (let match of matches) {
    const day = dayjs(match.scheduled_datetime)
    if (
      day.utc().format('hh:mm:ss') === '02:00:00' ||
      day.utc().format('hh:mm:ss') === '02:45:00' ||
      day.utc().format('hh:mm:ss') === '01:00:00' ||
      day.utc().format('hh:mm:ss') === '01:45:00'
    ) {
      const newTime = new Date(match.scheduled_datetime).setHours(match.scheduled_datetime.getHours() - 3)
      // const newDateString = dayjs(newTime).utc().format('hh:mm:ss')
      // console.log(match.scheduled_datetime, day.utc().format('hh:mm:ss'), dayjs(newTime).utc().format('hh:mm:ss'))
      match.scheduled_datetime = newTime
      match.stream_link = undefined
      await match.save()
      console.log(`updated time for match: ${match._id}`)
    }
  }
}

module.exports = { handler }

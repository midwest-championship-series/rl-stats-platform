const { EventBridge } = require('aws-sdk')
const { chunk } = require('lodash')
const client = new EventBridge()

const validateEvent = require('../../schemas/emit-events')

const eventBus = process.env.EVENT_BUS
const serviceName = process.env.SERVERLESS_SERVICE

const emitEvent = (event) => {
  return emit([createEvent(event)])
}

const emitEvents = (events) => {
  console.info(
    'making eventbridge call',
    events.map((e) => createEvent(e)),
  )
  return emit(events.map((e) => createEvent(e)))
}

const createEvent = (event) => {
  validateEvent(event)
  const { type, detail } = event
  return {
    Detail: JSON.stringify(detail),
    DetailType: type,
    EventBusName: eventBus,
    Resources: [],
    Source: serviceName,
  }
}

const emit = async (events) => {
  const messageRequests = chunk(events, 10)
  let failed = 0
  const entries = []
  for (let msg of messageRequests) {
    console.info('msg', JSON.stringify(msg))
    const res = await client.putEvents({ Entries: msg }).promise()
    entries.push(...res.Entries)
    failed += res.FailedEntryCount
  }
  return {
    failed,
    succeeded: entries.length,
    entries,
  }
}

module.exports = {
  emitEvent,
  emitEvents,
}

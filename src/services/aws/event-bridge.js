const { EventBridge } = require('aws-sdk')
const { chunk } = require('lodash')
const client = new EventBridge()

const eventBus = process.env.EVENT_BUS
const serviceName = process.env.SERVERLESS_SERVICE

const emitEvent = (type, detail) => {
  return emit([createEvent(type, detail)])
}

const emitEvents = events => {
  console.log(
    'making eventbridge call',
    events.map(e => createEvent(e.type, e.detail)),
  )
  return emit(events.map(e => createEvent(e.type, e.detail)))
}

const createEvent = (type, detail) => ({
  Detail: JSON.stringify(detail),
  DetailType: type,
  EventBusName: eventBus,
  Resources: [],
  Source: serviceName,
})

const emit = async events => {
  const messageRequests = chunk(events, 10)
  let responses = []
  for (let msg of messageRequests) {
    console.log('msg', JSON.stringify(msg))
    const res = await client.putEvents({ Entries: msg }).promise()
    responses = responses.concat(res)
  }
  return responses
}

module.exports = {
  emitEvent,
  emitEvents,
}

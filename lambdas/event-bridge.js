const { eventBridge } = require('../src/services/aws')

module.exports = {
  handler: async () => {
    const event = {
      type: 'BIG_STUFF',
      detail: {
        boomers: [{ x: 1, y: 3 }],
      },
    }
    console.log(`logging event`, JSON.stringify(event, null, 2))
    // const res = await eventBridge.emitEvent(event.type, event.detail)
    const res = await eventBridge.emitEvents([event])
    console.log('res', JSON.stringify(res))
    return res
  },
}

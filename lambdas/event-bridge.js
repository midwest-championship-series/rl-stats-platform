const { eventBridge } = require('../src/services/aws')

module.exports = {
  handler: async () => {
    const event = {
      type: 'MATCH_PROCESS_ENDED',
      detail: {
        match_id: '5ec935988c0dd900074686a5',
        s3_data_url: 'https://s3.com',
      },
    }
    console.log(`logging event`, JSON.stringify(event, null, 2))
    // const res = await eventBridge.emitEvent(event.type, event.detail)
    const res = await eventBridge.emitEvents([event])
    console.log('res', JSON.stringify(res))
    return res
  },
}

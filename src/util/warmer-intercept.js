module.exports = event => {
  console.log('intercepting warmer')
  return event && event.type === 'warmer'
}

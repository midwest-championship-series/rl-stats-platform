module.exports = (event) => {
  if (event && event.type === 'warmer') {
    console.info('intercepting warmer')
    return true
  }
}

module.exports = (event) => {
  if (event && event.type === 'warmer') {
    console.log('intercepting warmer')
    return true
  }
}

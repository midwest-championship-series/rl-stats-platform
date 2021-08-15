module.exports = (obj) => {
  obj.save = jest.fn()
  return obj
}

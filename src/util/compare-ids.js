const { ObjectId } = require('bson')

module.exports = (id1, id2) => {
  if (typeof id1 === 'string' && typeof id2 === 'string') {
    return id1 === id2
  } else if (id1 instanceof ObjectId) {
    return id1.equals(id2)
  } else if (id2 instanceof ObjectId) {
    return id2.equals(id1)
  }
}

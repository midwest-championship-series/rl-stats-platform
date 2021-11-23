const { ObjectId } = require('mongodb')

module.exports = (id1, id2) => {
  if (id1 instanceof ObjectId) {
    return id1.equals(id2)
  } else if (id2 instanceof ObjectId) {
    return id2.equals(id1)
  } else {
    return id1 === id2
  }
}

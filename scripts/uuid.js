const { ObjectId } = require('mongodb')
for (let i = 0; i < 10; i++) {
  console.log(new ObjectId().toHexString())
}

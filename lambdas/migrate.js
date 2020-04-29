const { ssm, aurora } = require('../src/services/aws')
const db = require('../src/services/db')

const handler = async () => {
  // const secret = await ssm.getSecret(process.env.DB_SECRET_NAME)
  // const dbArn = `arn:aws:rds:${process.env.SERVERLESS_REGION}:123456789012:db:my-mysql-instance-1`
  // const params = {
  //   resourceArn: process.env.DB_ARN,
  //   secretArn: secret.ARN,
  //   sql: 'SELECT * from information_schema.tables',
  // }
  // return secret
  // return params
  // return new Promise((resolve, reject) => {
  //   aurora.executeStatement(params, (err, data) => {
  //     if (err) return reject(err)
  //     return resolve(data)
  //   })
  // })
  console.log('connecting')
  await db()
  console.log('done')
}

module.exports = { handler }

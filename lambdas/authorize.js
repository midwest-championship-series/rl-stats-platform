const AuthTable = require('../src/model/auth')

const handler = async (event, context) => {
  console.log('being called')
  if (!event.authorizationToken) {
    throw new Error('Unauthorized')
  }
  console.log(event.authorizationToken)
  return generatePolicy('user', 'Allow', event.methodArn)
}

// Help function to generate an IAM policy
var generatePolicy = async (principalId, effect, resource) => {
  const user = await AuthTable.get({ id: '123' })

  const authResponse = {}

  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: 'stringval',
    numberKey: 123,
    booleanKey: true,
  }
  return authResponse
}

module.exports = { handler }

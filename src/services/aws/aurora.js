const { RDSDataService } = require('aws-sdk')

const client = new RDSDataService({ apiVersion: '2018-08-01' })

module.exports = client

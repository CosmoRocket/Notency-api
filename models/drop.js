/* @flow */
const Recipient = require('./Recipient')

Recipient.deleteMany()
  .then(() => {
    console.log('All recipients deleted.')
    process.exit()
  })
  .catch(error => {
    console.error('Error', error)
    process.exit()
  })

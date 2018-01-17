/* @flow */
const Recipient = require('./Recipient')
const moment = require('moment')

Recipient.create({
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  role: 'Student',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia',
  graduationDate: moment.utc('31/12/2018', 'DD/MM/YYYY', true)
})
  .then(recipients => {
    console.log('Created recipients', recipients)
    process.exit()
  })
  .catch(error => {
    console.error('Error', error)
    process.exit()
  })

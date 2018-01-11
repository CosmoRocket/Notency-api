const Recipient = require('./Recipient')

Recipient.create({
  recipientId: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
})
  .then(recipients => {
    console.log('Created recipients', recipients)
    process.exit()
  })
  .catch(error => {
    console.error('Error', error)
    process.exit()
  })

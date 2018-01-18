/* @flow */
const moment = require('moment')
const Recipient = require('./Recipient')
const Notification = require('./Notification')
const Announcement = require('./Announcement')
const Message = require('./Message')

Recipient.create({
  idNo: '0123451',
  firstName: 'Jane',
  lastName: 'Doe',
  mobile: '+61444888009',
  email: 'sometwo@example.com',
  nationality: 'France',
  role: 'student',
  graduationDate: moment.utc('31/12/2018', 'DD/MM/YYYY', true)
})

Recipient.create({
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia',
  role: 'teacher',
  graduationDate: moment.utc('14/12/2018', 'DD/MM/YYYY', true)
})
  .then(recipient => {
    return Message.create({
      sender: recipient._id,
      body: 'EQ1 OK'
    })
  })
  .then(message => {
    return Promise.all([
      Notification.create({
        code: 'EQ1',
        subject: 'Earthquake of magnitude 8.2 in Japan',
        groups: [
          { name: 'country', selected: 'France' },
          { name: 'country', selected: 'Italy' }
        ],
        responses: [message._id],
        recipients: [message.sender],
        bodyHtml:
          '<p>There was an earthquake of magnitude 8.2 in Japan. Please reply EQ1 OK if you are OK</p>',
        body:
          'There was an earthquake of magnitude 8.2 in Japan. Please reply EQ1 OK if you are OK'
      }),
      Announcement.create({
        subject: 'Graduation Day for Students of Class 1024',
        bodyHtml:
          '<h1>Dear students</h1><p>The graduation for course eA342 will be hold on Thursday the 2nd of March 2018 at 12am. Please be punctual.</p>',
        recipients: [message.sender],
        groups: [
          { name: 'country', selected: 'France' },
          { name: 'country', selected: 'Italy' }
        ]
      })
    ])
  })
  .then(() => {
    process.exit()
  })
  .catch(error => {
    console.error('Error', error)
    process.exit()
  })

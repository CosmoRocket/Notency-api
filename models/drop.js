/* @flow */
const Recipient = require('./Recipient')
const Notification = require('./Notification')
const Announcement = require('./Announcement')
const Message = require('./Message')

/*
*   Drop Collections
*/
const dropData = async () => {
  try {
    await Recipient.deleteMany()
    await Notification.deleteMany()
    await Announcement.deleteMany()
    await Message.deleteMany()
    console.log('Data Drop Complete!')
    process.exit()
  }
  catch (error) {
    console.error('Error', error)
    process.exit()
  }
}
dropData()
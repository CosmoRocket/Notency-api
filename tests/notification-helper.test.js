/* @flow */
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const Notification = require('../models/Notification')
const notificationHelper = require('../helper/notification-helper')
let recipientObj
let notificationObj

const recipient = {
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  role: 'Student',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
}

const attributes1 = {
  code: 'EQ1',
  subject: 'Earthquake at Melbourne',
  body: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{ name: "nationality", item: "Australia" }],
  recipients: []
}

beforeAll(async () => {
  console.log('Test started.')
  try {
    await Notification.deleteMany()
    await Recipient.deleteMany()
    await Message.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

describe('Create a recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const data = await Recipient.create(recipient)
      // Set id of recipient to be searched later
      recipientObj = data
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create first notification', () => {
  test('It should create a new notification', async () => {
    try {
      attributes1.recipients = [recipientObj]
      const data = await Notification.create(attributes1)
      // Set if of notification to be searched later
      notificationObj = data
      expect(data).not.toBeNull()
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Retrieve notification by Code', () => {
  test('It should find the correct notification', async () => {
    try {
      const input = notificationObj.code
      const expected = notificationObj._id
      const data = await notificationHelper.getNotificationByCode(input)
      expect(data._id).toEqual(expected)
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Check if sender already responded to notification', () => {
  test('It should find that the sender has not yet responded', async () => {
    try {
      const inputRecipient = recipientObj
      const inputNotification = await notificationHelper.getNotificationByCode(notificationObj.code)
      const expected = false
      const data = await notificationHelper.hasAlreadyResponded(inputRecipient, inputNotification)
      expect(data).toEqual(expected)
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Add response to a notificaiton', () => {
  test('It should add the response to the notification', async () => {
    try {
      const inputCode = notificationObj.code
      const messageAttribute = {
        sender: recipientObj,
        body: 'This is a test'
      }
      const inputResponse = await Message.create(messageAttribute)
      const expected = 'This is a test'
      const data = await notificationHelper.addResponseToNotification(inputCode, inputResponse)
      expect(data.responses[0].body).toEqual(expected)
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Check if sender already responded to notification', () => {
  test('It should find that the sender already responded', async () => {
    try {
      const inputRecipient = recipientObj
      const inputNotification = await notificationHelper.getNotificationByCode(notificationObj.code)
      const expected = true
      const data = await notificationHelper.hasAlreadyResponded(inputRecipient, inputNotification)
      expect(data).toEqual(expected)
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

afterAll(async () => {
  console.log('Test started.')
  try {
    await Message.deleteMany()
    await Recipient.deleteMany()
    await Notification.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

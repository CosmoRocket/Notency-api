/* @flow */
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const Notification = require('../models/Notification')
const notificationHelper = require('../helper/notification-helper')
let recipientObj = ''
let recipientId = ''
let notificationId1 = ''
let notificationId2 = ''
let notificationId3 = ''

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

const attributes2 = {
  code: 'TS1',
  subject: 'Tsunami at Sydney Harbour',
  body: 'This is to inform all Students that there has been a Tsunami at Sydney Harbour. Please reply "TSUNAMI1 OK" if you are safe.',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{ name: "nationality", item: "Australia" }],
  recipients: []
}

const attributes3 = {
  code: 'FR1',
  subject: 'Terror Attack in France',
  body: 'This is to inform all Students that there has been a Terror Attack in France. Please reply "FRANCETERROR OK" if you are safe.',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{ name: "nationality", item: "France" }],
  recipients: []
}

const attributes4 = {
  code: 'TN4',
  subject: 'Test Notification 4',
  body: 'This is a test Notification',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "France" }],
  recipients: []
}

const attributes5 = {
  code: 'TN5',
  subject: 'Test Notification 5',
  body: 'This is a test Notification',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "Philippines" }],
  recipients: []
}

const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10))

const attributes6 = {
  code: 'TN6',
  subject: 'Test Notification 6',
  body: 'This is a test Notification',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "Hong Kong" }],
  recipients: [],
  createdAt: tenDaysAgo
}

const attributes7 = {
  code: 'TN7',
  subject: 'Test Notification 7',
  body: 'This is a test Notification',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "Hong Kong" }],
  recipients: [],
  createdAt: tenDaysAgo
}

const response1 = {
  sender: '',
  body: 'EQ1 OK'
}
const response2 = {
  sender: '',
  body: 'TS1 OK'
}
const response3 = {
  sender: '',
  body: 'FR1 OK'
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
      recipientId = data._id
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
      notificationId1 = data._id
      expect(data).not.toBeNull()
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create second notification', () => {
  test('It should create a new notification', async () => {
    try {
      attributes2.recipients = [recipientObj]
      const data = await Notification.create(attributes2)
      // Set if of notification to be searched later
      notificationId2 = data._id
      expect(data).not.toBeNull()
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create third notification', () => {
  test('It should create a new notification', async () => {
    try {
      attributes3.recipients = [recipientObj]
      const data = await Notification.create(attributes3)
      // Set if of notification to be searched later
      notificationId3 = data._id
      expect(data).not.toBeNull()
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create 4 more notification', () => {
  test('It should create new notifications', async () => {
    try {
      attributes4.recipients = [recipientObj]
      attributes5.recipients = [recipientObj]
      attributes6.recipients = [recipientObj]
      attributes7.recipients = [recipientObj]
      const data = await Notification.create([attributes4, attributes5, attributes6, attributes7])
      expect(data).not.toBeNull()
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get all notifications', () => {
  test('It should get more than one notifications', async () => {
    try {
      const data = await Notification.find()
      const dataLength = Object.keys(data).length
      expect(dataLength).toEqual(7) // Should be more than 1 recipient
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a notification by ID', () => {
  test('It should return a specific notification', async () => {
    try {
      const data = await Notification.findById(notificationId1)
      expect(data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Update a notification', () => {
  test('It should update a specific notification', async () => {
    try {
      const attributes = {
        code: 'EQ2',
        subject: '2nd Earthquake at Melbourne',
        body: 'This is to inform all Students that there has been a 2nd Earthquake at Melbourne. Please reply "EARTHQUAKE2 OK" if you are safe.',
      }
      const data = await Notification.findByIdAndUpdate(notificationId1, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Notification.findById(data._id)
      expect(updatedData).toEqual(data)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create response message for Notification 1', () => {
  test('It should create a new message', async () => {
    try {
      response1.sender = recipientId
      const msg = await Message.create(response1)
      // Set id of first message to be searched later
      const messageId = msg._id
      const attributes = {
        responses: [messageId]
      }
      const data = await Notification.findByIdAndUpdate(notificationId1, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Notification.findById(data._id)
      expect(updatedData).toEqual(data)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create response message for Notification 2', () => {
  test('It should create a new message', async () => {
    try {
      response2.sender = recipientId
      const msg = await Message.create(response2)
      // Set id of first message to be searched later
      const messageId = msg._id
      const attributes = {
        responses: [messageId]
      }
      const data = await Notification.findByIdAndUpdate(notificationId2, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Notification.findById(data._id)
      expect(updatedData).toEqual(data)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create response message for Notification 3', () => {
  test('It should create a new message', async () => {
    try {
      response3.sender = recipientId
      const msg = await Message.create(response3)
      // Set id of first message to be searched later
      const messageId = msg._id
      const attributes = {
        responses: [messageId]
      }
      const data = await Notification.findByIdAndUpdate(notificationId3, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Notification.findById(data._id)
      expect(updatedData).toEqual(data)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get first 5 latest Notification', () => {
  test('It should retrieve 5 notifications with descending creation date', async () => {
    try {
      const data = await Notification.find().sort({ createdAt: -1 }).limit(5)
      const dataLength = Object.keys(data).length

      const pastDateFound = Object.values(data).reduce((pastDateFound, notification) => {
        // $FlowFixMe - Turn off property accessed on mixed errors
        return notification.createdAt.toString() === tenDaysAgo.toString()
      }, false)

      expect(dataLength).toBeLessThanOrEqual(5)
      expect(pastDateFound).toBeFalsy()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Validate the Notification Code', () => {
  test('It should be valid', async () => {
    try {
      const notification = await notificationHelper.getNotificationByCode('EQ2')
      expect(notification).toBeTruthy()
    }
    catch(error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Validate the Notification Code', () => {
  test('It should be invalid', async () => {
    try {
      const notification = await notificationHelper.getNotificationByCode('EQ9')
      expect(notification).toBeFalsy()
    }
    catch(error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Validate the recipients in Notification 1 against responses', () => {
  test('It should find recipients who already responded', async () => {
    try {
      const sender = await Recipient.findOne({idNo: recipient.idNo})
      const notification = await notificationHelper.getNotificationByCode('EQ2')
      const duplicateSender = notificationHelper.hasAlreadyResponded(sender, notification)
      expect(duplicateSender).toBeTruthy()
    }
    catch(error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a notification by ID', () => {
  test('It should delete a specific notification', async () => {
    try {
      const data = await Notification.findByIdAndRemove(notificationId1)
      const deletedData = await Notification.findById(data._id)
      expect(deletedData).toBeNull()
    } catch (error) {
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

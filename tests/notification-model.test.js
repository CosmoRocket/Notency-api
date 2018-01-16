/* @flow */
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const Notification = require('../models/Notification')
let recipientId = ''
let notificationId1 = ''
let notificationId2 = ''
let notificationId3 = ''

const recipient = {
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
}

const attributes1 = {
  code: 'EQ1',
  subject: 'Earthquake at Melbourne',
  body: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
}

const attributes2 = {
  code: 'TS1',
  subject: 'Tsunami at Sydney Harbour',
  body: 'This is to inform all Students that there has been a Tsunami at Sydney Harbour. Please reply "TSUNAMI1 OK" if you are safe.',
}

const attributes3 = {
  code: 'FR1',
  subject: 'Terror Attack in France',
  body: 'This is to inform all Students that there has been a Terror Attack in France. Please reply "FRANCETERROR OK" if you are safe.',
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
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create first notification', () => {
  test('It should create a new notification', async() => {
    try {
      const data = await Notification.create(attributes1)
      // Set if of notification to be searched later
      notificationId1 = data._id
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create second notification', () => {
  test('It should create a new notification', async() => {
    try {
      const data = await Notification.create(attributes2)
      // Set if of notification to be searched later
      notificationId2 = data._id
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create third notification', () => {
  test('It should create a new notification', async() => {
    try {
      const data = await Notification.create(attributes3)
      // Set if of notification to be searched later
      notificationId3 = data._id
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
      expect(dataLength).toBeGreaterThan(1) // Should be more than 1 recipient
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

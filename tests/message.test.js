/* @flow */
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
let sender = ''
let messageId = ''
const recipient = {
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
}
const attributes1 = {
  sender: '',
  body: 'Test Message Body 1'
}
const attributes2 = {
  sender: '',
  body: 'Test Message Body 2'
}
const attributes3 = {
  sender: '',
  body: 'Test Message Body 3'
}

beforeAll(async () => {
  console.log('Test started.')
  try {
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
      // Set this recipient as the sender
      sender = data._id
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create first message', () => {
  test('It should create a new message', async () => {
    try {
      attributes1.sender = sender
      const data = await Message.create(attributes1)
      // Set id of first message to be searched later
      messageId = data._id
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create second message', () => {
  test('It should create a new message', async () => {
    try {
      attributes2.sender = sender
      const data = await Message.create(attributes2)
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create third message', () => {
  test('It should create a new message', async () => {
    try {
      attributes3.sender = sender
      const data = await Message.create(attributes3)
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a duplicate message', () => {
  test('It should allow duplicate messages', async () => {
    try {
      attributes1.sender = sender
      const data = await Message.create(attributes1)
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get all messages', () => {
  test('It should get more than one messages', async () => {
    try {
      const data = await Message.find()
      const dataLength = Object.keys(data).length
      expect(dataLength).toBeGreaterThan(1) // Should be more than 1 recipient
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a message by ID', () => {
  test('It should return a specific message', async () => {
    try {
      const data = await Message.findById(messageId)
      expect(data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Update a message', () => {
  test('It should update a specific message', async () => {
    try {
      const attributes = {
        body: 'This is the updated message'
      }
      const data = await Message.findByIdAndUpdate(messageId, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Message.findById(data._id)
      expect(updatedData).toEqual(data)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a recipient by ID', () => {
  test('It should delete a specific recipient', async () => {
    try {
      const data = await Message.findByIdAndRemove(messageId)
      const deletedData = await Message.findById(data._id)
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
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

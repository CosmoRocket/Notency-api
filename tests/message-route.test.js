/* @flow */
const axios = require('axios')
const User = require('../models/User')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const api = axios.create({
  baseURL: 'http://localhost:7001', // Test Server
})

const setToken = token => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
const getToken = () => {
  return api.defaults.headers.common['Authorization'] 
}

let sender
let messageId
const user = {
  username: 'admin',
  password: 'password123'
}
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
  try {
    await User.deleteMany()
    await Recipient.deleteMany()
    console.log('Test started. Data deleted.')
    // Create a User
    while(!getToken()) {
      const response = await api.post('/auth/register', user)
      const token = response.data.token
      if (token) {
        setToken(token)
        console.log('Token created', token)
      }
    }
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

describe('Create a recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const response = await api.post('/recipients', recipient)
      expect(response.status).toBe(201)
      // Set this recipient as the sender
      sender = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a message', () => {
  test('It should create a new message', async () => {
    try {
      attributes1.sender = sender
      const response = await api.post('/messages', attributes1)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      messageId = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a second message', () => {
  test('It should create a new message', async () => {
    try {
      attributes2.sender = sender
      const response = await api.post('/messages', attributes2)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      messageId = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a third message', () => {
  test('It should create a new message', async () => {
    try {
      attributes3.sender = sender
      const response = await api.post('/messages', attributes3)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      messageId = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a duplicate message', () => {
  test('It should allow creation of duplicate messages', async () => {
    try {
      attributes1.sender = sender
      const response = await api.post('/messages', attributes1)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      messageId = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get all messages', () => {
  test('It should get more than one messages', async () => {
    try {
      const response = await api.get('/messages')
      expect(response.status).toBe(200)
      expect(response.data.length).toBeGreaterThan(1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a message by ID', () => {
  test('It should return a specific message', async () => {
    try {
      const response = await api.get(`/messages/${messageId}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(messageId)
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
      const response = await api.patch(`/messages/${messageId}`, attributes)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(messageId)
      expect(response.data.body).toEqual(attributes.body)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a message by ID', () => {
  test('It should delete a specific message', async () => {
    try {
      const response = await api.delete(`/messages/${messageId}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(messageId)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Deleted message should can no longer be queried', () => {
  test('It should not find the deleted message', async () => {
    try {
      const response = await api.get(`/messages/${messageId}`)
      expect('Should catch an error').toBeNull()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.status).toBe(404)
    }
  })
})

afterAll(async () => {
  // Delete all recipient data
  try {
    await Recipient.deleteMany()
    await User.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

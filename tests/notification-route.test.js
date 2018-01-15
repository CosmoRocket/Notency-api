/* @flow */
const axios = require('axios')
const User = require('../models/User')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const Notification = require('../models/Notification')
const api = axios.create({
  baseURL: 'http://localhost:7001', // Test Server
})

const setToken = token => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
const getToken = () => {
  return api.defaults.headers.common['Authorization'] 
}

let recipientId = ''
let notificationId1 = ''
let notificationId2 = ''
let notificationId3 = ''
const user = {
  username: 'admin',
  password: 'password123'
}
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

beforeAll(async () => {
  try {
    await Notification.deleteMany()
    await Recipient.deleteMany()
    await Message.deleteMany()
    await User.deleteMany()
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
      // Set this user as the id to be checked later on
      recipientId = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a notification', () => {
  test('It should create a new notification', async () => {
    try {
      const response = await api.post('/notifications', attributes1)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      notificationId1 = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a second notification', () => {
  test('It should create a new notification', async () => {
    try {
      const response = await api.post('/notifications', attributes2)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      notificationId2 = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a third notification', () => {
  test('It should create a new notification', async () => {
    try {
      const response = await api.post('/notifications', attributes3)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      notificationId3 = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a duplicate notification', () => {
  test('It should note create a duplicated notification', async () => {
    try {
      const response = await api.post('/notifications', attributes1)
      expect(response.status).toBe(400)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.status).toBe(400)
    }
  })
})

describe('Get all notifications', () => {
  test('It should get more than one notifications', async () => {
    try {
      const response = await api.get('/notifications')
      expect(response.status).toBe(200)
      expect(response.data.length).toBeGreaterThan(1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a notification by ID', () => {
  test('It should return a specific notification', async () => {
    try {
      const response = await api.get(`/notifications/${notificationId1}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(notificationId1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Update a notification', () => {
  test('It should update a specific notification', async () => {
    try {
      const attributes = {
        body: 'This is the updated notification'
      }
      const response = await api.patch(`/notifications/${notificationId1}`, attributes)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(notificationId1)
      expect(response.data.body).toEqual(attributes.body)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a notification by ID', () => {
  test('It should delete a specific notification', async () => {
    try {
      const response = await api.delete(`/notifications/${notificationId1}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(notificationId1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a notification by ID', () => {
  test('It should delete a specific notification', async () => {
    try {
      const response = await api.delete(`/notifications/${notificationId1}`)
      expect(response.status).toBe(404)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.status).toBe(404)
    }
  })
})

afterAll(async () => {
  // Delete all recipient data
  try {
    await Message.deleteMany()
    await Recipient.deleteMany()
    await Notification.deleteMany()
    await User.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

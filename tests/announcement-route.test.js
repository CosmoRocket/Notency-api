/* @flow */
const axios = require('axios')
const User = require('../models/User')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const Announcement = require('../models/Announcement')
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
let recipientObj = ''
let announcementId1 = ''
let announcementId2 = ''
let announcementId3 = ''
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
  subject: 'Earthquake at Melbourne',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{name: "nationality", item: "Australia"}],
  recipients: []
}

const attributes2 = {
  subject: 'Tsunami at Sydney Harbour',
  bodyHtml: 'This is to inform all Students that there has been a Tsunami at Sydney Harbour. Please reply "TSUNAMI1 OK" if you are safe.',
  groups: [{name: "nationality", item: "Australia"}],
  recipients: []
}

const attributes3 = {
  subject: 'Terror Attack in France',
  bodyHtml: 'This is to inform all Students that there has been a Terror Attack in France. Please reply "FRANCETERROR OK" if you are safe.',
  groups: [{name: "nationality", item: "France"}],
  recipients: []
}

const attributes4 = {
  subject: 'Test Notification 4',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "France" }],
  recipients: []
}

const attributes5 = {
  subject: 'Test Notification 5',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "Philippines" }],
  recipients: []
}

const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10))

const attributes6 = {
  subject: 'Test Notification 6',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "Hong Kong" }],
  recipients: [],
  createdAt: [tenDaysAgo]
}

const attributes7 = {
  subject: 'Test Notification 7',
  bodyHtml: 'This is a test Notification',
  groups: [{ name: "nationality", item: "Hong Kong" }],
  recipients: [],
  createdAt: tenDaysAgo
}

beforeAll(async () => {
  try {
    await Announcement.deleteMany()
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
      recipientObj = response.data
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes1.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes1)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      announcementId1 = response.data._id
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a second announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes2.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes2)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      announcementId2 = response.data._id
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a third announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes3.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes3)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      announcementId3 = response.data._id
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a fourth announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes4.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes4)
      expect(response.status).toBe(201)
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a fifth announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes5.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes5)
      expect(response.status).toBe(201)
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a sixth announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes6.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes6)
      expect(response.status).toBe(201)
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a seventh announcement', () => {
  test('It should create a new announcement', async () => {
    try {
      attributes7.recipients = [recipientObj]
      const response = await api.post('/announcements', attributes7)
      expect(response.status).toBe(201)
      expect(response.data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get all announcements', () => {
  test('It should get more than one announcementss', async () => {
    try {
      const response = await api.get('/announcements')
      expect(response.status).toBe(200)
      expect(response.data.length).toEqual(7)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a announcement by ID', () => {
  test('It should return a specific announcement', async () => {
    try {
      const response = await api.get(`/announcements/${announcementId1}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(announcementId1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Update a announcement', () => {
  test('It should update a specific announcement', async () => {
    try {
      const attributes = {
        bodyHtml: 'This is the updated announcement'
      }
      const response = await api.patch(`/announcements/${announcementId1}`, attributes)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(announcementId1)
      expect(response.data.bodyHtml).toEqual(attributes.bodyHtml)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get first 5 latest Announcements', () => {
  test('It should retrieve 5 announcements with descending creation date', async () => {
    try {
      const response = await api.get('/announcements/latest/5')
      const data = response.data
      const dataLength = Object.keys(data).length

      const pastDateFound = Object.values(data).reduce((pastDateFound, announcement) => {
        // $FlowFixMe - Turn off property accessed on mixed errors
        return announcement.createdAt.toString() === tenDaysAgo.toString()
      }, false)

      expect(response.status).toBe(200)
      expect(dataLength).toBeLessThanOrEqual(5)
      expect(pastDateFound).toBeFalsy()

    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a announcement by ID', () => {
  test('It should delete a specific announcement', async () => {
    try {
      const response = await api.delete(`/announcements/${announcementId1}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(announcementId1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a announcement by ID', () => {
  test('It should delete a specific announcement', async () => {
    try {
      const response = await api.delete(`/announcements/${announcementId1}`)
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
    await Message.deleteMany()
    await Recipient.deleteMany()
    await Announcement.deleteMany()
    await User.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

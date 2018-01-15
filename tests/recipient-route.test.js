/* @flow */
const axios = require('axios')
const User = require('../models/User')
const Recipient = require('../models/Recipient')
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
const user = {
  username: 'admin',
  password: 'password123'
}
const attributes1 = {
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
}
const attributes2 = {
  idNo: '201812345699',
  firstName: 'Alex',
  lastName: 'Parker',
  mobile: '+61444888001',
  email: 'somone2@example.com',
  nationality: 'Australia'
}
const attributes3 = {
  idNo: '201812345680',
  firstName: 'Ben',
  lastName: 'Blaze',
  mobile: '+61444888002',
  email: 'somone3@example.com',
  nationality: 'Australia'
}

beforeAll(async () => {
  try {
    await User.deleteMany()
    await Recipient.deleteMany()
    console.log('Test started. Data deleted.')
    while(getToken()===undefined) {
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

// describe('Create a user', () => {
//   test('It should create a new user', async () => {
//     try {
//       const response = await api.post('/auth/register', user)
//       expect(response.status).toBe(200)
//       const token = response.data.token 
//       expect(token).not.toBeNull()
//       if (token) setToken(token)
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

describe('Create first recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const response = await api.post('/recipients', attributes1)
      expect(response.status).toBe(201)
      // Set this user as the id to be checked later on
      recipientId = response.data._id
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create second recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const response = await api.post('/recipients', attributes2)
      expect(response.status).toBe(201)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create third recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const response = await api.post('/recipients', attributes3)
      expect(response.status).toBe(201)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a duplicate recipient', () => {
  test('It should not create a duplicate recipient', async () => {
    try {
      const response = await api.post('/recipients', attributes1)
      expect(response.status).toBe(400)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.status).toBe(400)
    }
  })
})

describe('Get all recipients', () => {
  test('It should get more than one recipients', async () => {
    try {
      const response = await api.get('/recipients')
      expect(response.status).toBe(200)
      expect(response.data.length).toBeGreaterThan(1)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a recipient by ID', () => {
  test('It should return a specific recipient', async () => {
    try {
      const response = await api.get(`/recipients/${recipientId}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(recipientId)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Update a recipient', () => {
  test('It should update a specific recipient', async () => {
    try {
      const attributes = {
        firstName: 'Amadeus',
        lastName: 'Cho',
        nationality: 'Philippines'
      }
      const response = await api.patch(`/recipients/${recipientId}`, attributes)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(recipientId)
      expect(response.data.firstName).toEqual(attributes.firstName)
      expect(response.data.lastName).toEqual(attributes.lastName)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Search recipients by nationality', () => {
  test('It should get recipients with the specified nationality', async () => {
    try {
      const attributes = {
        nationality: ['Australia', 'Philippines']
      }
      const response = await api.get('/recipients', attributes)
      expect(response.status).toBe(200)
      expect(response.data.length).toEqual(3)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a recipient by ID', () => {
  test('It should delete a specific recipient', async () => {
    try {
      const response = await api.delete(`/recipients/${recipientId}`)
      expect(response.status).toBe(200)
      expect(response.data._id).toEqual(recipientId)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Deleted recipient should can no longer be queried', () => {
  test('It should not find the deleted recipient', async () => {
    try {
      const response = await api.get(`/recipients/${recipientId}`)
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
    await Recipient.deleteMany()
    await User.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

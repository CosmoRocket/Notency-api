/* @flow */
const axios = require('axios')
const FormData = require('form-data')
const User = require('../models/User')
// const Util = require('util')
const FS = require('fs')

// const readFilePromise = Util.promisify(FS.readFile)

const api = axios.create({
  baseURL: 'http://localhost:7001', // Test Server
})

const setToken = token => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
const getToken = () => {
  return api.defaults.headers.common['Authorization']
}

const user = {
  username: 'admin',
  password: 'password123'
}

beforeAll(async () => {
  try {
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

describe('Upload an empty form', () => {
  test('It should not upload a file', async () => {
    try {
      const formData = new FormData()
      formData.append('csvFile', FS.createReadStream('./tests/sample.csv'))
      const response = await api.post('/upload', formData, {
        headers: formData.getHeaders()
      })
      expect('It should catch an error').toBeNull()
    }
    catch (error) {
      expect(error.response.status).toBe(400)
    }
  })
})

afterAll(async () => {
  // Delete all recipient data
  try {
    await User.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

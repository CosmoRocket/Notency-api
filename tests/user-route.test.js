/* @flow */
const axios = require('axios')
const User = require('../models/User')
const api = axios.create({
  baseURL: 'http://localhost:7001', // Test Server
})

const attributes1 = {
  username: 'admin',
  password: 'password1'
}
const attributes2 = {
  username: 'admin2',
  password: 'password2'
}
const attributes3 = {
  username: 'admin3',
  password: 'password3'
}

beforeAll(async () => {
  try {
    await User.deleteMany()
    console.log('Test started. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

describe('Create a user', () => {
  test('It should create a new user', async () => {
    try {
      const response = await api.post('/auth/register', attributes1)
      expect(response.status).toBe(200)
      expect(response.data.token).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a second user', () => {
  test('It should create a new user', async () => {
    try {
      const response = await api.post('/auth/register', attributes2)
      expect(response.status).toBe(200)
      expect(response.data.token).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a third user', () => {
  test('It should create a new user', async () => {
    try {
      const response = await api.post('/auth/register', attributes3)
      expect(response.status).toBe(200)
      expect(response.data.token).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a duplicate user', () => {
  test('It should not create a duplicate user', async () => {
    try {
      const response = await api.post('/auth/register', attributes1)
      // expect(response.status).toBe(200)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toEqual('A user with the given username is already registered')
    }
  })
})

describe('Login the user', () => {
  test('It should produce a valid token', async () => {
    try {
      const response = await api.post('/auth', attributes1)
      expect(response.status).toBe(200)
      expect(response.data.token).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Login an invalid user', () => {
  test('It should not allow the user to login', async () => {
    try {
      const response = await api.post('/auth', { username: 'user', password: 'pass'} )
      // expect(response.status).toBe(401)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.status).toBe(401)
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

/* @flow */
const Recipient = require('../models/Recipient')
let id = null
const attributes1 = {
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  role: 'Student',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
}
const attributes2 = {
  idNo: '201812345679',
  firstName: 'Alex',
  lastName: 'Parker',
  role: 'Student',
  mobile: '+61444888001',
  email: 'somone2@example.com',
  nationality: 'Australia'
}
const attributes3 = {
  idNo: '201812345680',
  firstName: 'Ben',
  lastName: 'Blaze',
  role: 'Student',
  mobile: '+61444888002',
  email: 'somone3@example.com',
  nationality: 'Australia'
}

beforeAll(async () => {
  console.log('Test started.')
  try {
    await Recipient.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

describe('Create first recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const data = await Recipient.create(attributes1)
      // Set id of first recipient to be searched later
      id = data._id
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create second recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const data = await Recipient.create(attributes2)
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create third recipient', () => {
  test('It should create a new recipient', async () => {
    try {
      const data = await Recipient.create(attributes3)
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create a duplicate recipient', () => {
  test('It should not create a duplicate recipient', async () => {
    let errorFound = false
    try {
      const data = await Recipient.create(attributes3)
    } catch (error) {
      errorFound = true
    }
    expect(errorFound).toBeTruthy()
  })
})

describe('Get all recipients', () => {
  test('It should get more than one recipients', async () => {
    try {
      const data = await Recipient.find()
      const dataLength = Object.keys(data).length
      expect(dataLength).toBeGreaterThan(1) // Should be more than 1 recipient
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a recipient by ID', () => {
  test('It should return a specific recipient', async () => {
    try {
      const data = await Recipient.findById(id)
      expect(data).not.toBeNull()
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
      const data = await Recipient.findByIdAndUpdate(id, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Recipient.findById(data._id)
      expect(updatedData).toEqual(data)
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
      const data = await Recipient.find({nationality: attributes.nationality})
      expect(data).not.toBeNull()
      expect(data.length).toEqual(3)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a recipient by ID', () => {
  test('It should delete a specific recipient', async () => {
    try {
      const data = await Recipient.findByIdAndRemove(id)
      const deletedData = await Recipient.findById(data._id)
      expect(deletedData).toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

afterAll(async () => {
  console.log('Test started.')
  try {
    await Recipient.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

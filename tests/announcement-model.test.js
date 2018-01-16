/* @flow */
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const Announcement = require('../models/Announcement')
let recipientObj = ''
let announcementId1 = ''
let announcementId2 = ''
let announcementId3 = ''

const recipient = {
  idNo: '201812345678',
  firstName: 'John',
  lastName: 'Smith',
  mobile: '+61444888000',
  email: 'somone@example.com',
  nationality: 'Australia'
}

const attributes1 = {
  subject: 'Earthquake at Melbourne',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: 'Australia',
  recipients: []
}

const attributes2 = {
  subject: 'Tsunami at Sydney Harbour',
  bodyHtml: 'This is to inform all Students that there has been a Tsunami at Sydney Harbour. Please reply "TSUNAMI1 OK" if you are safe.',
  groups: 'Australia',
  recipients: []
}

const attributes3 = {
  subject: 'Terror Attack in France',
  bodyHtml: 'This is to inform all Students that there has been a Terror Attack in France. Please reply "FRANCETERROR OK" if you are safe.',
  groups: 'France',
  recipients: []
}

beforeAll(async () => {
  console.log('Test started.')
  try {
    await Announcement.deleteMany()
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
      // Set recipient to be searched later
      recipientObj = data
      expect(data._id).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create first announcement', () => {
  test('It should create a new announcement', async() => {
    try {
      attributes1.recipients = [recipientObj]
      const data = await Announcement.create(attributes1)
      // Set if of Announcement to be searched later
      announcementId1 = data._id
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create second announcement', () => {
  test('It should create a new announcement', async() => {
    try {
      attributes2.recipients = [recipientObj]
      const data = await Announcement.create(attributes2)
      // Set if of Announcement to be searched later
      announcementId2 = data._id
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Create third announcement', () => {
  test('It should create a new announcement', async() => {
    try {
      attributes3.recipients = [recipientObj]
      const data = await Announcement.create(attributes3)
      // Set if of Announcement to be searched later
      announcementId3 = data._id
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get all announcements', () => {
  test('It should get more than one announcements', async () => {
    try {
      const data = await Announcement.find()
      const dataLength = Object.keys(data).length
      expect(dataLength).toBeGreaterThan(1) // Should be more than 1 recipient
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Get a Announcement by ID', () => {
  test('It should return a specific announcement', async () => {
    try {
      const data = await Announcement.findById(announcementId1)
      expect(data).not.toBeNull()
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Update a announcement', () => {
  test('It should update a specific announcement', async () => {
    try {
      const attributes = {
        code: 'EQ2',
        subject: '2nd Earthquake at Melbourne',
        body: 'This is to inform all Students that there has been a 2nd Earthquake at Melbourne. Please reply "EARTHQUAKE2 OK" if you are safe.',
      }
      const data = await Announcement.findByIdAndUpdate(announcementId1, attributes, {
        new: true,
        runValidators: true
      })
      const updatedData = await Announcement.findById(data._id)
      expect(updatedData).toEqual(data)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Delete a Announcement by ID', () => {
  test('It should delete a specific announcement', async () => {
    try {
      const data = await Announcement.findByIdAndRemove(announcementId1)
      const deletedData = await Announcement.findById(data._id)
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
    await Announcement.deleteMany()
    console.log('Test ended. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

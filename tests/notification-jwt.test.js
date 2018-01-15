// In progress

// TODO: -- Have notification routes to create array of responses (i.e. similar to Yarra products wishlist)

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
  if (token) {
    // Set the authorization for all requests in the future
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  else {
    delete api.defaults.headers.common['Authorization']
  }
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
  try {
    await Notification.deleteMany()
    await Recipient.deleteMany()
    await Message.deleteMany()
    await User.deleteMany()
    console.log('Test started. Data deleted.')
  } catch (error) {
    console.error('Error deleting data', error)
  }
})

describe('Create a user', () => {
  test('It should create a new user', async () => {
    try {
      const response = await api.post('/auth/register', user)
      expect(response.status).toBe(200)
      const token = response.data.token 
      expect(token).not.toBeNull()
      if (token) setToken(token)
    } catch (error) {
      expect(error).toBeFalsy()
    }
  })
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

// describe('Create a message', () => {
//   test('It should create a new message', async () => {
//     try {
//       attributes1.recipientId = recipientId
//       const response = await api.post('/messages', attributes1)
//       expect(response.status).toBe(201)
//       // Set this user as the id to be checked later on
//       messageId = response.data._id
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

// describe('Create a second message', () => {
//   test('It should create a new message', async () => {
//     try {
//       attributes2.recipientId = recipientId
//       const response = await api.post('/messages', attributes2)
//       expect(response.status).toBe(201)
//       // Set this user as the id to be checked later on
//       messageId = response.data._id
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

// describe('Create a third message', () => {
//   test('It should create a new message', async () => {
//     try {
//       attributes3.recipientId = recipientId
//       const response = await api.post('/messages', attributes3)
//       expect(response.status).toBe(201)
//       // Set this user as the id to be checked later on
//       messageId = response.data._id
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

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

describe('Send a response to Notification 1', () => {
  test('It should append the response to notification', async () => {
    try {
      const sms = {
        ToCountry: 'AU',
        ToState: '',
        SmsMessageSid: 'SMdb07337513b4f2d7933eda58eaffd0d6',
        NumMedia: '0',
        ToCity: '',
        FromZip: '',
        SmsSid: 'SMdb07337513b4f2d7933eda58eaffd0d6',
        FromState: '',
        SmsStatus: 'received',
        FromCity: '',
        Body: 'EQ2 OK',
        FromCountry: 'AU',
        To: '+61448032193',
        ToZip: '',
        NumSegments: '1',
        MessageSid: 'SMdb07337513b4f2d7933eda58eaffd0d6',
        AccountSid: 'AC22458b497113eec0a935a684af68ab28',
        From: '+61444888000',
        ApiVersion: '2010-04-01'
      }

      const response = await api.patch('/notifications/receiveSMS', sms)
      expect(response.status).toBe(200)
    }
    catch (error) {
      console.error(error)
      expect(error).toBeFalsy()
    }
  })
})
// describe('Create response message for Notification 1', () => {
//   test('It should create a message and add the response to Notification 1', async () => {
//     try {
//       // Create response
//       attributes1.recipientId = recipientId
//       const messageRes = await api.post('/messages', attributes1)
//       expect(messageRes.status).toBe(201)

//       // Link the response to notification
//       const attributes = {
//         responses: [messageRes.data]
//       }
//       const notificationRes = await api.patch(`/notifications/${notificationId1}`, attributes)
//       expect(notificationRes.status).toBe(200)
//       expect(notificationRes.data._id).toEqual(notificationId1)
//       expect(notificationRes.data.body).toEqual(attributes.responses)
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

// describe('Create response message for Notification 1', () => {
//   test('It should create a new message', async () => {
//     try {
//       response1.sender = recipientId
//       const msg = await Message.create(response1)
//       // Set id of first message to be searched later
//       const messageId = msg._id
//       const attributes = {
//         responses: [messageId]
//       }
//       const data = await Notification.findByIdAndUpdate(notificationId1, attributes, {
//         new: true,
//         runValidators: true
//       })
//       const updatedData = await Notification.findById(data._id)
//       expect(updatedData).toEqual(data)
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

// describe('Create response message for Notification 2', () => {
//   test('It should create a new message', async () => {
//     try {
//       response2.sender = recipientId
//       const msg = await Message.create(response2)
//       // Set id of first message to be searched later
//       const messageId = msg._id
//       const attributes = {
//         responses: [messageId]
//       }
//       const data = await Notification.findByIdAndUpdate(notificationId2, attributes, {
//         new: true,
//         runValidators: true
//       })
//       const updatedData = await Notification.findById(data._id)
//       expect(updatedData).toEqual(data)
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

// describe('Create response message for Notification 3', () => {
//   test('It should create a new message', async () => {
//     try {
//       response3.sender = recipientId
//       const msg = await Message.create(response3)
//       // Set id of first message to be searched later
//       const messageId = msg._id
//       const attributes = {
//         responses: [messageId]
//       }
//       const data = await Notification.findByIdAndUpdate(notificationId3, attributes, {
//         new: true,
//         runValidators: true
//       })
//       const updatedData = await Notification.findById(data._id)
//       expect(updatedData).toEqual(data)
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

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

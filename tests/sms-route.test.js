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

describe('Send a valid OK response to Notification 1', () => {
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

      const response = await api.patch('/sms/receive', sms)
      expect(response.status).toBe(200)
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Send an invalid response to Notification 1', () => {
  test('It should throw an Invalid response message error', async () => {
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
        Body: 'EQ2OK',
        FromCountry: 'AU',
        To: '+61448032193',
        ToZip: '',
        NumSegments: '1',
        MessageSid: 'SMdb07337513b4f2d7933eda58eaffd0d6',
        AccountSid: 'AC22458b497113eec0a935a684af68ab28',
        From: '+61444888000',
        ApiVersion: '2010-04-01'
      }

      const response = await api.patch('/sms/receive', sms)
      expect(response.status).toBe(200)
    }
    catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toBe('Invalid response message')
    }
  })
})

describe('Send a valid Not OK response to Notification 1', () => {
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
        Body: 'EQ2 I need help',
        FromCountry: 'AU',
        To: '+61448032193',
        ToZip: '',
        NumSegments: '1',
        MessageSid: 'SMdb07337513b4f2d7933eda58eaffd0d6',
        AccountSid: 'AC22458b497113eec0a935a684af68ab28',
        From: '+61444888000',
        ApiVersion: '2010-04-01'
      }

      const response = await api.patch('/sms/receive', sms)
      expect(response.status).toBe(200)
    }
    catch (error) {
      expect(error).toBeFalsy()
    }
  })
})

describe('Send an invalid Not OK response to Notification 1', () => {
  test('It should throw an Invalid response message error', async () => {
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
        Body: 'I need help',
        FromCountry: 'AU',
        To: '+61448032193',
        ToZip: '',
        NumSegments: '1',
        MessageSid: 'SMdb07337513b4f2d7933eda58eaffd0d6',
        AccountSid: 'AC22458b497113eec0a935a684af68ab28',
        From: '+61444888000',
        ApiVersion: '2010-04-01'
      }

      const response = await api.patch('/sms/receive', sms)
      expect(response.status).toBe(200)
    }
    catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toBe('Invalid response message')
    }
  })
})

// describe('Send a SMS message', () => {
//   test('It should send a text message', async () => {
//     try {
//       const attributes = {
//         recipient: "+61456360647",
//         message: "This is a test announcement!!"
//       }
//       const response = await api.post('/sms/send', attributes)
//       expect(response.data.error.message).toBeNull()
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

describe('Send a SMS message with unverified number', () => {
  test('It should not send a text message', async () => {
    try {
      const attributes = {
        recipient: '+61456360647',
        message: 'This is a test announcement!!'
      }
      const response = await api.post('/sms/send', attributes)
    } catch (error) {
      expect(error.message).toEqual('The number +61456360647 is unverified. Trial accounts cannot send messages to unverified numbers; verify +61456360647 at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers.')
    }
  })
})

describe('Send a SMS message with empty recipient', () => {
  test('It should not send a text message', async () => {
    try {
      const attributes = {
        recipient: '',
        message: 'This is a test announcement!!'
      }
      const response = await api.post('/sms/send', attributes)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toEqual('Invalid SMS')
    }
  })
})

describe('Send a SMS message with empty body', () => {
  test('It should not send a text message', async () => {
    try {
      const attributes = {
        recipient: '+61456360647',
        message: ''
      }
      const response = await api.post('/sms/send', attributes)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toEqual('Invalid SMS')
    }
  })
})

describe('Send a SMS message with empty body and recipient', () => {
  test('It should not send a text message', async () => {
    try {
      const attributes = {
        recipient: '',
        message: ''
      }
      const response = await api.post('/sms/send', attributes)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.message).toEqual('Invalid SMS')
    }
  })
})

describe('Send a Group SMS message with unverified numbers', () => {
  test('It should not send a text message', async () => {
    try {
      const attributes = {
        recipients: ['+61456360647','+61456360648','+61456360649'],
        message: 'This is a test announcement!!'
      }
      const response = await api.post('/sms/groupSend', attributes)
      expect(response.status).toBe(201)
      expect(response.data.failed.length).toEqual(3)
    } catch (error) {
      expect(error).toBeFalsy()
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
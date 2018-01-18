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
  password: 'password1'
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
  code: 'EQ1',
  subject: 'Earthquake at Melbourne',
  body: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{ name: "nationality", item: "Australia" }]
}

const attributes2 = {
  code: 'TS1',
  subject: 'Tsunami at Sydney Harbour',
  body: 'This is to inform all Students that there has been a Tsunami at Sydney Harbour. Please reply "TSUNAMI1 OK" if you are safe.',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{ name: "nationality", item: "Australia" }]
}

const attributes3 = {
  code: 'FR1',
  subject: 'Terror Attack in France',
  body: 'This is to inform all Students that there has been a Terror Attack in France. Please reply "FRANCETERROR OK" if you are safe.',
  bodyHtml: 'This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.',
  groups: [{ name: "nationality", item: "Australia" }]
}

beforeAll(async () => {
  try {
    await Notification.deleteMany()
    await Recipient.deleteMany()
    await Message.deleteMany()
    await User.deleteMany()
    console.log('Test started. Data deleted.')
    // Create a User
    while (!getToken()) {
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

describe('Send a valid OK response to Notification 1', () => {
  test('It should append the response to notification', async () => {
    try {
      const email = {
        'sender': 'somone@example.com',
        'subject': 'Re: Hello',
        'stripped-text': 'EQ1 OK'
      }

      const response = await api.post('/email/receive', email)
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
      const email = {
        'sender': 'somone@example.com',
        'subject': 'Re: Hello',
        'stripped-text': 'EQ1OK'
      }

      const response = await api.post('/email/receive', email)
      expect('Should catch an error').toBeNull()
    }
    catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual('Invalid response message')
    }
  })
})

describe('Send a valid Not OK response to Notification 1', () => {
  test('It should append the response to notification', async () => {
    try {
      const email = {
        'sender': 'somone@example.com',
        'subject': 'Re: Hello',
        'stripped-text': 'EQ1 I need help'
      }

      const response = await api.post('/email/receive', email)
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
      const email = {
        'sender': 'somone@example.com',
        'subject': 'Re: Hello',
        'stripped-text': 'I need help'
      }

      const response = await api.post('/email/receive', email)
      expect('Should catch an error').toBeNull()
    }
    catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual('Invalid response message')
    }
  })
})

describe('Send with an invalid sender', () => {
  test('It should throw an Invalid response message error', async () => {
    try {
      const email = {
        'sender': 'somoneelse@example.com',
        'subject': 'Re: Hello',
        'stripped-text': 'EQ1 OK'
      }

      const response = await api.post('/email/receive', email)
      expect('Should catch an error').toBeNull()
    }
    catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual('Invalid sender')
    }
  })
})

describe('Send with an invalid notification code', () => {
  test('It should throw an Invalid response message error', async () => {
    try {
      const email = {
        'sender': 'somone@example.com',
        'subject': 'Re: Hello',
        'stripped-text': 'EQ5 OK'
      }

      const response = await api.post('/email/receive', email)
      expect('Should catch an error').toBeNull()
    }
    catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual('Invalid notification code')
    }
  })
})

// describe.only('Send an Email message', () => {
//   test('It should send an email message', async () => {
//     try {
//       const attributes = {
//         recipients: ["xxxxx@gmail.com"],
//         subject: "Hello",
//         text: "Testing some Mailgun awesomness!",
//         html: "<h1>Testing some Mailgun awesomness!</h1>"
//       }
//       const response = await api.post('/email/send', attributes)
//       expect(response.data.message).toEqual('Queued. Thank you.')
//     } catch (error) {
//       expect(error).toBeFalsy()
//     }
//   })
// })

describe('Send an Email message with unverified email', () => {
  test('It should not send an email message', async () => {
    try {
      const attributes = {
        recipients: ["somone@example.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
        html: "<h1>Testing some Mailgun awesomness!</h1>"
      }
      const response = await api.post('/email/send', attributes)
      expect('Should catch an error').toBeNull()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual('Sandbox subdomains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account Settings.')
    }
  })
})

describe('Send an Email message with empty message', () => {
  test('It should not send an email message', async () => {
    try {
      const attributes = {
        recipients: ["somone@example.com"],
        subject: "Hello",
        text: "",
        html: ""
      }
      const response = await api.post('/email/send', attributes)
      expect('Should catch an error').toBeNull()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual("Need at least one of 'text' or 'html' parameters specified")
    }
  })
})

describe('Send an Email message with empty recipient', () => {
  test('It should not send an email message', async () => {
    try {
      const attributes = {
        recipients: [],
        subject: "Hello",
        text: "Test",
        html: "Test"
      }
      const response = await api.post('/email/send', attributes)
      expect('Should catch an error').toBeNull()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual("'to' parameter is missing")
    }
  })
})

describe('Send an Email message with empty array', () => {
  test('It should not send an email message', async () => {
    try {
      const attributes = {
        recipients: "",
        subject: "Hello",
        text: "Test",
        html: "Test"
      }
      const response = await api.post('/email/send', attributes)
      expect('Should catch an error').toBeNull()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual("'to' parameter is not a valid address. please check documentation")
    }
  })
})

describe('Send a Group Email message with unverified email', () => {
  test('It should not send a text message', async () => {
    try {
      const attributes = {
        recipients: ["someone@example.com","someone2@example.com","someone3@example.com"],
        subject: "Hello",
        text: "Test",
        html: "Test"
      }
      const response = await api.post('/email/send', attributes)
      expect('Should catch an error').toBeNull()
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.response.data).toEqual('Sandbox subdomains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account Settings.')
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

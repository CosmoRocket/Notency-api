/* @flow */
const twilio = require('twilio')

/* Twilio Credentials */
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_NUMBER = process.env.TWILIO_NUMBER

// Send SMS Messages directly using a Twilio Number
// $FlowFixMe - Turn off type annotations
const sendSMS = (to, body) => (
  // $FlowFixMe - Turn off type annotations
  new Promise((success, fail) => {
    if (!to || !body) throw new Error('Invalid SMS')
    else {
      // Create new twilio client
      const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
      // Send the text message.
      client.messages.create(
        {
          to, // Recipient's number
          from: TWILIO_NUMBER, // Twilio Number
          body // Message to Recipient
        },
        (error, message) => {
          if (error) {
            fail(error)
          } else {
            success({ to, body })
          }
        }
      )
    }
  })
)

// Send Group SMS Messages
// $FlowFixMe - Turn off type annotations
const sendGroupSMS = (numbers, body) => (
  // $FlowFixMe - Turn off type annotations
  new Promise((success, fail) => {
    const delivered = [] // List of numbers in which message is delivered successfully
    const failed = [] // List of numbers in which message failed delivery
    Promise.all(
      // For every recipient phone number
      numbers.map(to => {
        return sendSMS(to, body) // Optional: Can be changed to sendSMSUsingCopilot if using Co-pilot
          .then(success => {
            delivered.push(to) // Message is delivered
          })
          .catch(error => {
            failed.push(to) // Message not sent
          })
      })
    ).then(results => {
      // Return the message sent, the numbers delivered to and the numbers which failed
      success({ body, delivered, failed })
    })
  })
)

module.exports = {
  sendSMS,
  sendGroupSMS
}
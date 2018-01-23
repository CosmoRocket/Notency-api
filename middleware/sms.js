/* @flow */
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')
const notificationHelper = require('../helper/notification-helper')
const twilio = require('./twilio')
const pusher = require('./pusher')

/*
*  Receive SMS message
*/
// $FlowFixMe - Turn off type annotations
const receiveSms = async (req, res) => {
  try {
    // Get the JSON
    const attributes = req.body
    const mobile = attributes.From
    const body = attributes.Body

    // Get Sender as a Recipient using a Mobile number
    const sender = await Recipient.findOne({ mobile: mobile })
    // Check if Sender is a valid Recipient
    if (!sender) throw new Error('Invalid sender')
    else {
      // Create a Message based on the JSON
      const messageAttribute = {
        sender: sender,
        body: body
      }
      // Parse code from message body
      const code = messageParser.isValidResponse(body)
        ? messageParser.parseCodeFromMessage(body)
        : ''
      if (!code) throw new Error('Invalid response message')
      else {
        // Get the notification by code
        const notification = await notificationHelper.getNotificationByCode(code)
        // Check if notification code is invalid
        if (!!notification) {
          // Check if the sender has already responded to the Notification
          if (!notificationHelper.hasAlreadyResponded(sender, notification)) {
            // Create the response as a Message object
            const responseMessage = await Message.create(messageAttribute)
            // Update the notification and append the response
            const notification = await notificationHelper.addResponseToNotification(code, responseMessage)
            // Create message
            const pushMsg = `${mobile}: ${body}`
            // Send message to pusher service
            await pusher.pushMessage(pushMsg, 'notency-channel', 'notency-receive-response')
            // Response ok
            res.status(200).json(notification)
          }
          else {
            throw new Error('Sender has already responded to this notification')
          }
        }
        else {
          throw new Error('Notification code is invalid')
        }
      }
    }
  } catch (error) {
    if (error.message.includes('E11000')) {
      res.status(400).json('Code has already been used. Please enter a unique 3-digit code')
    }
    else {
      res.status(400).json(error.message)
    }
  }
}

/*
*  Send SMS message
*/
// $FlowFixMe - Turn off type annotations
const sendSms = async (req, res) => {
  try {
    const attributes = req.body
    const data = await twilio.sendSMS(attributes.recipient, attributes.message)
    res.status(201).json(data)
  }
  catch (error) {
    res.status(400).json(error.message)
  }
}

/*
*  Send SMS message
*/
// $FlowFixMe - Turn off type annotations
const sendGroupSms = async (req, res) => {
  try {
    const attributes = req.body
    const data = await twilio.sendGroupSMS(attributes.recipients, attributes.message)
    res.status(201).json(data)
  }
  catch (error) {
    res.status(400).json(error.message)
  }
}

module.exports = {
  receiveSms,
  sendSms,
  sendGroupSms
}
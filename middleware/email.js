/* @flow */
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')
const notificationHelper = require('../helper/notification-helper')
const mailgun = require('./mailgun')
const pusher = require('./pusher')

/*
*  Receive E-mail message
*/
// $FlowFixMe - Turn off type annotations
const receiveEmail = async (req, res) => {
  try {
    // Get the JSON
    const attributes = req.body
    const email = attributes.sender
    const subject = attributes.subject
    const body = attributes['stripped-text']

    // Get Sender as a Recipient using a Mobile number
    const sender = await Recipient.findOne({ email: email })
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
        // Check if the code is a valid code
        const notification = await notificationHelper.getNotificationByCode(
          code
        )
        if (!!notification) {
          // Check if the sender has already responded to the Notification
          if (!notificationHelper.hasAlreadyResponded(sender, notification)) {
            // Create the response as a Message object
            const responseMessage = await Message.create(messageAttribute)
            // Update the notification and append the response
            const notification = await notificationHelper.addResponseToNotification(code, responseMessage)
            // Check if notification was successfully updated
            if (!notification) throw new Error('Notification code is invalid')
            else {
              // Create message
              const pushMsg = `${mobile}: ${body}`
              // Send message to pusher service
              await pusher.pushMessage(pushMsg, code, 'notency-receive-response')
              // Response ok
              res.status(200).json(notification)
            }
          } else {
            throw new Error('Sender has already responded to this notification')
          }
        } else {
          throw new Error('Notification code is invalid')
        }
      }
    }
  } catch (error) {
    res.status(400).json(error.message)
  }
}

/*
*  Send E-mail message
*/
// $FlowFixMe - Turn off type annotations
const sendEmail = async (req, res) => {
  try {
    const attributes = req.body
    const attachment = req.file
    const data = await mailgun.sendEmail(
      attributes.recipients,
      attributes.subject,
      attributes.text,
      attributes.html,
      attachment
    )
    res.status(201).json(data)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

module.exports = {
  receiveEmail,
  sendEmail
}

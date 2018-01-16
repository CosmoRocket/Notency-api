/* @flow */
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')
const mailgun = require('./mailgun')

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
        // Create the response as a Message object
        const responseMessage = await Message.create(messageAttribute)

        // Update the notification and append the response
        const notification = await Notification.findOneAndUpdate(
          { code: code },
          { $addToSet: { responses: responseMessage } },
          { upsert: false, new: true, runValidators: true }
        ).populate({
          path: 'responses',
          populate: {
            path: 'sender',
            model: 'Recipient'
          }
        })
        if (!notification) throw new Error('Invalid notification code')
        else res.status(200).json(notification)
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
    const data = await mailgun.sendEmail(attributes.recipients, attributes.subject, attributes.text, attributes.html)
    res.status(201).json(data)
  }
  catch (error) {
    res.status(400).json(error.message)
  }
}

module.exports = {
  receiveEmail,
  sendEmail
}
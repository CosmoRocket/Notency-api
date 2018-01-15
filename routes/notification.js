const express = require('express')
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// PATCH - Add responses to notification
router.patch('/notifications/receiveSMS', (req, res) => {
  // Get the JSON
  const attributes = req.body
  const mobile = attributes.From
  const body = attributes.Body

  // Get Sender as a Recipient using a Mobile number
  Recipient.findOne({ mobile: mobile })
    .then(sender => {
      // console.log('sender', sender)

      // Create a Message based on the JSON
      const messageAttribute = {
        sender: sender,
        body: body
      }
      let code = ''
      // TODO: Parse message if it's an OK message
      // TODO: Parse code from message body
      if( messageParser.isValidResponse(body) ) {
        code = messageParser.parseCodeFromMessage(body)
        ok = messageParser.isOkMessage(body)
      }
      else {
        throw new Error('Invalid response message')
      }      

      Message.create(messageAttribute)
        .then(responseMessage => {
          // console.log('responseMessage', responseMessage)
          // console.log('Update Notification')

          // Update the notification and append the response
          Notification.findOneAndUpdate(
            { code: code },
            { $addToSet: { responses: responseMessage } },
            { upsert: true, new: true, runValidators: true }
          )
            .populate({
              path: 'responses',
              populate: {
                path: 'sender',
                model: 'Recipient'
              }
            })
            .then(notification => {
              // console.log('notification', notification)
              // console.log('notification.responses[0].sender', notification.responses[0].sender)

              res.status(200).json(notification)
            })
            .catch(error => {
              // console.error(error)
              res.status(400).json({ error })
            })
        })
        .catch(error => {
          // console.error(error)
          res.status(400).json({ error })
        })
    })
    .catch(error => {
      // console.error(error)
      res.status(400).json({ error })
    })
})

// GET - Read all notifications
router.get('/notifications', authMiddleware.requireJWT, (req, res) => {
  Notification.find()
    .then(notifications => {
      res.json(notifications)
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

// GET - Read an individual notification document
router.get('/notifications/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Notification.findById(id)
    .then(notification => {
      if (notification) {
        res.json(notification)
      } else {
        res.status(404).json({ error: `Notification not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

// POST - Create a new notification document
router.post('/notifications', authMiddleware.requireJWT, (req, res) => {
  const attributes = req.body
  Notification.create(attributes)
    .then(notification => {
      res.status(201).json(notification)
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// PATCH - Update a notification document
router.patch('/notifications/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  const attributes = req.body
  Notification.findByIdAndUpdate(id, attributes, {
    new: true,
    runValidators: true
  })
    .then(notification => {
      if (notification) {
        res.status(200).json(notification)
      } else {
        res.status(404).json({ error: `Notification not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// DELETE - Destroy a notification document
router.delete('/notifications/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Notification.findByIdAndRemove(id)
    .then(notification => {
      if (notification) {
        res.status(200).json(notification)
      } else {
        res.status(404).json({ error: `Notification not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

module.exports = router

/* @flow */
const express = require('express')
const Notification = require('../models/Notification')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// GET - Get latest X notifications
router.get('/notifications/latest/:limit', authMiddleware.requireJWT, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit)
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(limit).populate({
      path: 'responses',
      populate: {
        path: 'sender',
        model: 'Recipient'
      }
    })
    res.json(notifications)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET - Read all notifications
router.get('/notifications', authMiddleware.requireJWT, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate({
        path: 'responses',
        populate: {
          path: 'sender',
          model: 'Recipient'
        }
      })
    res.json(notifications)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET - Read an individual notification document
router.get('/notifications/:id', authMiddleware.requireJWT, async (req, res) => {
  try {
    const id = req.params.id
    const notification = await Notification.findById(id).populate({
      path: 'responses',
      populate: {
        path: 'sender',
        model: 'Recipient'
      }
    })
    if (notification) {
      res.json(notification)
    } else {
      res.status(404).json({ error: `Notification not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST - Create a new notification document
router.post('/notifications', authMiddleware.requireJWT, async (req, res) => {
  try {
    const attributes = req.body
    const notification = await Notification.create(attributes)
    res.status(201).json(notification)
  }
  catch (error) {
    console.error('error', error)
    res.status(400).json({ error: error })
  }
})

// PATCH - Update a notification document
router.patch('/notifications/:id', authMiddleware.requireJWT, async (req, res) => {
  try {
    const id = req.params.id
    const attributes = req.body
    const notification = await Notification.findByIdAndUpdate(id, attributes, {
      new: true,
      runValidators: true
    })
      .populate({
        path: 'responses',
        populate: {
          path: 'sender',
          model: 'Recipient'
        }
      })
    if (notification) {
      res.status(200).json(notification)
    } else {
      res.status(404).json({ error: `Notification not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

// DELETE - Destroy a notification document
router.delete('/notifications/:id', authMiddleware.requireJWT, async (req, res) => {
  try {
    const id = req.params.id
    const notification = await Notification.findByIdAndRemove(id)
    if (notification) {
      res.status(200).json(notification)
    } else {
      res.status(404).json({ error: `Notification not found with id: ${id}` })
    }

  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

module.exports = router

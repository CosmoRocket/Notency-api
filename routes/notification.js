/* @flow */
const express = require('express')
const Notification = require('../models/Notification')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// GET - Get latest X notifications
router.get('/notifications/latest/:limit', authMiddleware.requireJWT, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit)
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(limit)
    res.json(notifications)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
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

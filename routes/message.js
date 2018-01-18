/* @flow */
const express = require('express')
const Message = require('../models/Message')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// GET - Read all messages
router.get('/messages', authMiddleware.requireJWT, async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET - Read an individual message document
router.get('/messages/:id', authMiddleware.requireJWT, async (req, res) => {
  try {
    const id = req.params.id
    const message = await Message.findById(id)
    if (message) {
      res.json(message)
    }
    else {
      res.status(404).json({ error: `Message not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST - Create a new message document
router.post('/messages', authMiddleware.requireJWT, async (req, res) => {
  try {
    const attributes = req.body
    const message = await Message.create(attributes)
    res.status(201).json(message)
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

// PATCH - Update a message document
router.patch('/messages/:id', authMiddleware.requireJWT, async (req, res) => {
  try {
    const id = req.params.id
    const attributes = req.body
    const message = await Message.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })
    if (message) {
      res.status(200).json(message)
    }
    else {
      res.status(404).json({ error: `Message not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

// DELETE - Destroy a message document
router.delete('/messages/:id', authMiddleware.requireJWT, async (req, res) => {
  try {
    const id = req.params.id
    const message = await Message.findByIdAndRemove(id)
    if (message) {
      res.status(200).json(message)
    }
    else {
      res.status(404).json({ error: `Message not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

module.exports = router
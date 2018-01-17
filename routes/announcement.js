const express = require('express')
const Announcement = require('../models/Announcement')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// GET - Get latest X announcements
router.get('/announcements/latest/:limit', authMiddleware.requireJWT, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit)
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(limit)
    res.json(announcements)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET - Read all announcements
router.get('/announcements', authMiddleware.requireJWT, (req, res) => {
  Announcement.find()
  .then(announcements => {
    res.json(announcements)
  })
  .catch(error => {
    res.status(400).json({ error: error.message })
  })
})

// GET - Read an individual announcement document
router.get('/announcements/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Announcement.findById(id)
  .then(announcement => {
    if(announcement) {
      res.json(announcement)
    }
    else {
      res.status(404).json({ error: `Announcement not found with id: ${id}` })
    }
  })
  .catch(error => {
    res.status(400).json({ error: error.message })
  })
})

// POST - Create a new announcement document
router.post('/announcements', authMiddleware.requireJWT, (req, res) => {
  const attributes = req.body
  Announcement.create(attributes)
  .then(announcement => {
    res.status(201).json(announcement)
  })
  .catch(error => {
    res.status(400).json({ error: error })
  })
})

// PATCH - Update a announcement document
router.patch('/announcements/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  const attributes = req.body
  Announcement.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })
  .then(announcement => {
    if(announcement) {
      res.status(200).json(announcement)
    }
    else {
      res.status(404).json({ error: `Announcement not found with id: ${id}` })
    }
  })
  .catch(error => {
    res.status(400).json({ error: error })
  })
})

// DELETE - Destroy a announcement document
router.delete('/announcements/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Announcement.findByIdAndRemove(id)
  .then(announcement => {
    if(announcement) {
      res.status(200).json(announcement)
    }
    else {
      res.status(404).json({ error: `Announcement not found with id: ${id}` })
    }
  })
  .catch(error => {
    res.status(400).json({ error: error })
  })
})

module.exports = router
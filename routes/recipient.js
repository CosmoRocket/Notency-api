/* @flow */
const express = require('express')
const moment = require('moment')
const Recipient = require('../models/Recipient')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// POST - Search recipients by Nationality
router.post('/recipients/search', authMiddleware.requireJWT, async (req, res) => {
  const attributes = req.body
  const nationality = attributes.nationality
  const role = attributes.role
  const graduationDate = !!attributes.graduationDate ? moment.utc(attributes.graduationDate, 'DD/MM/YYYY', true) : null
  const filters = {}

  if (nationality) filters.nationality = nationality
  if (role) filters.role = role
  if (graduationDate) filters.graduationDate = graduationDate

  try {
    const recipients = await Recipient.find(filters)
    res.json(recipients)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }

})

// GET - Read all recipients
router.get('/recipients', authMiddleware.requireJWT, (req, res) => {
  Recipient.find()
    .then(recipients => {
      res.json(recipients)
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

// GET - Read an individual recipient document
router.get('/recipients/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Recipient.findById(id)
    .then(recipient => {
      if (recipient) {
        res.json(recipient)
      }
      else {
        res.status(404).json({ error: `Recipient not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

// POST - Create a new recipient document
router.post('/recipients', authMiddleware.requireJWT, (req, res) => {
  const attributes = req.body
  Recipient.create(attributes)
    .then(recipient => {
      res.status(201).json(recipient)
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// PATCH - Update a recipient document
router.patch('/recipients/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  const attributes = req.body
  Recipient.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })
    .then(recipient => {
      if (recipient) {
        res.status(200).json(recipient)
      }
      else {
        res.status(404).json({ error: `Recipient not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// DELETE - Destroy a recipient document
router.delete('/recipients/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Recipient.findByIdAndRemove(id)
    .then(recipient => {
      if (recipient) {
        res.status(200).json(recipient)
      }
      else {
        res.status(404).json({ error: `Recipient not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

module.exports = router
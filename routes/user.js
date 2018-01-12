/* @flow */
const express = require('express')
const User = require('../models/User')
const router = express.Router()

// GET - Read all users
router.get('/users', (req, res) => {
  User.find()
  .then(users => {
    res.json(users)
  })
  .catch(error => {
    res.status(400).json({ error: error.message })
  })
})

// GET - Read an individual user document
router.get('/users/:id', (req, res) => {
  const id = req.params.id
  User.findById(id)
  .then(user => {
    if(user) {
      res.json(user)
    }
    else {
      res.status(404).json({ error: `User not found with id: ${id}` })
    }
  })
  .catch(error => {
    res.status(400).json({ error: error.message })
  })
})

// POST - Create a new user document
router.post('/users', (req, res) => {
  const attributes = req.body
  User.create(attributes)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => {
    res.status(400).json({ error: error })
  })
})

// PATCH - Update a user document
router.patch('/users/:id', (req, res) => {
  const id = req.params.id
  const attributes = req.body
  User.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })
  .then(user => {
    if(user) {
      res.status(200).json(user)
    }
    else {
      res.status(404).json({ error: `User not found with id: ${id}` })
    }
  })
  .catch(error => {
    res.status(400).json({ error: error })
  })
})

// DELETE - Destroy a user document
router.delete('/users/:id', (req, res) => {
  const id = req.params.id
  User.findByIdAndRemove(id)
  .then(user => {
    if(user) {
      res.status(200).json(user)
    }
    else {
      res.status(404).json({ error: `User not found with id: ${id}` })
    }
  })
  .catch(error => {
    res.status(400).json({ error: error })
  })
})

module.exports = router
/* @flow */
const express = require('express')
const User = require('../models/User')
const router = express.Router()

// GET - Read all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET - Read an individual user document
router.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)
    if (user) {
      res.json(user)
    }
    else {
      res.status(404).json({ error: `User not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST - Create a new user document
router.post('/users', async (req, res) => {
  try {
    const attributes = req.body
    const user = await User.create(attributes)
    res.status(201).json(user)
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

// PATCH - Update a user document
router.patch('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const attributes = req.body
    const user = await User.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })

    if (user) {
      res.status(200).json(user)
    }
    else {
      res.status(404).json({ error: `User not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

// DELETE - Destroy a user document
router.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findByIdAndRemove(id)
    if (user) {
      res.status(200).json(user)
    }
    else {
      res.status(404).json({ error: `User not found with id: ${id}` })
    }
  }
  catch (error) {
    res.status(400).json({ error: error })
  }
})

module.exports = router
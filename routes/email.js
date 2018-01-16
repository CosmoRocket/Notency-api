/* @flow */
const express = require('express')
const emailMiddleware = require('../middleware/email')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// PATCH - Add responses to notification
router.patch('/email/receive', emailMiddleware.receiveEmail)

// POST - Send a Text Message
router.post('/email/send', authMiddleware.requireJWT, emailMiddleware.sendEmail)

module.exports = router
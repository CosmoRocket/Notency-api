/* @flow */
const express = require('express')
const emailMiddleware = require('../middleware/email')
const authMiddleware = require('../middleware/auth')
const multer = require('../middleware/multer')
const router = express.Router()

// POST - Add responses to notification
router.post('/email/receive', emailMiddleware.receiveEmail)

// POST - Send a Text Message
router.post(
  '/email/send',
  authMiddleware.requireJWT,
  multer.upload.single('attachment'),
  emailMiddleware.sendEmail
)

module.exports = router

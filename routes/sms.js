/* @flow */
const express = require('express')
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')
const smsMiddleware = require('../middleware/sms')
// const authMiddleware = require('../middleware/auth')
const router = express.Router()

// PATCH - Add responses to notification
router.patch('/sms/receive', smsMiddleware.receiveSms)

module.exports = router
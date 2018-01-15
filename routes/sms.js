/* @flow */
const express = require('express')
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')
const smsMiddleware = require('../middleware/sms')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// PATCH - Add responses to notification
router.patch('/sms/receive', smsMiddleware.receiveSms)

// POST - Send a Text Message
router.post('/sms/send', authMiddleware.requireJWT, smsMiddleware.sendSms)

// POST - Send a Group Text Message
router.post('/sms/groupSend', authMiddleware.requireJWT, smsMiddleware.sendGroupSms)

module.exports = router
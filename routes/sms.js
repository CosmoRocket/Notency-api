/* @flow */
const express = require('express')
const smsMiddleware = require('../middleware/sms')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// POST - Add responses to notification
router.post('/sms/receive', smsMiddleware.receiveSms)

// POST - Send a Text Message
router.post('/sms/send', authMiddleware.requireJWT, smsMiddleware.sendSms)

// POST - Send a Group Text Message
router.post('/sms/groupSend', authMiddleware.requireJWT, smsMiddleware.sendGroupSms)

module.exports = router
/* @flow */
const express = require('express')
const fileUploadMiddleware = require('../middleware/fileUpload')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// POST - Upload a file
// router.post('/upload', authMiddleware.requireJWT, fileUploadMiddleware.upload)
router.post('/upload', fileUploadMiddleware.upload)

module.exports = router
/* @flow */
const multer = require('multer')
const path = require('path')
const Recipient = require('../models/Recipient')
const { readFromCsv } = require('./exceljs')
const { formatRecordsForRecipients } = require('../helper/recipient-parser')

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    // Files will be saved in the 'tmp' directory
    cb(null, '/tmp')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// Create Multer instance
const upload = multer({ storage })

// Upload File Request/Response
// $FlowFixMe - Turn off type annotations
const uploadFile = async (req, res) => {
  try {
    // Upload folder
    const UPLOAD_FOLDER = '/tmp'
    const FILE_NAME = req.file ? req.file.originalname : ''
    const FILE_TYPE = req.file.mimetype
    // If File Name is present
    if (FILE_NAME) {
      // If File Type is CSV
      if (FILE_TYPE === 'text/csv') {
        // Read the CSV File
        const records = await readFromCsv(UPLOAD_FOLDER + '/' + FILE_NAME)
        // Format records as Recipients
        const recipientRecords = formatRecordsForRecipients(records)
        // Recipient Records are present
        if (recipientRecords) {
          // First, deactivate all Records in Recipients
          await Recipient.update(
            {},
            { $set: { active: false } },
            { multi: true, upsert: false, new: true, runValidators: true }
          )
          // Store records to Recipients and Activate
          const results = await Promise.all(recipientRecords.map((recipientAttributes) => {
            return Recipient.findOneAndUpdate(
              { idNo: recipientAttributes.idNo },
              { $set: recipientAttributes },
              { upsert: true, new: true, runValidators: true }
            )
          }))
          res.status(201).json(results)
        }
        else {
          res.status(400).json({ error: 'Invalid CSV File' })
        }
      }
      else {
        res.status(400).json({ error: 'Invalid CSV File' })
      }
    }
    else {
      res.status(400).json({ error: 'No CSV File provided' })
    }
  }
  catch (error) {
    res.status(400).json({ error })
  }

}

module.exports = {
  upload,
  uploadFile
}
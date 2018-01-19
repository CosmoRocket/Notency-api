const multer = require('multer')
const path = require('path')
const Recipient = require('../models/Recipient')
const { readFromCsv } = require('./exceljs')
const { formatRecordsForRecipients } = require('../helper/recipient-parser')

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    // Files will be saved in the 'files' directory
    cb(null, './files')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// Create Multer instance
const upload = multer({ storage })

// Upload File Request/Response
const uploadFile = async (req, res) => {
  try {
    // Upload folder
    const UPLOAD_FOLDER = 'files'
    const FILE_NAME = req.file ? req.file.originalname : ''
    // If File Name is present
    if (FILE_NAME) {
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
const multer = require('multer')
const path = require('path')
const { readFromCsv } = require('./exceljs')

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
  console.log('File Uploaded', req.file)
  
  // Upload folder
  const UPLOAD_FOLDER = 'files'
  const FILE_NAME = req.file.originalname

  // Read the CSV File
  try {
    const records = await readFromCsv(UPLOAD_FOLDER+'/'+FILE_NAME)
    res.status(201).json({ records })
  }
  catch(error) {
    res.status(400).json({ error })
  }

}

module.exports = {
  upload,
  uploadFile
}
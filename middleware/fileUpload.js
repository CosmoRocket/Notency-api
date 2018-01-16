/* @flow */
const { uploadFile } = require('./expressFileUpload')
const { readFromCsv } = require('./exceljs')

// Upload a file
// $FlowFixMe - Turn off type annotations
const upload = async (req, res) => {
  if (!req.files) res.status(400).json({ error: 'No files were uploaded.' })

  // The name of the input field (i.e. "csvFile") is used to retrieve the uploaded file
  const csvFile = req.files.csvFile

  // Upload folder
  const UPLOAD_FOLDER = 'files'

  // Upload the file
  try {
    const data = await uploadFile(UPLOAD_FOLDER, csvFile)
    const records = await readFromCsv(UPLOAD_FOLDER+'/'+csvFile.name)
    res.status(201).json({ records })
  }
  catch(error) {
    res.status(400).json({ error })
  }
}

module.exports = {
  upload
}
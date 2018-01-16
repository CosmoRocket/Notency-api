/* @flow */
// Upload a file
// $FlowFixMe - Turn off type annotations
const uploadFile = (uploadFolder, file) => {
  // $FlowFixMe - Turn off type annotations
  return new Promise( (success, fail) => {
    // Use the mv() method to place the file somewhere on your server
    file.mv(`${uploadFolder}/${file.name}`, error => {
      if(error) fail(error)
      else success({ message: 'File uploaded!' })
    })
  })
}

module.exports = {
  uploadFile
}
const mongoose = require('mongoose')

// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise

// Connect to our local database
mongoose
  .connect('mongodb://localhost/notency-test', { useMongoClient: true })
  .then(() => {
    console.log('Successfully connected to test database')
  })
  .catch(error => {
    //   If there was an error connecting to the database
    if (error) console.log('Error connecting to MongoDB test database', error)
  })

module.exports = mongoose
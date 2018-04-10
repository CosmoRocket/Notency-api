/* @flow */
const mongoose = require('mongoose')
// Dotenv - Necessary to be placed here for process.env to be recognised on test runtime
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise

// Connect to our local database
mongoose
  // .connect(`mongodb://${process.env.MONGO_TEST_URI}`, { useMongoClient: true })
  .connect(process.env.MONGO_TEST_URI)
  .then(() => {
    console.log('Successfully connected to test database')
  })
  .catch(error => {
    //   If there was an error connecting to the database
    if (error) console.log('Error connecting to MongoDB test database', error)
  })

module.exports = mongoose
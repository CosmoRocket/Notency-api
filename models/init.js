/* @flow */
const mongoose = require('mongoose')
// Dotenv - Necessary to be placed here for process.env to be recognised on runtime
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise

// Connect to our local database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch(error => {
    //   If there was an error connecting to the database
    if (error) console.log('Error connecting to MongoDB database', error)
  })

module.exports = mongoose
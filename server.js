/* @flow */
// Load .env file in development
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')

const server = express()

// Middleware Plugins
server.use(bodyParser.json()) // Allows me to have JSON uploads (POST/PATCH/PUT)
server.use(bodyParser.urlencoded({ extended: false })) // Allow url encoded content
server.use(cors()) // Allow other origins to access, i.e our react front-end
server.use(authMiddleware.initialize) // Kick passport off
server.use(express.static('public')) // Just for testing, use a static html

// Routes
server.use('/', [
  require('./routes/auth'),
  require('./routes/recipient'),
  require('./routes/message'),
  require('./routes/notification'),
  require('./routes/announcement'),
  require('./routes/sms'),
  require('./routes/email'),
  require('./routes/fileUpload'),
  require('./routes/checkServer'),
])

// Error handler
server.use((error, req, res, next) => {
  res.json({
    error: {
      message: error.message
    }
  })
})

// Start the server
server.listen((process.env.PORT || 7000), error => {
  if (error) console.error('Error starting', error)
  else console.log('Started at http://localhost:7000')
})

module.exports = server
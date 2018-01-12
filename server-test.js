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
server.use(cors()) // Allow other origins to access, i.e our react front-end
server.use(authMiddleware.initialize) // Kick passport off

// Routes
server.use('/', [
  require('./routes/recipient'),
  require('./routes/auth')
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
server.listen(7001, error => {
  if (error) console.error('Error starting', error)
  else console.log('Test Server Started at http://localhost:7001')
})

module.exports = server
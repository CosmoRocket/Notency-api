/* @flow */
const mongoose =
  process.env.NODE_ENV === 'test' ? require('./init-test') : require('./init')
const passportLocalMongoose = require('passport-local-mongoose')

// Create an empty user schema with no additional fields
const userSchema = new mongoose.Schema()

// Add passport middleware to User Schema
userSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true, // Ensure that all usernames are lowercase
  session: false // Disable sessions as we'll use JWTs
})

const User = mongoose.model('User', userSchema)

module.exports = User

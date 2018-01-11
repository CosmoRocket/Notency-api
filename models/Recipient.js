const mongoose = require('./init')
const Schema = mongoose.Schema

/*
Recipient Model
Recipient ID - Unique - e.g. Student ID or Teacher ID
First Name - e.g. John
Last Name - e.g. Smith
Mobile - Unique - e.g. +61444888000
Email - Unique - e.g. somone@example.com
Nationality - e.g. Australia
*/
const recipientSchema = new Schema({
  recipientId: { type: String, required: true, unique: true }, // Recipient ID - Unique - e.g. Student ID or Teacher ID
  firstName: { type: String }, // First Name - e.g. John
  lastName: { type: String }, // Last Name - e.g. Smith
  mobile: { type: String, unique: true }, // Mobile - Unique - e.g. +61444888000
  email: { type: String, unique: true }, // Email - Unique - e.g. somone@example.com
  nationality: { type: String } // Nationality - e.g. Australia
})

const Recipient = mongoose.model('Recipient', recipientSchema)

module.exports = Recipient
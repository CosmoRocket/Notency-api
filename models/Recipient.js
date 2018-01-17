/* @flow */
// Choose a different environment, if it's a test
const mongoose =
  process.env.NODE_ENV === 'test' ? require('./init-test') : require('./init')
const Schema = mongoose.Schema

/*
Recipient Model
ID Number - Unique - (Student ID or Teacher ID) e.g. 201812345678
First Name - e.g. John
Last Name - e.g. Smith
Role - e.g. Student/Teacher
Mobile - Unique - e.g. +61444888000
Email - Unique - e.g. somone@example.com
Nationality - e.g. Australia
Graduation Date - e.g. 12/31/2018
*/
const recipientSchema = new Schema({
  idNo: { type: String, required: true, unique: true }, // ID Number - Unique - (Student ID or Teacher ID) e.g. 201812345678
  firstName: { type: String }, // First Name - e.g. John
  lastName: { type: String }, // Last Name - e.g. Smith
  role: { type: String, required: true }, // Role - e.g. Student/Teacher 
  mobile: { type: String, unique: true }, // Mobile - Unique - e.g. +61444888000
  email: { type: String, unique: true }, // Email - Unique - e.g. somone@example.com
  nationality: { type: String }, // Nationality - e.g. Australia
  grduationDate: { type: Date } // Graduation Date - e.g. 12/31/2018
})

const Recipient = mongoose.model('Recipient', recipientSchema)

module.exports = Recipient

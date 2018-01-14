/* @flow */
// Choose a different environment, if it's a test
const mongoose =
  process.env.NODE_ENV === 'test' ? require('./init-test') : require('./init')

/*
Notification Model
Code - Unique - e.g. EARTHQUAKE1, TSUNAMI1, FRANCETERROR
Subject - Unique - e.g. Earthquake at Melbourne, Tsunami at Sydney Harbour, Terror Attack in France
Body - Character Limit? - e.g. This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.
Responses = Array of Message [Recipient ID and Body]
*/
const notificationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  subject: { type: String, required: true, unique: true },
  body: { type: String, required: true },
  responses: [{ type: Schema.ObjectId, ref: 'Message', default: [] }],
  createdAt: { type: Date, default: Date.now }
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification

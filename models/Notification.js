/* @flow */
// Choose a different environment, if it's a test
const mongoose =
  process.env.NODE_ENV === 'test' ? require('./init-test') : require('./init')
const Schema = mongoose.Schema

/*
Notification Model
Code - Unique - e.g. EARTHQUAKE1, TSUNAMI1, FRANCETERROR
Subject - e.g. Earthquake at Melbourne, Tsunami at Sydney Harbour, Terror Attack in France
Body - Character Limit? - e.g. This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.
Body Html - Character Limit? - e.g. <html><body><p>This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.</p></body></html>
Groups - e.g. Australia, France
Recipients = Array of Recipient [Recipient]
Responses = Array of Message [Sender (Recipient) and Body]
*/
const notificationSchema = new Schema({
  code: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  bodyHtml: { type: String, required: true },
  groups: { type: Array, default: [] },
  recipients: [{ type: Schema.ObjectId, ref: 'Recipient', default: [], required: true }],
  responses: [{ type: Schema.ObjectId, ref: 'Message', default: [] }],
  createdAt: { type: Date, default: Date.now }
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification

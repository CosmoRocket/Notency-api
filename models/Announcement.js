/* @flow */
// Choose a different environment, if it's a test
const mongoose =
  process.env.NODE_ENV === 'test' ? require('./init-test') : require('./init')
const Schema = mongoose.Schema

/*
Announcement Model
Subject - Unique - e.g. Earthquake at Melbourne, Tsunami at Sydney Harbour, Terror Attack in France
Body Html - Character Limit? - e.g. <html><body><p>This is to inform all Students that there has been an Earthquake at Melbourne. Please reply "EARTHQUAKE1 OK" if you are safe.</p></body></html>
Groups - e.g. Australia, France
Recipients = Array of Recipient [Recipient]
*/
const announcementSchema = new Schema({
  subject: { type: String, required: true, unique: true },
  bodyHtml: { type: String, required: true },
  groups: { type: Array, default: [], required: true },
  recipients: [{ type: Schema.ObjectId, ref: 'Recipient', default: [], required: true }],
  createdAt: { type: Date, default: Date.now }
})

const Announcement = mongoose.model('Announcement', announcementSchema)

module.exports = Announcement

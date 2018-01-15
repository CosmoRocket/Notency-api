/* @flow */
// Choose a different environment, if it's a test
const mongoose =
  process.env.NODE_ENV === 'test' ? require('./init-test') : require('./init')
const Schema = mongoose.Schema

/*
Message Model
Recipient ID - e.g. 
Body - Character Limit? - e.g. EARTHQUAKE1 OK
*/
const messageSchema = new Schema({
  sender: { type: Schema.ObjectId, ref: 'Recipient', required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message

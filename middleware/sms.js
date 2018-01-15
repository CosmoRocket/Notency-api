/* @flow */
const Notification = require('../models/Notification')
const Recipient = require('../models/Recipient')
const Message = require('../models/Message')
const messageParser = require('../helper/message-parser')

/*
*  Receive SMS message
*/
// $FlowFixMe - Turn off type annotations
const receiveSms = async (req, res, next) => {
  try {
    // Get the JSON
    const attributes = req.body
    const mobile = attributes.From
    const body = attributes.Body

    // Get Sender as a Recipient using a Mobile number
    const sender = await Recipient.findOne({ mobile: mobile })

    // Create a Message based on the JSON
    const messageAttribute = {
      sender: sender,
      body: body
    }

    // Parse code from message body
    const code = messageParser.isValidResponse(body)
      ? messageParser.parseCodeFromMessage(body)
      : ''
    if (!code) throw new Error('Invalid response message')

    // Create the response as a Message object
    const responseMessage = await Message.create(messageAttribute)

    // Update the notification and append the response
    const notification = await Notification.findOneAndUpdate(
      { code: code },
      { $addToSet: { responses: responseMessage } },
      { upsert: true, new: true, runValidators: true }
    ).populate({
      path: 'responses',
      populate: {
        path: 'sender',
        model: 'Recipient'
      }
    })
    res.status(200).json(notification)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  receiveSms
}

// const receiveSms = (req, res, next) => {
//   // Get the JSON
//   const attributes = req.body
//   const mobile = attributes.From
//   const body = attributes.Body

//   // Get Sender as a Recipient using a Mobile number
//   Recipient.findOne({ mobile: mobile })
//     .then(sender => {
//       // console.log('sender', sender)

//       // Create a Message based on the JSON
//       const messageAttribute = {
//         sender: sender,
//         body: body
//       }
//       let code = ''

//       // Parse code from message body
//       if( messageParser.isValidResponse(body) ) {
//         code = messageParser.parseCodeFromMessage(body)
//       }
//       else {
//         throw new Error('Invalid response message')
//       }

//       Message.create(messageAttribute)
//         .then(responseMessage => {
//           // console.log('responseMessage', responseMessage)
//           // console.log('Update Notification')

//           // Update the notification and append the response
//           Notification.findOneAndUpdate(
//             { code: code },
//             { $addToSet: { responses: responseMessage } },
//             { upsert: true, new: true, runValidators: true }
//           )
//             .populate({
//               path: 'responses',
//               populate: {
//                 path: 'sender',
//                 model: 'Recipient'
//               }
//             })
//             .then(notification => {
//               // console.log('notification', notification)
//               // console.log('notification.responses[0].sender', notification.responses[0].sender)

//               res.status(200).json(notification)
//             })
//             .catch(error => {
//               // console.error(error)
//               // res.status(400).json({ error })
//               next(error)
//             })
//         })
//         .catch(error => {
//           // console.error(error)
//           // res.status(400).json({ error })
//           next(error)
//         })
//     })
//     .catch(error => {
//       // console.error(error)
//       // res.status(400).json({ error })
//       next(error)
//     })
// }

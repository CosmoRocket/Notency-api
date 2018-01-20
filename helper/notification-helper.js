/* @flow */
const Notification = require('../models/Notification')

/*
* Check if the Notification Code is valid
*/
// $FlowFixMe - Turn off type annotations
const getNotificationByCode = async (notificationCode) => {
  // Find the code in Notification
  const notification = await Notification.findOne({ code: notificationCode }).populate('responses')
  // Return true if valid
  return notification
}

/*
* Check if Sender has already responded
*/
// $FlowFixMe - Turn off type annotations
const hasAlreadyResponded = (sender, notification) => {
  // Convert id to string
  const convertIdToString = id => id.toString()
  // Get array of responders from notification responses
  const responders = notification.responses.map(response => convertIdToString(response.sender))
  // Check if sender has already responded
  return responders.indexOf(convertIdToString(sender._id)) > -1
}

/*
* Add Response Message to Notification
*/
// $FlowFixMe - Turn off type annotations
const addResponseToNotification = async (code, responseMessage) => {
  // Find and update a Notification with given code
  const notification = await Notification.findOneAndUpdate(
    { code: code },
    { $addToSet: { responses: responseMessage } },
    { upsert: false, new: true, runValidators: true }
  ).populate({
    path: 'responses',
    populate: {
      path: 'sender',
      model: 'Recipient'
    }
  })
  return notification
}

module.exports = {
  getNotificationByCode,
  hasAlreadyResponded,
  addResponseToNotification
}
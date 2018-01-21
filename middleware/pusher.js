/* @flow */
const Pusher = require('pusher')

/*
*  Push message to pusher service
*/
// $FlowFixMe - Turn off type annotations
const pushMessage = (message, channel, event) => {
  const PUSHER_APP_ID = process.env.PUSHER_APP_ID
  const PUSHER_KEY = process.env.PUSHER_KEY
  const PUSHER_SECRET = process.env.PUSHER_SECRET
  const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER

  // Pusher credentials
  const pusher = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    encrypted: true
  })

  // Return Pusher as a Promise
  // $FlowFixMe - Turn off type annotations
  return new Promise((success, fail) => {
    if (!!message) {
      pusher.trigger(channel, event, {
        "message": message
      })
      success(message)
    }
    else {
      fail('No message specified')
    }
  })
}

module.exports = {
  pushMessage
}
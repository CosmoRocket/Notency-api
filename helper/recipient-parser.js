/* @flow */
const moment = require('moment')

// Prepares a Record object for Recipients
// $FlowFixMe - Turn off type annotations
const formatRecordsForRecipients = records => {
  return records.map(record => {
    // Records will be automatically set to active
    record.active = true
    // Mobile numbers will always need a plus sign
    if (record.mobile) record.mobile = appendPlusSign(record.mobile)
    // Graduation Date will be converted to Date object
    if (record.graduationDate) record.graduationDate = moment.utc(record.graduationDate, 'DD/MM/YYYY', true)
    else delete record.graduationDate
    // Return the formatted record
    return record
  })
}

// Append plus sign to mobile numbers
// $FlowFixMe - Turn off type annotations
const appendPlusSign = mobileNumber => {
  // Ensure there are no spaces before/after the mobile number
  const mobile = mobileNumber.toString()
  // If it already doesn't start with plus sign
  return !mobile.toString().startsWith('+') ? `+${mobile}` : mobile
}

module.exports = {
  formatRecordsForRecipients,
  appendPlusSign
}
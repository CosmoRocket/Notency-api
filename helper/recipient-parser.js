const moment = require('moment')

// Prepares a Record object for Recipients
const formatRecordsForRecipients = records => {
  return records.map(record => {
    // Records will be automatically set to active
    record.active = true
    // Graduation Date will be converted to Date object
    if (record.graduationDate) record.graduationDate = moment.utc(record.graduationDate, 'DD/MM/YYYY', true)
    else delete record.graduationDate
    // Return the formatted record
    return record
  })
}

module.exports = {
  formatRecordsForRecipients
}
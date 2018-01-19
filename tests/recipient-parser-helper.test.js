const recipientParser = require('../helper/recipient-parser')
const moment = require('moment')

describe('Function should replace graduation date string to date object', () => {
  test('It should convert date string to date object', () => {
    const input = [{
      graduationDate: '31/12/2018'
    }]
    const expected = moment.utc('31/12/2018', 'DD/MM/YYYY', true)
    expect(recipientParser.formatRecordsForRecipients(input)[0].graduationDate).toEqual(expected)
  })
})

describe('Function should set record to active', () => {
  test('It should set record attribute to active', () => {
    const input = [{
      graduationDate: '31/12/2018'
    }]
    const expected = true
    expect(recipientParser.formatRecordsForRecipients(input)[0].active).toEqual(expected)
  })
})

describe('Function should add plus signs to mobile numbers', () => {
  test('It will append the plus sign', () => {
    const input = '61000000000'
    const expected = '+61000000000'
    expect(recipientParser.appendPlusSign(input)).toEqual(expected)
  })
})

describe('Function should add plus signs to mobile numbers when record is formatted', () => {
  test('It will append the plus sign', () => {
    const input = [{
      mobile: '61000000000'
    }]
    const expected = '+61000000000'
    expect(recipientParser.formatRecordsForRecipients(input)[0].mobile).toEqual(expected)
  })
})
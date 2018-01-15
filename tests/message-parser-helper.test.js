const messageParser = require('../helper/message-parser')

describe('Function should replace multiple spaces with a single space', () => {
  test('It should convert multiple spaces to single spaces', () => {
    const input = '  This  is  a  message   with      multiple   spaces  '
    const expected = ' This is a message with multiple spaces '
    expect(messageParser.replaceMultipleSpaces(input)).toEqual(expected)
  })
})

describe('Function should return the Nth word from a string', () => {
  test('It should return the Nth word from a string of words', () => {
    const input = 'Hello world'
    const expected = 'world'
    expect(messageParser.getNthWord(input, 2)).toEqual(expected)
  })
})

describe('Function should get the number of words in a message', () => {
  test('It should get the correct number of words', () => {
    const input = 'This is a message'
    const expected = 4
    expect(messageParser.numWords(input)).toEqual(expected)
  })
})

describe('Function should determine if a message is blank', () => {
  test('It should be an invalid response', () => {
    const input = ''
    const expected = 0
    expect(messageParser.numWords(input)).toEqual(expected)
  })
})

describe('Function should determine if a message does not have a 3 character code', () => {
  test('It should be an invalid response', () => {
    const input = 'EQ OK'
    const expected = false
    expect(messageParser.isValidResponse(input)).toEqual(expected)
  })
})

describe('Function should determine if a message only has one word', () => {
  test('It should be an invalid response', () => {
    const input = 'EQ'
    const expected = false
    expect(messageParser.isValidResponse(input)).toEqual(expected)
  })
})

describe('Function should determine if a message does not have a code', () => {
  test('It should be an invalid response', () => {
    const input = 'I need help'
    const expected = false
    expect(messageParser.isValidResponse(input)).toEqual(expected)
  })
})

describe('Function should retrieve a Code from a message', () => {
  test('It should retrieve the Code', () => {
    const input = 'EQ1 OK'
    const expected = 'EQ1'
    expect(messageParser.parseCodeFromMessage(input)).toEqual('EQ1')
  })
})

describe('Function should retrieve the Code as Uppercase', () => {
  test('It should retrieve the Code as Uppercase', () => {
    const input = 'EQ1 OK'
    const expected = 'eq1'
    expect(messageParser.parseCodeFromMessage(input)).toEqual('EQ1')
  })
})

describe('Function should determine if a message is a valid response <Code> OK', () => {
  test('It respond as a valid OK message', () => {
    const input = 'EQ1 OK'
    const expected = true
    expect(messageParser.isValidResponse(input)).toEqual(expected)
  })
})

describe('Function should determine if a message responds to <Code> OK', () => {
  test('It respond as an OK message', () => {
    const input = 'EQ1 OK'
    const expected = true
    expect(messageParser.isOkMessage(input)).toEqual(expected)
  })
})

describe('Function should determine if a message does not respond to <Code> OK', () => {
  test('It does not respond as an OK message', () => {
    const input = 'EQ1 I need help'
    const expected = false
    expect(messageParser.isOkMessage(input)).toEqual(expected)
  })
})

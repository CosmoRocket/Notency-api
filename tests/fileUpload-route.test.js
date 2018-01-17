/* @flow */

const axios = require('axios')
const FormData = require('form-data')
// const Util = require('util')
const FS = require('fs')

// const readFilePromise = Util.promisify(FS.readFile)

const api = axios.create({
  baseURL: 'http://localhost:7001', // Test Server
})

// const setToken = token => {
//   api.defaults.headers.common['Authorization'] = `Bearer ${token}`
// }
// const getToken = () => {
//   return api.defaults.headers.common['Authorization']
// }

describe('Upload a file', () => {
  test('It should upload the file', async () => {

    try {
      // const fileData = await readFilePromise('./tests/sample.csv')
      const formData = new FormData()
      formData.append('files.csvFile', FS.createReadStream('./tests/sample.csv'))
      const response = await api.post('/upload', formData, {
        headers: formData.getHeaders()
      })
      expect(response.status).toBe(201)
    }
    catch(error) {
      expect(error).toBeFalsy()
    }
    
  })
})
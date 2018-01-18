/* @flow */
const Recipient = require('./Recipient')
const User = require('./User')
const moment = require('moment')

// Recipient.create([{
//   idNo: '201812345678',
//   firstName: 'Glenn',
//   lastName: 'Dimaliwat',
//   role: 'Student',
//   mobile: '+61456360645',
//   email: 'glenn.dimaliwat@gmail.com',
//   nationality: 'Australia',
//   graduationDate: moment.utc('31/12/2018', 'DD/MM/YYYY', true)
// },
// {
//   idNo: '201812345679',
//   firstName: 'Alessio',
//   lastName: 'Palumbo',
//   role: 'Student',
//   mobile: '+61439204670',
//   email: 'alessio.palumbo4@gmail.com',
//   nationality: 'Australia',
//   graduationDate: moment.utc('31/12/2018', 'DD/MM/YYYY', true)
// }])
//   .then(recipients => {
//     console.log('Created recipients', recipients)
//     process.exit()
//   })
//   .catch(error => {
//     console.error('Error', error)
//     process.exit()
//   })

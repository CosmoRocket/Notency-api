/* @flow */
const Excel = require('exceljs')

// Write CSV Files
// $FlowFixMe - Turn off type annotations
// const writeToCsv = (filename, sheetName, columns, data) => {
//   const workbook = createAndFillWorkbook(sheetName, columns, data)
//   workbook.csv.writeFile(filename).then(() => {
//     // Done
//     console.log('Done')
//   })
// }

// Create a Workbook and a sheet then fill it with data
// $FlowFixMe - Turn off type annotations
const createAndFillWorkbook = (sheetName, columns, data) => {
  const workbook = new Excel.Workbook()
  const sheet = workbook.addWorksheet(sheetName)

  // Create Column Names
  sheet.columns = columns

  // Create Row Data using Array
  sheet.addRows(data)

  return workbook
}

// Read CSV Files
// $FlowFixMe - Turn off type annotations
const readFromCsv = filename => (
  // $FlowFixMe - Turn off type annotations
  new Promise((success, fail) => {
    const workbook = new Excel.Workbook()
    const records = []

    try {
      workbook.csv.readFile(filename).then(worksheet => {
        // Get the column names
        const label1 = worksheet.getRow(1).values[1] // ID Number
        const label2 = worksheet.getRow(1).values[2] // First Name
        const label3 = worksheet.getRow(1).values[3] // Last Name
        const label4 = worksheet.getRow(1).values[4] // Role
        const label5 = worksheet.getRow(1).values[5] // Mobile
        const label6 = worksheet.getRow(1).values[6] // Email
        const label7 = worksheet.getRow(1).values[7] // Nationality
        const label8 = worksheet.getRow(1).values[8] // Graduation Date

        // Iterate over each row
        worksheet.eachRow((row, rowNumber) => {
          // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values))
          if (rowNumber > 1) {
            // console.log('row.values', row.values)
            // Read column values
            records.push({
              [label1]: row.values[1], // ID Number
              [label2]: row.values[2], // First Name
              [label3]: row.values[3], // Last Name
              [label4]: row.values[4], // Role
              [label5]: row.values[5], // Mobile
              [label6]: row.values[6], // Email
              [label7]: row.values[7], // Nationality
              [label8]: row.values[8] // Graduation Date
            })
          }
        })
        success(records)
      })
    }
    catch (error) {
      fail(error)
    }
  })
)

module.exports = {
  // writeToCsv,
  readFromCsv
}
/* @flow */
const Excel = require('exceljs')

// Write CSV Files
// $FlowFixMe - Turn off type annotations
const writeToCsv = (filename, sheetName, columns, data) => {
  const workbook = createAndFillWorkbook(sheetName, columns, data)
  workbook.csv.writeFile(filename).then(() => {
    // Done
    console.log('Done')
  })
}

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
const readFromCsv = filename => {
  // $FlowFixMe - Turn off type annotations
  return new Promise((success, fail) => {
    const workbook = new Excel.Workbook()
    const records = []

    try {
      workbook.csv.readFile(filename).then(worksheet => {
        // Get the column names
        const label1 = worksheet.getRow(1).values[1] // Student ID
        const label2 = worksheet.getRow(1).values[2] // First Name
        const label3 = worksheet.getRow(1).values[3] // Last Name
        const label4 = worksheet.getRow(1).values[4] // Mobile
        const label5 = worksheet.getRow(1).values[5] // Email
        
        // Iterate over each row
        worksheet.eachRow((row, rowNumber) => {
          // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values))
          if (rowNumber > 1) {
            // Read column values
            records.push({
              [label1]: row.values[1], // Student ID
              [label2]: row.values[2], // First Name
              [label3]: row.values[3], // Last Name
              [label4]: row.values[4], // Mobile
              [label5]: row.values[5] // Email
            })
          }
        })
        success(records)
      })
    }
    catch(error) {
      fail(error)
    }
  })
}

module.exports = {
  writeToCsv,
  readFromCsv
}
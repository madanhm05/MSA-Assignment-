const XLSX = require('xlsx');

function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);

  return {
    orders: XLSX.utils.sheet_to_json(workbook.Sheets['Orders']),
    operations: XLSX.utils.sheet_to_json(workbook.Sheets['Operations']),
    machineLog: XLSX.utils.sheet_to_json(workbook.Sheets['Machine_Log']),
    wip: XLSX.utils.sheet_to_json(workbook.Sheets['WIP']),
  };
}

module.exports = readExcel;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Path to the input CSV file and output JSON file
const inputFilePath = path.join(__dirname, 'US equity price data - Sheet1.csv');
const outputFilePath = path.join(__dirname, '../utils/usd-equity-closing-price-data.json');

// Read the CSV file
console.log(`Reading CSV file from: ${inputFilePath}`);
const csvData = fs.readFileSync(inputFilePath, 'utf8');

// Parse the CSV data
const records = csv.parse(csvData, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

// Transform the data into a more usable format
// The CSV has dates as rows and stock symbols as columns
const closingPriceData = {};

// Initialize the structure for each symbol
Object.keys(records[0]).forEach(column => {
  if (column !== 'Date') {
    const symbol = column.split(':').pop(); // Extract symbol from format like "NASDAQ:AAPL"
    closingPriceData[symbol] = {};
  }
});

// Populate the data
records.forEach(record => {
  const date = record.Date;
  
  Object.entries(record).forEach(([column, value]) => {
    if (column !== 'Date') {
      const symbol = column.split(':').pop(); // Extract symbol from format like "NASDAQ:AAPL"
      const price = value === '#N/A' ? null : parseFloat(value);
      closingPriceData[symbol][date] = price;
    }
  });
});

// Write the data directly to the utils directory
fs.writeFileSync(outputFilePath, JSON.stringify(closingPriceData, null, 2));

console.log(`Successfully generated JSON file at: ${outputFilePath}`); 
const fs = require('fs');
const path = require('path');

/**
 * Parses the USD-INR CSV file into a dictionary
 * @param {string} filePath - Path to the CSV file
 * @returns {Object} - Dictionary with dates as keys and exchange rates as values
 */
function parseUsdInrCsv(filePath) {
  // Read the CSV file
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Split the content by lines
  const lines = fileContent.split('\n');
  
  // Initialize the dictionary
  const exchangeRates = {};
  
  // Check if there's a header row and process accordingly
  let startIndex = 0;
  if (lines[0].includes('Date') && lines[0].includes('USD-INR')) {
    startIndex = 1; // Skip the header row
  }
  
  let lastRate = 0;
  // Process each line
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    // Split the line by comma
    const parts = line.split(',');
    if (parts.length < 2) continue; // Skip invalid lines
    
    const date = parts[0].trim();
    let rate = parseFloat(parts[1].trim());
    
    // Add last rate to dictionary if rate is not a valid number
    if (isNaN(rate)) {
      rate = lastRate;
    } else {
      lastRate = rate;
    }
    exchangeRates[date] = rate;
  }
  
  return exchangeRates;
}

/**
 * Main function to demonstrate usage
 */
function main() {
  const filePath = path.resolve(__dirname, 'USD-INR-data.csv');
  
  try {
    // Parse the CSV file
    const exchangeRates = parseUsdInrCsv(filePath);
    
    // Print the number of entries
    console.log(`Successfully parsed ${Object.keys(exchangeRates).length} exchange rates`);
    
    // Print a sample of the data (first 5 entries)
    console.log('\nSample data:');
    const sampleDates = Object.keys(exchangeRates).slice(0, 5);
    sampleDates.forEach(date => {
      console.log(`${date}: ${exchangeRates[date]}`);
    });
    
    // Save as JSON for future use
    const jsonFilePath = path.resolve(__dirname, 'usd_inr_rates.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(exchangeRates, null, 2));
    console.log(`\nExchange rates saved as JSON to: ${jsonFilePath}`);
    
    // Example: How to look up a specific date
    const lookupDate = '2023-12-31'; // Change this to any date in your dataset
    if (exchangeRates[lookupDate]) {
      console.log(`\nExchange rate on ${lookupDate}: ${exchangeRates[lookupDate]}`);
    } else {
      console.log(`\nNo exchange rate found for ${lookupDate}`);
    }
    
    return exchangeRates; // Return the dictionary for further use
  } catch (error) {
    console.error('Error parsing CSV file:', error.message);
    return {};
  }
}

// Run the main function
const usdInrRates = main();

// Export the dictionary for use in other modules
module.exports = usdInrRates;
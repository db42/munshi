const fs = require('fs').promises;
const path = require('path');

// Paths to files - adjusted for server directory
const GENERATED_ITR_PATH = path.join(process.cwd(), '..', 'AY 2024-25', 'generated-itr-ay-2024-25.json');
const ACTUAL_ITR_PATH = path.join(process.cwd(), '..', 'AY 2024-25', 'itr-actual-ay-2024-25.json');

/**
 * Fetch generated ITR from the API using native fetch (Node.js v18+)
 */
async function fetchGeneratedITR() {
  try {
    console.log('Fetching generated ITR from API...');
    const response = await fetch('http://localhost:3000/api/itr/123/2024-25');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ITR from API:', error.message);
    throw error;
  }
}

/**
 * Save generated ITR to file
 */
async function saveGeneratedITR(data) {
  try {
    console.log(`Saving generated ITR to ${GENERATED_ITR_PATH}...`);
    await fs.writeFile(GENERATED_ITR_PATH, JSON.stringify(data, null, 2));
    console.log('Generated ITR saved successfully.');
  } catch (error) {
    console.error('Error saving generated ITR:', error.message);
    throw error;
  }
}

/**
 * Load actual ITR from file
 */
async function loadActualITR() {
  try {
    console.log(`Loading actual ITR from ${ACTUAL_ITR_PATH}...`);
    const data = await fs.readFile(ACTUAL_ITR_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading actual ITR:', error.message);
    throw error;
  }
}

/**
 * Compare interest income breakdown in Schedule OS
 */
function compareInterestIncomeBreakdown(generated, actual) {
  console.log('\n=== SCHEDULE OS INTEREST INCOME COMPARISON ===');
  
  // Extract interest income details from generated ITR
  const generatedOS = generated?.ScheduleOS?.IncOthThanOwnRaceHorse || {};
  
  // Extract interest income details from actual ITR
  const actualOS = actual?.ITR?.ITR2?.ScheduleOS?.IncOthThanOwnRaceHorse || {};
  
  // Create comparison table
  const comparisonTable = [
    ['Field', 'Generated Value', 'Actual Value', 'Match?'],
    ['InterestGross', generatedOS.InterestGross, actualOS.InterestGross, generatedOS.InterestGross === actualOS.InterestGross],
    ['IntrstFrmSavingBank', generatedOS.IntrstFrmSavingBank, actualOS.IntrstFrmSavingBank, generatedOS.IntrstFrmSavingBank === actualOS.IntrstFrmSavingBank],
    ['IntrstFrmTermDeposit', generatedOS.IntrstFrmTermDeposit, actualOS.IntrstFrmTermDeposit, generatedOS.IntrstFrmTermDeposit === actualOS.IntrstFrmTermDeposit],
    ['IntrstFrmIncmTaxRefund', generatedOS.IntrstFrmIncmTaxRefund, actualOS.IntrstFrmIncmTaxRefund, generatedOS.IntrstFrmIncmTaxRefund === actualOS.IntrstFrmIncmTaxRefund],
    ['IntrstFrmOthers', generatedOS.IntrstFrmOthers, actualOS.IntrstFrmOthers, generatedOS.IntrstFrmOthers === actualOS.IntrstFrmOthers],
  ];
  
  // Print comparison table
  console.table(comparisonTable);
  
  // Check if all interest fields match
  const allFieldsMatch = comparisonTable.slice(1).every(row => row[3] === true);
  console.log(`\nOverall Interest Income Breakdown Match: ${allFieldsMatch ? '✅ SUCCESS' : '❌ FAILURE'}`);
  
  return allFieldsMatch;
}

/**
 * Main function to run the evaluation
 */
async function runEvaluation() {
  try {
    console.log('Starting ITR evaluation test...');
    
    // Fetch generated ITR from API
    const generatedITR = await fetchGeneratedITR();
    
    // Save generated ITR to file
    await saveGeneratedITR(generatedITR);
    
    // Load actual ITR
    const actualITR = await loadActualITR();
    
    // Compare interest income breakdown
    const interestMatchResult = compareInterestIncomeBreakdown(generatedITR, actualITR);
    
    console.log('\n=== EVALUATION SUMMARY ===');
    console.log(`Interest Income Breakdown: ${interestMatchResult ? '✅ SUCCESS' : '❌ FAILURE'}`);
    
    console.log('\nTest completed.');
    return interestMatchResult;
  } catch (error) {
    console.error('Evaluation failed:', error);
    return false;
  }
}

// Export the function for use in scripts or direct execution
module.exports = { runEvaluation };

// Run the evaluation if this file is executed directly
if (require.main === module) {
  runEvaluation();
} 
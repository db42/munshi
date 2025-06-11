import fs from 'fs/promises';
import path from 'path';
import { diff } from 'jest-diff';

// Paths to files - store in tests directory
const TESTS_DIR = path.join(process.cwd(), 'src', 'tests');
const BASELINE_ITR_PATH = path.join(TESTS_DIR, 'baseline-itr-ay-2024-25.json');
const CURRENT_ITR_PATH = path.join(TESTS_DIR, 'current-itr-ay-2024-25.json');

interface ITRApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Fetch generated ITR from the API
 */
async function fetchGeneratedITR(): Promise<any> {
  try {
    console.log('Fetching generated ITR from API...');
    const response = await fetch('http://localhost:3000/api/itr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '123',
        assessmentYear: '2024-25',
        taxRegimePreference: 'AUTO',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    // The API returns the ITR data directly without a success wrapper
    if (!data || !data.itr || !data.itr.ITR) {
      throw new Error('Invalid response: No ITR data found');
    }
    
    return data.itr;
  } catch (error: any) {
    console.error('Error fetching ITR from API:', error.message);
    throw error;
  }
}

/**
 * Save ITR data to file
 */
async function saveITRToFile(data: any, filePath: string, description: string): Promise<void> {
  try {
    console.log(`Saving ${description} to ${filePath}...`);
    
    // Ensure tests directory exists
    await fs.mkdir(TESTS_DIR, { recursive: true });
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`${description} saved successfully.`);
  } catch (error: any) {
    console.error(`Error saving ${description}:`, error.message);
    throw error;
  }
}

/**
 * Load ITR data from file
 */
async function loadITRFromFile(filePath: string, description: string): Promise<any> {
  try {
    console.log(`Loading ${description} from ${filePath}...`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`${description} not found at ${filePath}`);
      return null;
    }
    console.error(`Error loading ${description}:`, error.message);
    throw error;
  }
}

/**
 * Compare key ITR sections for regression testing
 */
function compareITRSections(baseline: any, current: any): boolean {
  console.log('\n=== ITR REGRESSION COMPARISON ===');
  
  const difference = diff(baseline, current, {
    expand: false, // Don't expand large objects
    contextLines: 3, // Show 3 lines of context around changes
  });
  
  if (!difference || difference.includes('Compared values have no visual difference')) {
    console.log('✅ No differences found - No regression detected!');
    return true;
  }
  
  console.log('❌ Found differences:');
  console.log(difference); // Print the detailed, colored diff
  
  return false;
}

/**
 * Create baseline - save current ITR as the reference
 */
async function createBaseline(): Promise<boolean> {
  try {
    console.log('\n=== CREATING BASELINE ===');
    
    const currentITR = await fetchGeneratedITR();
    await saveITRToFile(currentITR, BASELINE_ITR_PATH, 'baseline ITR');
    
    console.log('✅ Baseline created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to create baseline:', error);
    return false;
  }
}

/**
 * Run regression test against baseline
 */
async function runRegressionTest(): Promise<boolean> {
  try {
    console.log('\n=== RUNNING REGRESSION TEST ===');
    
    // Fetch current ITR
    const currentITR = await fetchGeneratedITR();
    await saveITRToFile(currentITR, CURRENT_ITR_PATH, 'current ITR');
    
    // Load baseline
    const baselineITR = await loadITRFromFile(BASELINE_ITR_PATH, 'baseline ITR');
    
    if (!baselineITR) {
      console.log('⚠️  No baseline found. Creating baseline first...');
      return await createBaseline();
    }
    
    // Compare
    const isMatch = compareITRSections(baselineITR, currentITR);
    
    console.log('\n=== REGRESSION TEST SUMMARY ===');
    console.log(`Result: ${isMatch ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!isMatch) {
      console.log('\nTo update baseline with current results, run: npm run test:itr -- --update-baseline');
    }
    
    return isMatch;
  } catch (error) {
    console.error('❌ Regression test failed:', error);
    return false;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const shouldCreateBaseline = args.includes('--create-baseline') || args.includes('--update-baseline');
  
  try {
    console.log('Starting ITR regression test...');
    
    let success: boolean;
    
    if (shouldCreateBaseline) {
      success = await createBaseline();
    } else {
      success = await runRegressionTest();
    }
    
    console.log('\nTest completed.');
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Export functions for testing
export { 
  fetchGeneratedITR, 
  createBaseline, 
  runRegressionTest, 
  compareITRSections 
};

// Run main function when executed as script
main(); 
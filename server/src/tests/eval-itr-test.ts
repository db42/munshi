import fs from 'fs/promises';
import path from 'path';

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
    const response = await fetch('http://localhost:3000/api/itr/123/2024-25');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    // The API returns the ITR data directly without a success wrapper
    if (!data || !data.ITR) {
      throw new Error('Invalid response: No ITR data found');
    }
    
    return data;
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
 * Deep comparison of two objects, ignoring certain fields
 */
function deepCompare(obj1: any, obj2: any, path: string = ''): Array<{path: string, baseline: any, current: any}> {
  const differences: Array<{path: string, baseline: any, current: any}> = [];
  
  // Skip comparison for timestamps and other dynamic fields
  const skipFields = ['timestamp', 'createdAt', 'updatedAt', 'Date'];
  
  if (skipFields.some(field => path.endsWith(field))) {
    return differences;
  }
  
  if (obj1 === obj2) {
    return differences;
  }
  
  if (typeof obj1 !== typeof obj2) {
    differences.push({ path, baseline: obj1, current: obj2 });
    return differences;
  }
  
  if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = [...new Set([...keys1, ...keys2])];
    
    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      const subDiffs = deepCompare(obj1[key], obj2[key], newPath);
      differences.push(...subDiffs);
    }
  } else if (obj1 !== obj2) {
    differences.push({ path, baseline: obj1, current: obj2 });
  }
  
  return differences;
}

/**
 * Compare key ITR sections for regression testing
 */
function compareITRSections(baseline: any, current: any): boolean {
  console.log('\n=== ITR REGRESSION COMPARISON ===');
  
  const differences = deepCompare(baseline, current);
  
  if (differences.length === 0) {
    console.log('✅ No differences found - No regression detected!');
    return true;
  }
  
  console.log(`❌ Found ${differences.length} differences:`);
  
  // Group differences by section
  const sectionDiffs: Record<string, Array<{path: string, baseline: any, current: any}>> = {};
  
  differences.forEach(diff => {
    const section = diff.path.split('.')[0] || 'root';
    if (!sectionDiffs[section]) {
      sectionDiffs[section] = [];
    }
    sectionDiffs[section].push(diff);
  });
  
  // Report differences by section
  Object.entries(sectionDiffs).forEach(([section, diffs]) => {
    console.log(`\n--- ${section.toUpperCase()} (${diffs.length} differences) ---`);
    diffs.slice(0, 5).forEach(diff => { // Show max 5 per section
      console.log(`  ${diff.path}: ${JSON.stringify(diff.baseline)} → ${JSON.stringify(diff.current)}`);
    });
    if (diffs.length > 5) {
      console.log(`  ... and ${diffs.length - 5} more differences`);
    }
  });
  
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
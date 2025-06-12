/**
 * This script automates the generation of TypeScript type definitions from ITR JSON schemas.
 * The script is configured to generate types for both ITR-1 and ITR-2 forms from the latest schema files provided by the income tax department.
 * 
 * This script is typically run before `post-process-types.ts`.
 * It can be executed via `npm run types:generate` or as part of `npm run types:all`.
 */
import { quicktype, InputData, JSONSchemaInput, TypeScriptTargetLanguage } from "quicktype-core";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates TypeScript types from a JSON schema file and writes them to an output file.
 * @param schemaPath The path to the input JSON schema file.
 * @param outputTypePath The path where the generated TypeScript file will be saved.
 */
async function generateTypes(schemaPath: string, outputTypePath: string) {
    // Read schema file
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    // Set up quicktype
    const inputData = new InputData();
    const schemaInput = new JSONSchemaInput(undefined);

    // Add schema to input
    await schemaInput.addSource({
        name: "ITR",
        schema: JSON.stringify(schema)
    });

    inputData.addInput(schemaInput);

    // Configure output for TypeScript generation.
    const outputOptions = {
        ignoreJsonifyIndicator: true, // Don't generate the 'ITRClass' helper class.
        justTypes: true, // Output only types, without any helper functions.
        preferTypes: false
    };

    // Generate TypeScript types using quicktype.
    const typescriptResults = await quicktype({
        inputData,
        lang: new TypeScriptTargetLanguage(),
        rendererOptions: outputOptions,
        alphabetizeProperties: true, // Keep properties in alphabetical order for consistency.
        allPropertiesOptional: false,
        inferMaps: false,
        inferEnums: true, // Infer enums from strings with a limited set of values.
        inferDateTimes: false,
        inferIntegerStrings: false,
        fixedTopLevels: true
    });

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputTypePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(outputTypePath, typescriptResults.lines.join("\n"));
    console.log(`Types written to ${outputTypePath}`);
}

// Generate types for ITR-2
let schemaPath = path.join(__dirname, '../../schema/ITR-2_2024_Main_V1.2.json');
let outputPath = path.join(__dirname, '../types/itr.ts');
generateTypes(schemaPath, outputPath).catch(error => {
    console.error('Error generating types:', error);
    process.exit(1);
});

// Generate types for ITR-1
schemaPath = path.join(__dirname, '../../schema/ITR-1_2025_Main_V1.0 3.json');
outputPath = path.join(__dirname, '../types/itr-1.ts');
generateTypes(schemaPath, outputPath).catch(error => {
    console.error('Error generating types:', error);
    process.exit(1);
});
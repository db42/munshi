import { quicktype, InputData, JSONSchemaInput, TypeScriptTargetLanguage } from "quicktype-core";
import * as fs from 'fs';
import * as path from 'path';

async function generateTypes() {
    // Read schema file
    const schemaPath = path.join(__dirname, '../../schema/ITR-2_2024_Main_V1.2.json');
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

    // Configure output
    const outputOptions = {
        ignoreJsonifyIndicator: true,
        justTypes: true,
        preferTypes: false
    };

    // Generate TypeScript
    const typescriptResults = await quicktype({
        inputData,
        lang: new TypeScriptTargetLanguage(),
        rendererOptions: outputOptions,
        alphabetizeProperties: true,
        allPropertiesOptional: false,
        inferMaps: false,
        inferEnums: true,
        inferDateTimes: false,
        inferIntegerStrings: false,
        fixedTopLevels: true
    });

    // Create types directory if it doesn't exist
    const typesDir = path.join(__dirname, '../types');
    if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
    }

    // Write to file
    const outputPath = path.join(typesDir, 'itr.ts');
    fs.writeFileSync(outputPath, typescriptResults.lines.join("\n"));
    console.log(`Types written to ${outputPath}`);
}

generateTypes().catch(error => {
    console.error('Error generating types:', error);
    process.exit(1);
});
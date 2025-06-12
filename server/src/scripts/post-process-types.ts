/**
 * This script post-processes auto-generated TypeScript type definition files (itr.ts and itr-1.ts).
 * It is designed to run after `generate-itr-types.ts`.
 * The script performs the following main operations:
 * 1.  It ensures that the `Itr` type is imported from `./common-itr` in `itr.ts`.
 * 2.  It removes the `Itr` and `ITRClass` interfaces from `itr.ts` because they are centralized in `common-itr.ts`.
 * 3.  It identifies type declarations that are duplicated between `itr.ts` and `itr-1.ts`.
 * 4.  It removes these duplicate declarations from `itr-1.ts` and replaces them with a single import from `itr.ts`,
 *     to avoid redundancy and maintain a single source of truth.
 * 5.  It cleans up by removing auto-generated helper functions and classes (like `Convert`) that are not needed.
 * This helps in keeping the type definitions clean, modular, and easier to maintain.
 * 
 * This is run using `npm run types:post-process` or `npm run types:all`.
 */
import { Project, Node } from "ts-morph";
import * as path from 'path';

async function main() {
    const project = new Project();

    const itrTypesPath = path.join(__dirname, '../types/itr.ts');
    const itr1TypesPath = path.join(__dirname, '../types/itr-1.ts');

    const itrSourceFile = project.addSourceFileAtPath(itrTypesPath);

    // Add import for Itr from common-itr.ts to itr.ts
    const commonItrImportSpecifier = './common-itr';
    const existingCommonItrImports = itrSourceFile.getImportDeclarations().filter(
        (imp) => imp.getModuleSpecifierValue() === commonItrImportSpecifier
    );
    existingCommonItrImports.forEach((imp) => imp.remove());
    itrSourceFile.insertImportDeclaration(0, {
        moduleSpecifier: commonItrImportSpecifier,
        namedImports: ['Itr'],
        isTypeOnly: true,
    });
    console.log(`Ensured 'Itr' is imported from '${commonItrImportSpecifier}' in ${path.basename(itrTypesPath)}.`);
    
    const itr1SourceFile = project.addSourceFileAtPath(itr1TypesPath);

    // Remove Itr and ITRClass from itr.ts as they now live in common-itr.ts
    ['Itr', 'ITRClass'].forEach(name => {
        const interfaceNode = itrSourceFile.getInterface(name);
        if (interfaceNode) {
            interfaceNode.remove();
            console.log(`Removed interface ${name} from ${path.basename(itrTypesPath)}`);
        }
    });

    // Get all top-level exportable declaration names from itr.ts to identify duplicates.
    const itrDeclarationNames = new Set<string>();
    itrSourceFile.getStatements().forEach((statement: Node) => {
        if (Node.isInterfaceDeclaration(statement) || Node.isTypeAliasDeclaration(statement) || Node.isEnumDeclaration(statement)) {
            const name = statement.getName();
            if (name) {
                itrDeclarationNames.add(name);
            }
        }
    });

    const typesToImport: string[] = [];

    // Find and remove declarations in itr-1.ts that already exist in itr.ts.
    itr1SourceFile.getStatements().forEach((statement: Node) => {
        if (Node.isInterfaceDeclaration(statement) || Node.isTypeAliasDeclaration(statement) || Node.isEnumDeclaration(statement)) {
            const nameNode = statement.getNameNode();
            if (nameNode) {
                const name = nameNode.getText();
                // Check if the declaration exists in itr.ts and is not the primary Itr1 type
                if (itrDeclarationNames.has(name) && name !== 'Itr1'  && name !== 'ITRClass' ) {
                    typesToImport.push(name);
                    statement.remove();
                }
            }
        }
    });

    // Remove the auto-generated helper class and functions if they exist.
    const convertClass = itr1SourceFile.getClass('Convert');
    if (convertClass) {
        convertClass.remove();
    }
    const helperFunctions = [
        "invalidValue", 
        "prettyTypeName", 
        "jsonToJSProps", 
        "jsToJSONProps", 
        "transform", 
        "cast", 
        "uncast", 
        "l", 
        "a", 
        "u", 
        "o", 
        "m", 
        "r"
    ];
    helperFunctions.forEach(funcName => {
        const func = itr1SourceFile.getFunction(funcName);
        if(func) {
            func.remove();
        }
    });


    // Add a single import statement for all removed types at the top of itr-1.ts.
    if (typesToImport.length > 0) {
        // Remove any existing imports from './itr' to avoid duplication
        const existingImports = itr1SourceFile.getImportDeclarations().filter(
            (imp) => imp.getModuleSpecifierValue() === './itr'
        );
        existingImports.forEach((imp) => imp.remove());

        itr1SourceFile.insertImportDeclaration(0, {
            moduleSpecifier: './itr',
            namedImports: typesToImport,
            isTypeOnly: true
        });
        console.log(`Removed ${typesToImport.length} duplicate types from itr-1.ts and added a consolidated import.`);
    }

    // Clean up the end of the file by removing any trailing helper functions or classes
    // that were part of the auto-generation process but are no longer needed.
    const allDeclarations = itr1SourceFile.getStatements().filter(s =>
        Node.isInterfaceDeclaration(s) || Node.isTypeAliasDeclaration(s) || Node.isEnumDeclaration(s)
    );

    if (allDeclarations.length > 0) {
        const lastDeclaration = allDeclarations[allDeclarations.length - 1];
        const endOfDeclarations = lastDeclaration.getEnd();
        
        const fullText = itr1SourceFile.getFullText();
        const newText = fullText.substring(0, endOfDeclarations);

        itr1SourceFile.replaceWithText(newText);
    }

    await itrSourceFile.save();
    await itr1SourceFile.save();
    console.log(`Type post-processing complete. Cleaned file: ${itrTypesPath}`);
    console.log(`Type post-processing complete. Cleaned file: ${itr1TypesPath}`);
}

main().catch(error => {
    console.error("Error during type post-processing:", error);
    process.exit(1);
}); 
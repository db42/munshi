import { loadPDF } from '../services/pdfParserTabula';
import path from 'path';
import { convertForm16ToITR } from '../generators/itr/form16ToITR';
import { Form16 } from '../types/form16';
import fs from 'fs';

const testFile = process.argv[2];
if (!testFile) {
    console.error('Please provide path to PDF file');
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), testFile);
//load PDF file and extract tables. convert form16 to ITR
loadPDF(filePath)
    .then(tables => {
        if (tables.kind == 'error') {
            console.error('Failed to extract tables:', tables.error);
            return;
        }
        console.log('Extracted tables:', tables.data);
        // Assuming you have a function to convert tables to Form16 data
        // const form16Data = convertTablesToForm16(tables);
        const ITRResult = convertForm16ToITR(tables.data);
        if (ITRResult.success) {
            console.log('Generated ITR:', ITRResult.data);
            //write data to a local file
            const filePath = path.join(__dirname, 'itr-output.json');
            fs.writeFileSync(filePath, JSON.stringify(ITRResult.data, null, 2));
        } else {
            console.error('Failed to generate ITR:', ITRResult.error);
        }
    })
    .catch(error => console.error('Failed to load PDF:', error));

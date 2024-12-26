import { loadPDF } from '../services/pdfParserTabula';
import path from 'path';

const testFile = process.argv[2];
if (!testFile) {
    console.error('Please provide path to PDF file');
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), testFile);
loadPDF(filePath)
    .then(() => console.log('Test completed'))
    .catch(error => console.error('Test failed:', error));
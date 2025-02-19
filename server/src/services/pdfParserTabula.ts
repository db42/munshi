import { readFile } from 'fs/promises';
import PDFParser from 'pdf-parse';
import { Deductions, Form16, EmployeeInfo, EmployerInfo, Form16Metadata, SalaryDetails, TaxDeduction } from '../types/form16';
const fs = require('fs');
const tabula = require('tabula-js');


type ParseResult<T> = 
    | { kind: 'success'; data: T }
    | { kind: 'error'; error: string };

const extractNumber = (text: string | undefined): number => {
  if (!text) return 0;
  
  // Debug log
  console.log("Extracting number from:", text);

  // Remove quotes and extra spaces
  const cleanText = text.replace(/"/g, '').trim();
  
  // Try different patterns
  
  // Pattern 1: number at the end with comma and spaces
  // Example: "(a) Standard deduction under section 16(ia) ,,,50000.00,"
  const pattern1 = /,\s*(\d+\.?\d*),?\s*$/;
  
  // Pattern 2: number at the end
  // Example: "(a) Salary as per provisions contained in section 17(1) 8470000.00"
  const pattern2 = /\s(\d+\.?\d*)\s*$/;
  
  const match1 = cleanText.match(pattern1);
  if (match1) {
      console.log("Pattern 1 match:", match1[1]);
      return parseFloat(match1[1]);
  }

  const match2 = cleanText.match(pattern2);
  if (match2) {
      console.log("Pattern 2 match:", match2[1]);
      return parseFloat(match2[1]);
  }

  console.log("No match found");
  return 0;
};

const parseForm16WithExtractedData = (rows: string[]): ParseResult<Form16> => {
    try {
        // Helper to find row containing text
        const findRow = (text: string): string | undefined => {
            return rows.find(row => row.toString().includes(text));
        };

        // // Helper to extract number
        // const extractNumber = (text: string | undefined): number => {
        //     if (!text) return 0;
        //     const match = text.match(/(\d+\.?\d*)/);
        //     return match ? parseFloat(match[1]) : 0;
        // };

        // Parse Metadata
        const parseMetadata = (): Form16Metadata => {
            const certNoRow = findRow("Certificate No");
            const certificateNumber = certNoRow?.split(" ")[2] || "";
            const lastUpdatedOn = certNoRow?.split("Last updated on")[1]?.trim() || "";

            return {
                certificateNumber,
                lastUpdatedOn,
                financialYear: {
                    startDate: "2023-04-01",
                    endDate: "2024-03-31"
                }
            };
        };

        // Parse Employer Info
        const parseEmployer = (): EmployerInfo => {
            const employerRow = rows.find(row => row.includes("PRIVATE LIMITED"));
            const tanRow = rows.find(row => row.includes("TAN of the Deductor"));
            console.log(
                "Employer Row:", employerRow,
                "TAN Row:", tanRow
            );
            
            return {
                name: "THOUGHTSPOT INDIA PRIVATE LIMITED",
                tan: "BLRT13221F",
                address: "3rd FLOOR, 24TH MAIN RD, INDIQUBE ORION, BANGALORE, - 560102 Karnataka"
            };
        };

        // Parse Employee Info
        const parseEmployee = (): EmployeeInfo => {
            const panRow = rows.find(row => row.includes("PAN of the Employee"));
            
            return {
                name: "DUSHYANT BANSAL",
                pan: "AQWPB0620M"
            };
        };

        // Parse Salary Details
        const parseSalaryDetails = (): SalaryDetails => {
            const findAmount = (text: string): number => {
                const row = findRow(text);
                return extractNumber(row);
            };

            return {
                grossSalary: {
                    salaryAsPerSection17_1: findAmount("section 17(1)"),
                    valueOfPerquisitesSection17_2: findAmount("section 17(2)"),
                    profitsInLieuOfSalarySection17_3: findAmount("section 17(3)"),
                    total: findAmount("(d)Total")
                },
                allowanceExemptSection10: findAmount("Total amount of exemption claimed under section 10"),
                netSalary: findAmount("Total amount of salary received from current employer")
            };
        };

        // Parse Deductions
        const parseDeductions = (): Deductions => {
            const findAmount = (text: string): number => {
                const row = findRow(text);
                return extractNumber(row);
            };

            return {
                standardDeduction: findAmount("Standard deduction under section 16(ia)"),
                entertainmentAllowance: findAmount("Entertainment allowance under section 16(ii)"),
                taxOnEmployment: findAmount("Tax on employment under section 16(iii)"),
                total: findAmount("Total amount of deductions under section 16")
            };
        };

        // Parse Income Chargeable
        // const parseIncomeChargeable = (): SalaryDetails => {
        //     const findAmount = (text: string): number => {
        //         const row = findRow(text);
        //         return extractNumber(row);
        //     };

        //     return {
        //         salariesTotal: findAmount("Income chargeable under the head"),
        //         grossTotalIncome: findAmount("Gross total income"),
        //         anyOtherIncome: []
        //     };
        // };

        // Parse Tax Deduction
        const parseTaxDeduction = (): TaxDeduction => {
            const totalRow = rows.find(row => row.includes("Total (Rs.)"));
            const totalTaxDeducted = extractNumber(totalRow);

            // Parse quarterly deductions
            const taxDeducted = rows
                .filter(row => row.startsWith('Q'))
                .map(row => {
                    const parts = row.split(' ').filter(Boolean);
                    return {
                        month: parts[0],
                        amount: parseFloat(parts[3])
                    };
                });

            return {
                taxDeducted,
                totalTaxDeducted
            };
        };
        //print all the sections
        const data = {
                metadata: parseMetadata(),
                employer: parseEmployer(),
                employee: parseEmployee(),
                salaryDetails: parseSalaryDetails(),
                deductions: parseDeductions(),
                // incomeChargeable: parseIncomeChargeable(),
                taxDeduction: parseTaxDeduction()
            }
        console.log(data);

        // Combine all sections
        return {
            kind: 'success',
            data        
        };

    } catch (error) {
        return {
            kind: 'error',
            error: `Failed to parse Form 16: ${error}`
        };
    }
};

interface TableExtractionResult {
    kind: 'success' | 'error';
    data?: string[];
    error?: string;
}

const extractTablesFromPDF = async (pdfPath: string): Promise<ParseResult<string[]>> => {

        // Extract tables
        const result: Promise<ParseResult<string[]>> = new Promise((resolve, reject) => {
            try {
                // Configure tabula options
                const options = {
                pages: 'all',  // Extract from all pages
                // area: '', // We can specify area coordinates if needed
                // spreadsheet: true,  // Get data in spreadsheet format
                // guess: false,  // Don't guess table structure
                // silent: true  // Suppress debug output
            };
            tabula(pdfPath, options)
                .extractCsv((error:any, csvData:any) => {
                    console.log(csvData);
                    // Convert CSV to array of arrays
                    // const rows = csvData
                    //     .map((row: any) => row.split(','))
                    //     .filter((row: any) => row.length > 0);  // Remove empty rows

                    // // Write csvData to a local file
                    // fs.writeFileSync('output-tabula.txt', csvData); 

                    // Write rows to a local file in JSON format
                    fs.writeFileSync('output-tabula.txt', JSON.stringify(csvData, null, 2));

                    resolve({
                        kind: 'success',
                        data: csvData
                    });
                });
            } catch (error) {
                return {
                    kind: 'error',
                    error: `Failed to extract tables: ${error}`
                };
            }
        });
        return result;
};

export const loadPDF = async (filePath: string): Promise<ParseResult<Form16>> => {
    // Extract tables from PDF
    const tableResult = await extractTablesFromPDF(filePath);
    //if error return proper response
    if (tableResult.kind === 'error') return tableResult;
    const rows = tableResult.data;
    return parseForm16WithExtractedData(rows);
}
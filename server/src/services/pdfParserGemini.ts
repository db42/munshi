import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs/promises';
import { 
  Form16, 
  Form16Metadata,
  EmployerInfo,
  EmployeeInfo,
  SalaryDetails,
} from '../types/form16';
import * as sampleData from './sampleForm16JsonGeminiPrompt.json';
import { Config, defaultConfig } from "./geminiConfig";
import { ParseResult } from '../utils/parserTypes';

console.log(defaultConfig);

// Get type information from TypeScript interface
type TypeOf<T> = T extends string ? "string"
  : T extends number ? "number"
  : T extends boolean ? "boolean"
  : T extends Array<infer U> ? [TypeStructure<U>]
  : T extends object ? { [K in keyof T]: TypeStructure<T[K]> }
  : never;

type TypeStructure<T> = {
  [K in keyof T]: TypeOf<T[K]>
};

// Helper function to generate interface structure from TypeScript type
function generateInterfaceStructure<T>(): TypeStructure<T> {
  // This function is just a type helper - implementation is not needed
  // as we're using TypeScript's type system at compile time
  return {} as TypeStructure<T>;
}

export const loadPDFGemini = async (filePath: string, config: Config = defaultConfig()): Promise<ParseResult<Form16>> => {
  try {
    // Initialize Gemini
    console.log(process.env.GEMINI_API_KEY);
    console.log('Initializing Gemini with API key:', config.apiKey);
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.model });

    // Read the PDF file
    const fileContent = await fs.readFile(filePath);
    
    // Convert to base64
    const base64Content = fileContent.toString('base64');

    // Get the interface structure using TypeScript's type system
    // const interfaceStructure = generateInterfaceStructure<Form16>();

    // Prepare the parts for the prompt
    const parts = [
      {
        text: `Please analyze this Form 16 document and extract the information according to the following structure, where each field shows its expected type:
      ${JSON.stringify(sampleData, null, 2)}
      
      Please follow these rules:
      - Strings should be returned as text values
      - Numbers should be returned as numeric values, not strings
      - Dates should be in ISO format (YYYY-MM-DD)
      - Return the data in strict JSON format matching the structure above
      - Include all required fields and any optional fields if the information is present in the document
      - Arrays should be populated with all relevant entries found in the document
      - State codes for reference:
 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
 Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21- Meghalaya;
 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
 Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh; 99- State outside India`

      },
      {
        inlineData: {
          data: base64Content,
          mimeType: 'application/pdf'
        }
      }
    ];

    // Generate content
    const result = await model.generateContent(parts);
    const response = await result.response;
    console.log('gemini response', response);
    const text = response.text();
    console.log('text', text);
    // console.log(parts[0].text);
    // const text = '';
    // return {
    //   success: false,
    //   error: 'Gemini API not yet implemented'
    // }

    try {
      // Parse the JSON response
      const cleanText = text.replace("```json", "")
                .replace("```", "")
                .trim();
      const parsedData: Form16 = JSON.parse(cleanText);
      
      // Validate the parsed data
      // validateForm16Data(parsedData);

      return {
        success: true,
        data: parsedData
      };
    } catch (parseError) {
      console.error('Error parsing response :', parseError);
      throw parseError;
      // return {
      //   success: false,
      //   error: `Failed to parse Gemini response as JSON: ${JSON.stringify(parseError)}`
      // };
    }
  } catch (error) {
    console.error('Error parsing PDF with Gemini:', error);
    throw error;
    // return {
    //   success: false,
    //   error: `PDF parsing failed: ${JSON.stringify(error)}`
    // };
  }
};


function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}
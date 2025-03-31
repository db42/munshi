import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs/promises';
import { 
  USEquityStatement, 
  USCGEquityTransaction, 
  DividendIncome, 
  CapitalGainSummary 
} from '../types/usEquityStatement';
import * as sampleData from './sampleUSEquityJsonGeminiPrompt.json';
import { defaultConfig, Config } from "./geminiConfig";
import { ParseResult } from '../utils/parserTypes';

/**
 * Parse a Charles Schwab year-end summary PDF using Gemini API.
 * Uses Gemini's vision capabilities to extract structured data from PDF documents.
 * 
 * @param filePath Path to the PDF file
 * @param taxpayerInfo Basic taxpayer information
 * @param config Configuration for the Gemini API
 * @returns A ParseResult containing the parsed USEquityStatement or an error
 */
export const parseUSEquityPDFWithGemini = async (
  filePath: string,
  taxpayerInfo: { name: string; pan: string },
  config: Config = defaultConfig()
): Promise<ParseResult<USEquityStatement>> => {
  try {
    // Initialize Gemini
    console.log('Initializing Gemini with API key:', config.apiKey);
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.model });

    // Read the PDF file
    const fileContent = await fs.readFile(filePath);
    
    // Convert to base64
    const base64Content = fileContent.toString('base64');

    // Prepare the parts for the prompt
    const parts = [
      {
        text: `Please analyze this Charles Schwab year-end summary document and extract the information according to the following structure where each field shows its expected type:
      ${JSON.stringify(sampleData, null, 2)}

      Please follow these rules:
      - It is extremly critical to extract all transaction entries including acquisition date, sell date, security name, etc.
      - Extract all dividend entries received (specific securities, amounts, and dates)
      - Extract all details about capital gains/losses (short-term and long-term)
      - Ensure all monetary values are numeric, not strings
      - For the statement period, use the tax year covered (likely April 1 to March 31 for Indian tax purposes)
      - Extract any tax withholding information
      - Return the data in strict JSON format matching the structure above
      - If certain information is not available in the document, use null or 0 as appropriate
      - Dates should be in ISO format (YYYY-MM-DD)`
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
    const text = response.text();
    
    try {
      // Parse the JSON response
      const cleanText = text.replace(/```json|```/g, "").trim();
      const parsedData: USEquityStatement = JSON.parse(cleanText);

      console.log(JSON.stringify(parsedData, null, 2));
      
      
      return {
        success: true,
        data: parsedData
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return {
        success: false,
        error: `Failed to parse Gemini response as JSON: ${parseError}`
      };
    }
  } catch (error) {
    console.error('Error parsing PDF with Gemini:', error);
    return {
      success: false,
      error: `PDF parsing failed: ${error}`
    };
  }
}; 
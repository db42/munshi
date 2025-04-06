import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs/promises';
import { AISData } from '../types/ais'; // Import the AISData interface
import * as sampleAISData from './sampleAISJsonGeminiPrompt.json';
import { Config, defaultConfig } from "../config/geminiConfig";
import { ParseResult } from '../utils/parserTypes';
import { logger } from '../utils/logger'; // Assuming logger exists
import { convertDateStringsToDates } from './aisUtils';

/**
 * Parses an Annual Information Statement (AIS) PDF using the Gemini model.
 * 
 * @param filePath - Path to the AIS PDF file.
 * @param config - Optional configuration for the Gemini API.
 * @returns A promise that resolves to a ParseResult containing the parsed AISData or an error.
 */
export const parseAISPDFWithGemini = async (filePath: string, config: Config = defaultConfig()): Promise<ParseResult<AISData>> => {
  logger.info(`Starting AIS PDF parsing for file: ${filePath}`);
  try {
    // Initialize Gemini
    logger.debug('Initializing Gemini with API key.');
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.model });

    // Read the PDF file
    logger.debug(`Reading PDF file: ${filePath}`);
    const fileContent = await fs.readFile(filePath);
    
    // Convert to base64
    const base64Content = fileContent.toString('base64');
    logger.debug('PDF content converted to base64.');

    // --- Construct the Prompt ---
    const promptText = `Please analyze this Annual Information Statement (AIS) document and extract the information according to the following JSON structure. Ensure all monetary amounts are numbers, not strings. Dates should ideally be in YYYY-MM-DD format if possible, otherwise use the format present in the document.

JSON Structure Example:
${JSON.stringify(sampleAISData, null, 2)}

Return ONLY the extracted data in strict JSON format matching the structure above. Do not include any introductory text, explanations, or markdown formatting like \\\`\\\`\\\`json.
`;

    const parts = [
      { text: promptText },
      {
        inlineData: {
          data: base64Content,
          mimeType: 'application/pdf'
        }
      }
    ];
    // --------------------------

    // Generate content
    logger.info('Sending request to Gemini API...');
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();
    logger.info('Received response from Gemini API.');
    logger.debug('Gemini raw response text:', text);

    try {
      // Clean and Parse the JSON response
      const cleanText = text.replace(/^```json|```$/g, "").trim(); // Remove markdown code fences
      const parsedData: AISData = JSON.parse(cleanText);
      logger.info('Successfully parsed Gemini response as JSON.');
      
      // Basic Validation (Add more comprehensive validation as needed)
      if (!parsedData.assessmentYear || !parsedData.financialYear || !parsedData.taxpayerInfo || !parsedData.taxpayerInfo.pan) {
          logger.warn('Parsed AIS data missing essential fields (AY, FY, PAN).');
          // Depending on requirements, you might want to throw an error here
      }

      // Convert date strings to Date objects
      convertDateStringsToDates(parsedData);
      
      return {
        success: true,
        data: parsedData
      };
    } catch (parseError) {
      logger.error('Error parsing Gemini JSON response:', { 
          error: parseError instanceof Error ? parseError.message : parseError, 
          rawResponse: text // Log the raw response for debugging
      });
      return {
        success: false,
        error: `Failed to parse Gemini response as JSON. Error: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      };
    }
  } catch (error) {
    logger.error('Error processing AIS PDF with Gemini:', { 
        error: error instanceof Error ? error.message : error,
        filePath: filePath 
    });
    return {
      success: false,
      error: `AIS PDF parsing failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}; 
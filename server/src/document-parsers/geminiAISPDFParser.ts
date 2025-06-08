import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as fs from 'fs/promises';
import { AISData } from '../types/ais'; // Import the AISData interface
import * as sampleAISData from './sampleAISJsonGeminiPrompt.json';
import { Config, defaultConfig } from "../config/geminiConfig";
import { ParseResult } from '../utils/parserTypes';
import { getLogger, ILogger } from '../utils/logger'; // Assuming logger exists
import { convertDateStringsToDates } from './aisUtils';

const logger: ILogger = getLogger('geminiAISPDFParser');


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
    logger.debug('Reading PDF file and converting to base64...');
    const fileBuffer = await fs.readFile(filePath);
    const base64Content = fileBuffer.toString('base64');
    logger.debug('PDF content converted to base64.');

    logger.debug('Initializing Gemini with API key.');
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.model });

    const instructions = `Please analyze this Annual Information Statement (AIS) document and extract the information according to the following JSON structure. Ensure all monetary amounts are numbers, not strings. Dates should ideally be in YYYY-MM-DD format if possible, otherwise use the format present in the document.`;
    const promptText = `${instructions}\n\nJSON Structure Example:\n${JSON.stringify(sampleAISData, null, 2)}\n\nReturn ONLY the extracted data in strict JSON format matching the structure above. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.`;

    const parts: Part[] = [
      { text: promptText },
      {
        inlineData: {
          data: base64Content,
          mimeType: 'application/pdf'
        }
      }
    ];

    logger.debug('Sending request to Gemini for AIS parsing.');
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: config.maxOutputTokens,
        responseMimeType: "application/json",
      }
    });

    if (!result.response) {
        logger.error('No response object in Gemini result.');
        return { success: false, error: 'No response object in Gemini result' };
    }

    const response = result.response;
    if (!response.candidates || response.candidates.length === 0) {
        logger.error('No candidates in Gemini response.');
        return { success: false, error: 'No candidates in Gemini response' };
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        logger.error('No parts in Gemini response candidate content.');
        return { success: false, error: 'No parts in Gemini response candidate content' };
    }
    
    const responseText = candidate.content.parts
        .map((part: { text?: string }) => part.text || '')
        .join('')
        .trim();

    if (!responseText) {
        logger.error('Empty text response from Gemini.');
        return { success: false, error: 'Empty text response from Gemini' };
    }
    
    logger.info('Received response from Gemini. Attempting to parse JSON. length: ' + responseText.length);

    let parsedData: AISData;
    try {
      parsedData = JSON.parse(responseText) as AISData;
    } catch (parseError: any) {
        logger.error('Failed to parse JSON response from Gemini:', parseError);
        logger.error('Problematic Gemini response text:', responseText);
        return {
            success: false,
            error: `Failed to parse JSON response from Gemini: ${parseError.message}`,
        };
    }
      
    // Basic Validation (Add more comprehensive validation as needed)
    if (!parsedData.assessmentYear || !parsedData.financialYear || !parsedData.taxpayerInfo || !parsedData.taxpayerInfo.pan) {
        logger.warn('Parsed AIS data missing essential fields (AY, FY, PAN).');
        // Depending on requirements, you might want to throw an error here
    }

    // Convert date strings to Date objects
    convertDateStringsToDates(parsedData);
    logger.info('AIS PDF parsed successfully.');
    
    return {
      success: true,
      data: parsedData
    };
  } catch (error: any) {
    logger.error('Error during AIS PDF parsing with Gemini:', { 
        filePath, 
        errorMessage: error.message, 
        errorStack: error.stack 
    });
    return {
      success: false,
      error: `Error during AIS PDF parsing for file ${filePath}: ${error.message}`,
    };
  }
}; 
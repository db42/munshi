import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import fs from 'fs/promises';
import { ParsedForm26AS, AnnualTaxStatement } from '../types/form26AS';
import { ParseResult } from '../utils/parserTypes';
import { getLogger, ILogger } from '../utils/logger';
import { Config, defaultConfig } from "../config/geminiConfig";
import samplePrompt from './sampleForm26ASJsonGeminiPrompt.json';

const logger: ILogger = getLogger('form26ASPDFParser');

/**
 * Parses Form 26AS PDF content using Gemini AI.
 *
 * @param filePath - The path to the PDF file.
 * @param config - Optional configuration for the Gemini API.
 * @returns A ParseResult containing the structured Form 26AS data or an error.
 */
export const parseForm26ASPDFWithGemini = async (
    filePath: string,
    config: Config = defaultConfig()
): Promise<ParseResult<ParsedForm26AS>> => {
    logger.info(`Starting Form 26AS PDF parsing for file: ${filePath}`);

    try {
        logger.debug('Reading PDF file and converting to base64...');
        const fileBuffer = await fs.readFile(filePath);
        const base64Content = fileBuffer.toString('base64');
        logger.debug('PDF content converted to base64.');

        logger.debug('Initializing Gemini with API key.');
        const genAI = new GoogleGenerativeAI(config.apiKey);
        const model = genAI.getGenerativeModel({ model: config.model });

        const promptText = `${samplePrompt.instructions}\n\nJSON Structure Example:\n${JSON.stringify(samplePrompt.outputSchemaExample, null, 2)}\n\nReturn ONLY the extracted data in strict JSON format matching the structure above. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.`;

        const parts: Part[] = [
            { text: promptText },
            {
                inlineData: {
                    data: base64Content,
                    mimeType: 'application/pdf'
                }
            }
        ];

        logger.debug('Sending request to Gemini for Form 26AS parsing.');
        const result = await model.generateContent({ contents: [{ role: "user", parts }] });

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

        const cleanedResponseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

        logger.info('Received response from Gemini. Attempting to parse JSON.');

        let parsedData: AnnualTaxStatement;
        try {
            parsedData = JSON.parse(cleanedResponseText) as AnnualTaxStatement;
        } catch (parseError: any) {
            logger.error('Failed to parse JSON response from Gemini:', parseError);
            logger.error('Problematic Gemini response text:', cleanedResponseText);
            return {
                success: false,
                error: `Failed to parse JSON response from Gemini: ${parseError.message}`,
            };
        }

        // TODO: Add validation against a JSON schema for AnnualTaxStatement if needed.
        // TODO: Consider date conversions if necessary, similar to aisUtils.convertDateStringsToDates

        logger.info('Form 26AS PDF parsed successfully.');
        return { success: true, data: parsedData };

    } catch (error: any) {
        logger.error('Error during Form 26AS PDF parsing with Gemini:', { 
            filePath, 
            errorMessage: error.message, 
            errorStack: error.stack 
        });
        return {
            success: false,
            error: `Error during Form 26AS PDF parsing for file ${filePath}: ${error.message}`,
        };
    }
}; 
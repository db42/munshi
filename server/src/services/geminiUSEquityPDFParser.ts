import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs/promises';
import { USEquityStatement, TransactionType } from '../types/usEquityStatement';
import { ConversionResult } from '../generators/itr/types';
import * as sampleData from './sampleUSEquityJsonGeminiPrompt.json';
import { defaultConfig, Config } from "./geminiConfig";

/**
 * Parse a Charles Schwab year-end summary PDF using Gemini API.
 * Uses Gemini's vision capabilities to extract structured data from PDF documents.
 * 
 * @param filePath Path to the PDF file
 * @param taxpayerInfo Basic taxpayer information
 * @param config Configuration for the Gemini API
 * @returns A ConversionResult containing the parsed USEquityStatement or an error
 */
export const parseUSEquityPDFWithGemini = async (
  filePath: string,
  taxpayerInfo: { name: string; pan: string },
  config: Config = defaultConfig()
): Promise<ConversionResult<USEquityStatement>> => {
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
        text: `Please analyze this Charles Schwab year-end summary document and extract the information according to the following structure:
      ${JSON.stringify(sampleData, null, 2)}
      
      Please follow these rules:
      - Extract all details about dividends received (specific securities, amounts, and dates)
      - Extract all details about capital gains/losses (short-term and long-term)
      - Ensure all monetary values are numeric, not strings
      - For the statement period, use the tax year covered (likely April 1 to March 31 for Indian tax purposes)
      - Convert all USD amounts to INR using exchange rate of 82.5 if not explicitly mentioned
      - Extract any tax withholding information (usually 15% for dividends from US securities)
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
      const parsedData = JSON.parse(cleanText);
      
      // Create the USEquityStatement object
      const statement: USEquityStatement = {
        taxpayerName: taxpayerInfo.name,
        taxpayerPAN: taxpayerInfo.pan,
        brokerName: parsedData.brokerName || "Charles Schwab",
        brokerAccountNumber: parsedData.brokerAccountNumber || "",
        statementPeriod: {
          startDate: new Date(parsedData.statementPeriod?.startDate || ""),
          endDate: new Date(parsedData.statementPeriod?.endDate || "")
        },
        transactions: [], // We might not have detailed transactions from the summary PDF
        dividends: (parsedData.dividends || []).map((div: any) => ({
          securityName: div.securityName,
          symbol: div.symbol,
          paymentDate: new Date(div.paymentDate),
          grossAmount: div.grossAmount,
          taxWithheld: div.taxWithheld,
          netAmount: div.netAmount,
          exchangeRate: div.exchangeRate || 82.5,
          grossAmountINR: div.grossAmountINR,
          taxWithheldINR: div.taxWithheldINR,
          netAmountINR: div.netAmountINR
        })),
        capitalGains: {
          shortTerm: {
            totalProceeds: parsedData.capitalGains?.shortTerm?.totalProceeds || 0,
            totalCostBasis: parsedData.capitalGains?.shortTerm?.totalCostBasis || 0,
            totalGain: parsedData.capitalGains?.shortTerm?.totalGain || 0,
            totalForeignTaxPaid: parsedData.capitalGains?.shortTerm?.totalForeignTaxPaid || 0
          },
          longTerm: {
            totalProceeds: parsedData.capitalGains?.longTerm?.totalProceeds || 0,
            totalCostBasis: parsedData.capitalGains?.longTerm?.totalCostBasis || 0,
            totalGain: parsedData.capitalGains?.longTerm?.totalGain || 0,
            totalForeignTaxPaid: parsedData.capitalGains?.longTerm?.totalForeignTaxPaid || 0
          }
        },
        taxWithheld: {
          dividendTax: parsedData.taxWithheld?.dividendTax || 0,
          capitalGainsTax: parsedData.taxWithheld?.capitalGainsTax || 0
        }
      };

      // Create simplified transaction records from dividends
      // (we don't have real transactions, but these can be useful for display)
      statement.dividends.forEach(div => {
        statement.transactions.push({
          transactionId: `DIV-${div.symbol}-${div.paymentDate.getTime()}`,
          securityName: div.securityName,
          symbol: div.symbol,
          transactionDate: div.paymentDate,
          type: TransactionType.DIVIDEND,
          quantity: 0, // Not available from summary
          pricePerUnit: 0, // Not available from summary
          totalAmount: div.grossAmount,
          feesBrokerage: 0,
          exchangeRate: div.exchangeRate,
          amountINR: div.grossAmountINR,
          notes: 'Dividend payment extracted from year-end summary'
        });
      });

      return {
        success: true,
        data: statement
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
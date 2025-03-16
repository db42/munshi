import { ENDPOINTS, DEFAULT_HEADERS } from './config';
import { ParsedDocument, ParsedDocumentResponse } from '../types/parsedDocument';

/**
 * Fetch parsed data for a document
 * @param documentId - The document ID
 * @returns Promise with the parsed data
 */
export const getParsedDocumentData = async (documentId: string): Promise<ParsedDocument> => {
  try {
    const response = await fetch(`${ENDPOINTS.DOCUMENTS}/${documentId}/parsed-data`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch parsed document data');
    }

    const data: ParsedDocumentResponse = await response.json();
    console.log('Parsed document data:', data.parsedDocument);
    return data.parsedDocument;
  } catch (error) {
    console.error('Error fetching parsed document data:', error);
    throw error;
  }
};

export default { getParsedDocumentData }; 
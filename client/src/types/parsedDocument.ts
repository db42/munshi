/**
 * Interface for parsed document data
 */
export interface ParsedDocument {
  id: string;
  document_id: string;
  json_schema_type: string;
  json_schema_version: string;
  parsed_data: any;
  parser_version: string;
  created_at: string;
}

/**
 * Interface for parsed document API response
 */
export interface ParsedDocumentResponse {
  message: string;
  parsedDocument: ParsedDocument;
} 
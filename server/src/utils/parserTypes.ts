/**
 * Generic result type for all document parsers
 * 
 * @template T The type of data returned by the parser
 */
export interface ParseResult<T> {
  /** Whether the parsing was successful */
  success: boolean;
  
  /** The parsed data (if successful) */
  data?: T;
  
  /** Error message (if unsuccessful) */
  error?: string;
} 
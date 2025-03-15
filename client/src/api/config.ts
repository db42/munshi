// API base URL
export const API_BASE_URL = 'http://localhost:3000/api';

// API endpoints
export const ENDPOINTS = {
  // Document endpoints
  DOCUMENTS: `${API_BASE_URL}/documents`,
  DOCUMENTS_BY_USER: (userId: string) => `${API_BASE_URL}/documents/user/${userId}`,
  DOCUMENTS_BY_USER_AND_YEAR: (userId: string, year: string) => `${API_BASE_URL}/documents/user/${userId}/year/${year}`,
  DOCUMENT_BY_ID: (id: string) => `${API_BASE_URL}/documents/${id}`,
  UPLOAD_DOCUMENT: `${API_BASE_URL}/documents/upload`,
  PROCESS_DOCUMENT: `${API_BASE_URL}/documents/process`,
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Default user ID (for development/testing)
export const DEFAULT_USER_ID = '123';

// Default assessment year (for development/testing)
export const DEFAULT_ASSESSMENT_YEAR = '2024-25'; 
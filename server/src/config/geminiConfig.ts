// Configuration interface
export interface Config {
    apiKey: string;
    model: string;
    maxOutputTokens: number;
  }
  
 export function defaultConfig(): Config {
    return {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: 'gemini-2.5-flash-preview-05-20',
      maxOutputTokens: 65535,
    }
  };
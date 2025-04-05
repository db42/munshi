// Configuration interface
export interface Config {
    apiKey: string;
    model: string;
  }
  
 export function defaultConfig(): Config {
    return {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: 'gemini-2.0-flash'
    }
  };
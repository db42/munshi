export type SupportedLLMProvider = 'openai' | 'anthropic';

export interface AddressDetail {
  AddrDetail: string;
  CityOrTownOrDistrict: string;
  StateCode: string;
  PinCode: string;
}

export interface LLMConfig {
  temperature: number;
  modelName: string;
}

// ITR State codes mapping
export const STATE_CODES = {
  'ANDHRA PRADESH': '37',
  'ARUNACHAL PRADESH': '12',
  'ASSAM': '18',
  'BIHAR': '10',
  'CHHATTISGARH': '22',
  'GOA': '30',
  'GUJARAT': '24',
  'HARYANA': '06',
  'HIMACHAL PRADESH': '02',
  'JHARKHAND': '20',
  'KARNATAKA': '29',
  'KERALA': '32',
  'MADHYA PRADESH': '23',
  'MAHARASHTRA': '27',
  'MANIPUR': '14',
  'MEGHALAYA': '17',
  'MIZORAM': '15',
  'NAGALAND': '13',
  'ODISHA': '21',
  'PUNJAB': '03',
  'RAJASTHAN': '08',
  'SIKKIM': '11',
  'TAMIL NADU': '33',
  'TELANGANA': '36',
  'TRIPURA': '16',
  'UTTAR PRADESH': '09',
  'UTTARAKHAND': '05',
  'WEST BENGAL': '19',
  'DELHI': '07',
} as const;
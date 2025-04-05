import { PromptTemplate } from "langchain/prompts";
import { createLLM } from "./config";
import { AddressDetail, SupportedLLMProvider, STATE_CODES } from "./types";
import { ENV } from "../../config/env";

const PROMPT_TEMPLATE = `Parse the following Indian address and return a JSON object with these exact keys:
- AddrDetail: The detailed street address excluding city, state and pin
- CityOrTownOrDistrict: Only the city/town/district name
- StateCode: The full state name (I will convert to code)
- PinCode: The 6-digit pin code

Address to parse: {address}

Return only the JSON object with these exact keys.`;

const createPromptTemplate = () => 
  PromptTemplate.fromTemplate(PROMPT_TEMPLATE);

const getStateCode = (stateName: string): string => {
  const normalizedStateName = stateName.trim().toUpperCase();
  const stateCode = STATE_CODES[normalizedStateName as keyof typeof STATE_CODES];
  
  if (!stateCode) {
    throw new Error(`Invalid state name: ${stateName}`);
  }
  
  return stateCode;
};

const isValidParsedAddress = (obj: unknown): obj is Omit<AddressDetail, 'StateCode'> & { StateCode: string } => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as AddressDetail).AddrDetail === 'string' &&
    typeof (obj as AddressDetail).CityOrTownOrDistrict === 'string' &&
    typeof (obj as AddressDetail).StateCode === 'string' &&
    typeof (obj as AddressDetail).PinCode === 'string' &&
    /^\d{6}$/.test((obj as AddressDetail).PinCode)
  );
};

export const parseAddress = async (
  address: string,
  provider: SupportedLLMProvider = ENV.DEFAULT_LLM_PROVIDER as SupportedLLMProvider
): Promise<AddressDetail> => {
  try {
    const llm = createLLM(provider);
    const promptTemplate = createPromptTemplate();
    const formattedPrompt = await promptTemplate.format({ address });
    
    const response = await llm.invoke(formattedPrompt);
    const parsedResponse = JSON.parse(response.content);
    
    if (!isValidParsedAddress(parsedResponse)) {
      throw new Error('Invalid response format from LLM');
    }

    // Convert state name to state code
    const stateCode = getStateCode(parsedResponse.StateCode);

    return {
      ...parsedResponse,
      StateCode: stateCode,
    };
  } catch (error) {
    console.error('Error parsing address:', error);
    throw error;
  }
};
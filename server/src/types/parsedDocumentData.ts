// server/src/types/parsedDocumentData.ts
import { AISData } from './ais';
import { Form16 as Form16Data } from './form16'; // Assuming Form16 is the main export and renaming for clarity
import { AnnualTaxStatement as Form26ASData } from './form26AS'; // Assuming AnnualTaxStatement is the main export
import { USEquityStatement as USEquityCGStatementData, USInvestmentIncome } from './usEquityStatement';
import { CAMSMFCapitalGainData } from '../document-parsers/camsMFCapitalGainParser';
import { CharlesSchwabCSVData } from '../document-parsers/charlesSchwabCSVParser'; // This is for client's USEquityStatementData

export type ParsedDocumentData =
  | AISData
  | Form16Data
  | Form26ASData
  | USEquityCGStatementData // This is server's USEquityStatement
  | USInvestmentIncome
  | CAMSMFCapitalGainData
  | CharlesSchwabCSVData; // This is for client's USEquityStatementData which holds CharlesSchwabRecord[]

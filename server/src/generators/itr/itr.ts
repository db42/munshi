import { Itr2, ScheduleCGFor23, ScheduleFA, ScheduleOS, ScheduleTR1, ScheduleFSI, PartBTTI, Itr, ScheduleTDS2, ScheduleIT, ScheduleS, ScheduleTDS1, ScheduleTCS, CreationInfo, FormITR2, PartAGEN1, Verification, TaxRescertifiedFlag } from '../../types/itr';
import cloneDeep from 'lodash/cloneDeep';
import { calculatePartBTTI, TaxRegimePreference } from './partBTTI';
import { calculatePartBTI } from './partBTI';
import { calculateScheduleCYLA } from './scheduleCYLA';
import { calculateScheduleBFLA } from './calculateScheduleBFLA';
import { calculateScheduleSI } from './scheduleSI';
import { calculateScheduleAMTC, isAMTApplicable } from './scheduleAMTC';
import { postProcessScheduleCG } from './scheduleCGPostProcessing';
import { getLogger, ILogger } from '../../utils/logger';
import { validateITR, ValidationError } from '../../services/validations';
import { roundNumbersInObject } from '../../utils/formatters';
import { generateComputationSheet } from './computationSheet';
import {
    getForm16Sections,
    getForm26ASSections,
    getAISSections,
    getUserInputSections,
    getUSEquityCapitalGainSections,
    getCAMSMFCapitalGainSections,
    getCharlesSchwabSections,
    getUSInvestmentIncomeSections
} from './documentHelpers';

// Create a named logger instance for this module
const logger: ILogger = getLogger('itr');

export interface ITRData {
    // Define your ITR structure here
    assessmentYear: string;
    userId: number;
    // Add other ITR fields
}

// === PRIORITY-BASED MERGE FUNCTIONS ===
function mergeCreationInfo(sources: {
  form16?: CreationInfo;
  form26AS?: CreationInfo;
}): CreationInfo | undefined {
  return sources.form16 || sources.form26AS;
}

function mergeFormITR2(sources: {
  form16?: FormITR2;
  form26AS?: FormITR2;
}): FormITR2 | undefined {
  return sources.form16 || sources.form26AS;
}

function mergePartAGEN1(sources: {
  form16?: PartAGEN1;
  form26AS?: PartAGEN1;
}): PartAGEN1 | undefined {
  return sources.form16 || sources.form26AS;
}

function mergeVerification(sources: {
  form16?: Verification;
  form26AS?: Verification;
}): Verification | undefined {
  return sources.form16 || sources.form26AS;
}

function mergeScheduleS(sources: {
  form16?: ScheduleS;
  form26AS?: ScheduleS;
  ais?: ScheduleS;
}): ScheduleS | undefined {
  return sources.form16 || sources.form26AS || sources.ais;
}

function mergeScheduleTDS1(sources: {
  form16?: ScheduleTDS1;
  form26AS?: ScheduleTDS1;
  ais?: ScheduleTDS1;
}): ScheduleTDS1 | undefined {
  return sources.form16 || sources.form26AS || sources.ais;
}

// === ACCUMULATION-BASED MERGE FUNCTIONS ===



function mergeScheduleTDS2(sources: {
  form26AS?: ScheduleTDS2;
  ais?: ScheduleTDS2;
  userInput?: ScheduleTDS2;
}): ScheduleTDS2 | undefined {
  // Priority: form26AS (official) < ais (validation/backup)
  const governmentSource = sources.ais || sources.form26AS;
  
  if (!governmentSource && !sources.userInput) return undefined;
  if (!sources.userInput) return governmentSource;
  if (!governmentSource) return sources.userInput;
  
  // Accumulate userInput with government source
  const merged = cloneDeep(governmentSource);
  
  if (sources.userInput.TDSOthThanSalaryDtls) {
    merged.TDSOthThanSalaryDtls = [
      ...(merged.TDSOthThanSalaryDtls || []),
      ...sources.userInput.TDSOthThanSalaryDtls
    ];
  }
  
  merged.TotalTDSonOthThanSals = (merged.TotalTDSonOthThanSals || 0) + (sources.userInput.TotalTDSonOthThanSals || 0);
  
  return merged;
}

function mergeScheduleTCS(sources: {
  form26AS?: ScheduleTCS;
  ais?: ScheduleTCS;
  userInput?: ScheduleTCS;
}): ScheduleTCS | undefined {
  const availableSources = Object.values(sources).filter(Boolean) as ScheduleTCS[];
  
  if (availableSources.length === 0) return undefined;
  if (availableSources.length === 1) return availableSources[0];
  
  // Accumulate TCS entries from all sources
  const mergedTCS = cloneDeep(availableSources[0]);
  
  for (let i = 1; i < availableSources.length; i++) {
    const source = availableSources[i];
    if (source.TCS) {
      mergedTCS.TCS = [
        ...(mergedTCS.TCS || []),
        ...source.TCS
      ];
    }
    mergedTCS.TotalSchTCS = (mergedTCS.TotalSchTCS || 0) + (source.TotalSchTCS || 0);
  }
  
  return mergedTCS;
}

function mergeScheduleIT(sources: {
  form26AS?: ScheduleIT;
  userInput?: ScheduleIT;
}): ScheduleIT | undefined {
  const availableSources = Object.values(sources).filter(Boolean) as ScheduleIT[];
  
  if (availableSources.length === 0) return undefined;
  if (availableSources.length === 1) return availableSources[0];
  
  // Accumulate tax payments from all sources
  const mergedIT = cloneDeep(availableSources[0]);
  
  for (let i = 1; i < availableSources.length; i++) {
    const source = availableSources[i];
    if (source.TaxPayment) {
      mergedIT.TaxPayment = [
        ...(mergedIT.TaxPayment || []),
        ...source.TaxPayment
      ];
    }
    mergedIT.TotalTaxPayments = (mergedIT.TotalTaxPayments || 0) + (source.TotalTaxPayments || 0);
  }
  
  return mergedIT;
}

function mergeScheduleOS(sources: {
  form26AS?: ScheduleOS;
  ais?: ScheduleOS;
  userInput?: ScheduleOS;
}): ScheduleOS | undefined {
  // Priority: form26AS (official) < ais (validation/backup)
  const governmentSource = sources.ais || sources.form26AS;
  
  if (!governmentSource && !sources.userInput) return undefined;
  if (!sources.userInput) return governmentSource;
  if (!governmentSource) return sources.userInput;
  
  // Accumulate userInput with government source
  const merged = cloneDeep(governmentSource);
  
  // Accumulate main income fields
  merged.IncChargeable = (merged.IncChargeable || 0) + (sources.userInput.IncChargeable || 0);
  merged.TotOthSrcNoRaceHorse = (merged.TotOthSrcNoRaceHorse || 0) + (sources.userInput.TotOthSrcNoRaceHorse || 0);
  
  // Accumulate interest income details if both have detailed breakdowns
  if (merged.IncOthThanOwnRaceHorse && sources.userInput.IncOthThanOwnRaceHorse) {
    merged.IncOthThanOwnRaceHorse.InterestGross = 
      (merged.IncOthThanOwnRaceHorse.InterestGross || 0) + (sources.userInput.IncOthThanOwnRaceHorse.InterestGross || 0);
    merged.IncOthThanOwnRaceHorse.IntrstFrmSavingBank = 
      (merged.IncOthThanOwnRaceHorse.IntrstFrmSavingBank || 0) + (sources.userInput.IncOthThanOwnRaceHorse.IntrstFrmSavingBank || 0);
    merged.IncOthThanOwnRaceHorse.IntrstFrmTermDeposit = 
      (merged.IncOthThanOwnRaceHorse.IntrstFrmTermDeposit || 0) + (sources.userInput.IncOthThanOwnRaceHorse.IntrstFrmTermDeposit || 0);
    merged.IncOthThanOwnRaceHorse.IntrstFrmOthers = 
      (merged.IncOthThanOwnRaceHorse.IntrstFrmOthers || 0) + (sources.userInput.IncOthThanOwnRaceHorse.IntrstFrmOthers || 0);
    merged.IncOthThanOwnRaceHorse.GrossIncChrgblTaxAtAppRate = 
      (merged.IncOthThanOwnRaceHorse.GrossIncChrgblTaxAtAppRate || 0) + (sources.userInput.IncOthThanOwnRaceHorse.GrossIncChrgblTaxAtAppRate || 0);
    merged.IncOthThanOwnRaceHorse.BalanceNoRaceHorse = 
      (merged.IncOthThanOwnRaceHorse.BalanceNoRaceHorse || 0) + (sources.userInput.IncOthThanOwnRaceHorse.BalanceNoRaceHorse || 0);
  } else if (sources.userInput.IncOthThanOwnRaceHorse) {
    merged.IncOthThanOwnRaceHorse = sources.userInput.IncOthThanOwnRaceHorse;
  }

  // Accumulate dividend income details
  if (sources.userInput.DividendDTAA?.DateRange) {
    merged.DividendDTAA = {
      DateRange: {
        Up16Of12To15Of3: (merged.DividendDTAA?.DateRange?.Up16Of12To15Of3 || 0) +
          (sources.userInput.DividendDTAA.DateRange.Up16Of12To15Of3 || 0),
        Up16Of3To31Of3: (merged.DividendDTAA?.DateRange?.Up16Of3To31Of3 || 0) +
          (sources.userInput.DividendDTAA.DateRange.Up16Of3To31Of3 || 0),
        Up16Of9To15Of12: (merged.DividendDTAA?.DateRange?.Up16Of9To15Of12 || 0) +
          (sources.userInput.DividendDTAA.DateRange.Up16Of9To15Of12 || 0),
        Upto15Of6: (merged.DividendDTAA?.DateRange?.Upto15Of6 || 0) +
          (sources.userInput.DividendDTAA.DateRange.Upto15Of6 || 0),
        Upto15Of9: (merged.DividendDTAA?.DateRange?.Upto15Of9 || 0) +
          (sources.userInput.DividendDTAA.DateRange.Upto15Of9 || 0)
      }
    };
  }
  
  return merged;
}

// === COMPLEX SECTION MERGE FUNCTIONS ===
function mergeScheduleCGFromSources(sources: {
  usEquity?: ScheduleCGFor23;
  camsMF?: ScheduleCGFor23;
  userInput?: ScheduleCGFor23;
}): ScheduleCGFor23 | undefined {
  const availableSources = Object.values(sources).filter(Boolean) as ScheduleCGFor23[];
  
  if (availableSources.length === 0) return undefined;
  if (availableSources.length === 1) return availableSources[0];
  
  // Use the existing complex merge logic
  let mergedCG = cloneDeep(availableSources[0]);
  
  for (let i = 1; i < availableSources.length; i++) {
    mergedCG = mergeScheduleCGHelper(mergedCG, availableSources[i]);
  }
  
  return mergedCG;
}

function mergeScheduleFA(sources: {
  charlesSchwab?: ScheduleFA;
  userInput?: ScheduleFA;
}): ScheduleFA | undefined {
  // Schedule FA typically overwrites (foreign assets are complete snapshots)
  return sources.charlesSchwab || sources.userInput;
}

function mergeScheduleTR1FromSources(sources: {
  usInvestment?: Partial<ScheduleTR1>;
  userInput?: ScheduleTR1;
}): ScheduleTR1 | undefined {
  const availableSources: ScheduleTR1[] = [];
  
  // Convert Partial types to full types safely
  if (sources.usInvestment) {
    const fullScheduleTR1: ScheduleTR1 = {
      ScheduleTR: sources.usInvestment.ScheduleTR || [],
      TotalTaxPaidOutsideIndia: sources.usInvestment.TotalTaxPaidOutsideIndia || 0,
      TotalTaxReliefOutsideIndia: sources.usInvestment.TotalTaxReliefOutsideIndia || 0,
      TaxReliefOutsideIndiaDTAA: sources.usInvestment.TaxReliefOutsideIndiaDTAA || 0,
      TaxReliefOutsideIndiaNotDTAA: sources.usInvestment.TaxReliefOutsideIndiaNotDTAA || 0
    };
    availableSources.push(fullScheduleTR1);
  }
  
  if (sources.userInput) {
    availableSources.push(sources.userInput);
  }
  
  if (availableSources.length === 0) return undefined;
  if (availableSources.length === 1) return availableSources[0];
  
  // Accumulate tax relief from all sources
  const mergedTR1 = cloneDeep(availableSources[0]);
  
  for (let i = 1; i < availableSources.length; i++) {
    const source = availableSources[i];
    
    // Merge ScheduleTR entries
    const existingScheduleTR = mergedTR1.ScheduleTR || [];
    const newScheduleTR = source.ScheduleTR || [];
    
    const mergedScheduleTR = [...existingScheduleTR];
    
    newScheduleTR.forEach(newEntry => {
      const existingEntryIndex = mergedScheduleTR.findIndex(
        entry => entry.CountryCodeExcludingIndia === newEntry.CountryCodeExcludingIndia
      );
      
      if (existingEntryIndex >= 0) {
        // Update existing country entry
        mergedScheduleTR[existingEntryIndex] = {
          ...mergedScheduleTR[existingEntryIndex],
          TaxPaidOutsideIndia: (mergedScheduleTR[existingEntryIndex].TaxPaidOutsideIndia || 0) +
            (newEntry.TaxPaidOutsideIndia || 0),
          TaxReliefOutsideIndia: (mergedScheduleTR[existingEntryIndex].TaxReliefOutsideIndia || 0) +
            (newEntry.TaxReliefOutsideIndia || 0)
        };
      } else {
        // Add new country entry
        mergedScheduleTR.push(newEntry);
      }
    });
    
    mergedTR1.ScheduleTR = mergedScheduleTR;
    
    // Update totals
    mergedTR1.TotalTaxPaidOutsideIndia = (mergedTR1.TotalTaxPaidOutsideIndia || 0) + (source.TotalTaxPaidOutsideIndia || 0);
    mergedTR1.TotalTaxReliefOutsideIndia = (mergedTR1.TotalTaxReliefOutsideIndia || 0) + (source.TotalTaxReliefOutsideIndia || 0);
    mergedTR1.TaxReliefOutsideIndiaDTAA = (mergedTR1.TaxReliefOutsideIndiaDTAA || 0) + (source.TaxReliefOutsideIndiaDTAA || 0);
  }
  
  return mergedTR1;
}

function mergeScheduleFSIFromSources(sources: {
  usInvestment?: Partial<ScheduleFSI>;
  userInput?: ScheduleFSI;
}): ScheduleFSI | undefined {
  const availableSources: ScheduleFSI[] = [];
  
  // Convert Partial types to full types safely
  if (sources.usInvestment) {
    const fullScheduleFSI: ScheduleFSI = {
      ScheduleFSIDtls: sources.usInvestment.ScheduleFSIDtls || []
    };
    availableSources.push(fullScheduleFSI);
  }
  
  if (sources.userInput) {
    availableSources.push(sources.userInput);
  }
  
  if (availableSources.length === 0) return undefined;
  if (availableSources.length === 1) return availableSources[0];
  
  // Accumulate foreign source income from all sources
  const mergedFSI = cloneDeep(availableSources[0]);
  
  for (let i = 1; i < availableSources.length; i++) {
    const source = availableSources[i];
    
    // Merge ScheduleFSIDtls entries
    const existingScheduleFSIDtls = mergedFSI.ScheduleFSIDtls || [];
    const newScheduleFSIDtls = source.ScheduleFSIDtls || [];
    
    const mergedScheduleFSIDtls = [...existingScheduleFSIDtls];
    
    newScheduleFSIDtls.forEach(newEntry => {
      const existingEntryIndex = mergedScheduleFSIDtls.findIndex(
        entry => entry.CountryCodeExcludingIndia === newEntry.CountryCodeExcludingIndia
      );
      
      if (existingEntryIndex >= 0) {
        // Update existing country entry
        const existingEntry = mergedScheduleFSIDtls[existingEntryIndex];
        
        // Update IncOthSrc (Income from Other Sources)
        const updatedIncOthSrc = {
          ...existingEntry.IncOthSrc,
          IncFrmOutsideInd: (existingEntry.IncOthSrc.IncFrmOutsideInd || 0) + (newEntry.IncOthSrc.IncFrmOutsideInd || 0),
          TaxPaidOutsideInd: (existingEntry.IncOthSrc.TaxPaidOutsideInd || 0) + (newEntry.IncOthSrc.TaxPaidOutsideInd || 0),
          TaxPayableinInd: (existingEntry.IncOthSrc.TaxPayableinInd || 0) + (newEntry.IncOthSrc.TaxPayableinInd || 0),
          TaxReliefinInd: (existingEntry.IncOthSrc.TaxReliefinInd || 0) + (newEntry.IncOthSrc.TaxReliefinInd || 0)
        };
        
        // Update TotalCountryWise
        const updatedTotalCountryWise = {
          ...existingEntry.TotalCountryWise,
          IncFrmOutsideInd: (existingEntry.TotalCountryWise.IncFrmOutsideInd || 0) + (newEntry.TotalCountryWise.IncFrmOutsideInd || 0),
          TaxPaidOutsideInd: (existingEntry.TotalCountryWise.TaxPaidOutsideInd || 0) + (newEntry.TotalCountryWise.TaxPaidOutsideInd || 0),
          TaxPayableinInd: (existingEntry.TotalCountryWise.TaxPayableinInd || 0) + (newEntry.TotalCountryWise.TaxPayableinInd || 0),
          TaxReliefinInd: (existingEntry.TotalCountryWise.TaxReliefinInd || 0) + (newEntry.TotalCountryWise.TaxReliefinInd || 0)
        };
        
        mergedScheduleFSIDtls[existingEntryIndex] = {
          ...existingEntry,
          IncOthSrc: updatedIncOthSrc,
          TotalCountryWise: updatedTotalCountryWise
        };
      } else {
        // Add new country entry
        mergedScheduleFSIDtls.push(newEntry);
      }
    });
    
    mergedFSI.ScheduleFSIDtls = mergedScheduleFSIDtls;
  }
  
  return mergedFSI;
}

/**
 * Enum for ITR section types
 */
export enum ITRSectionType {
    SCHEDULE_CG = 'ScheduleCGFor23',
    SCHEDULE_FA = 'ScheduleFA',
    SCHEDULE_OS = 'ScheduleOS',
    SCHEDULE_TR1 = 'ScheduleTR1',
    SCHEDULE_FSI = 'ScheduleFSI',
    SCHEDULE_112A = 'Schedule112A',
    SCHEDULE_TDS2 = 'ScheduleTDS2',
    SCHEDULE_CFL = 'ScheduleCFL',
    SCHEDULE_IT = 'ScheduleIT'
}

/**
 * Represents a section from a parsed document that needs to be merged into an ITR
 */
export interface ITRSection {
    // Type of the section, used to determine which merger to apply
    type: ITRSectionType;
    // The actual section data
    data: any;
}

/**
 * Merges Schedule CG sections
 * 
 * @param existingScheduleCG - Existing Schedule CG section from ITR
 * @param newScheduleCG - New Schedule CG section from US equity data
 * @returns Merged Schedule CG section
 */
const mergeScheduleCGHelper = (existingScheduleCG: ScheduleCGFor23, newScheduleCG: ScheduleCGFor23): ScheduleCGFor23 => {
    // Create a deep copy to avoid mutations
    const mergedScheduleCG = cloneDeep(existingScheduleCG);

    // Merge ShortTermCapGainFor23
    if (mergedScheduleCG.ShortTermCapGainFor23 && newScheduleCG.ShortTermCapGainFor23) {
        // Merge EquityMFonSTT arrays if both exist
        if (mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT && newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT) {
            mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT = [
                ...mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT,
                ...newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT
            ];
        } else if (newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT) {
            mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT = newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT;
        }

        // Merge SaleOnOtherAssets by adding values
        if (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets && newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets) {
            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FairMrktValueUnqshr =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FairMrktValueUnqshr || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FairMrktValueUnqshr || 0);

            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FullConsideration =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FullConsideration || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FullConsideration || 0);

            // DeductSec48 handling
            if (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48 &&
                newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48) {
                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.AquisitCost =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.AquisitCost || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.AquisitCost || 0);

                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ExpOnTrans =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ExpOnTrans || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ExpOnTrans || 0);

                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ImproveCost =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ImproveCost || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ImproveCost || 0);

                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.TotalDedn =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.TotalDedn || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.TotalDedn || 0);
            }

            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.BalanceCG =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.BalanceCG || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.BalanceCG || 0);

            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.CapgainonAssets =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.CapgainonAssets || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.CapgainonAssets || 0);
        } else if (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets) {
            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets = newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets;
        }

        // Update Total STCG
        mergedScheduleCG.ShortTermCapGainFor23.TotalSTCG =
            (mergedScheduleCG.ShortTermCapGainFor23.TotalSTCG || 0) +
            (newScheduleCG.ShortTermCapGainFor23.TotalSTCG || 0);
    } else if (newScheduleCG.ShortTermCapGainFor23) {
        mergedScheduleCG.ShortTermCapGainFor23 = newScheduleCG.ShortTermCapGainFor23;
    }

    // Merge LongTermCapGain23
    if (mergedScheduleCG.LongTermCapGain23 && newScheduleCG.LongTermCapGain23) {
        // Merge SaleOfEquityShareUs112A
        if (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A && newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A) {
            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.BalanceCG =
                (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.BalanceCG || 0) +
                (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.BalanceCG || 0);

            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets =
                (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets || 0) +
                (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets || 0);

            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.DeductionUs54F =
                (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.DeductionUs54F || 0) +
                (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.DeductionUs54F || 0);
        } else if (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A) {
            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A = newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A;
        }

        // Merge SaleofAssetNA (debt funds)
        if (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA && newScheduleCG.LongTermCapGain23.SaleofAssetNA) {
            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FairMrktValueUnqshr =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FairMrktValueUnqshr || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.FairMrktValueUnqshr || 0);

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FullConsideration =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FullConsideration || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.FullConsideration || 0);

            // DeductSec48 handling
            if (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48 &&
                newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48) {
                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.AquisitCost =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.AquisitCost || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.AquisitCost || 0);

                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ExpOnTrans =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ExpOnTrans || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ExpOnTrans || 0);

                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ImproveCost =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ImproveCost || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ImproveCost || 0);

                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.TotalDedn =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.TotalDedn || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.TotalDedn || 0);
            }

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.BalanceCG =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.BalanceCG || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.BalanceCG || 0);

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.CapgainonAssets =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.CapgainonAssets || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.CapgainonAssets || 0);

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductionUs54F =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductionUs54F || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductionUs54F || 0);
        } else if (newScheduleCG.LongTermCapGain23.SaleofAssetNA) {
            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA = newScheduleCG.LongTermCapGain23.SaleofAssetNA;
        }

        // Update Total LTCG
        mergedScheduleCG.LongTermCapGain23.TotalLTCG =
            (mergedScheduleCG.LongTermCapGain23.TotalLTCG || 0) +
            (newScheduleCG.LongTermCapGain23.TotalLTCG || 0);
        
        //Merge Proviso112Applicable
        if (mergedScheduleCG.LongTermCapGain23.Proviso112Applicable && newScheduleCG.LongTermCapGain23.Proviso112Applicable) {
            mergedScheduleCG.LongTermCapGain23.Proviso112Applicable = [
                ...mergedScheduleCG.LongTermCapGain23.Proviso112Applicable,
                ...newScheduleCG.LongTermCapGain23.Proviso112Applicable
            ];
        } else if (newScheduleCG.LongTermCapGain23.Proviso112Applicable) {
            mergedScheduleCG.LongTermCapGain23.Proviso112Applicable = newScheduleCG.LongTermCapGain23.Proviso112Applicable;
        }
    } else if (newScheduleCG.LongTermCapGain23) {
        mergedScheduleCG.LongTermCapGain23 = newScheduleCG.LongTermCapGain23;
    }

    // Merge CurrYrLosses - this part merges detailed breakups of capital gains by tax rates
    if (mergedScheduleCG.CurrYrLosses && newScheduleCG.CurrYrLosses) {
        // Merge equity STCG at 15%
        if (mergedScheduleCG.CurrYrLosses.InStcg15Per && newScheduleCG.CurrYrLosses.InStcg15Per) {
            mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InStcg15Per.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain || 0);
        }

        // Merge debt STCG at applicable rate
        if (mergedScheduleCG.CurrYrLosses.InStcgAppRate && newScheduleCG.CurrYrLosses.InStcgAppRate) {
            mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InStcgAppRate.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain || 0);
        }

        // Merge equity LTCG at 10% under section 112A
        if (mergedScheduleCG.CurrYrLosses.InLtcg10Per && newScheduleCG.CurrYrLosses.InLtcg10Per) {
            mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg10Per.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain || 0);
        }

        // Merge debt LTCG at 20% under section 112
        if (mergedScheduleCG.CurrYrLosses.InLtcg20Per && newScheduleCG.CurrYrLosses.InLtcg20Per) {
            mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg20Per.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain || 0);
        }
    } else if (newScheduleCG.CurrYrLosses) {
        mergedScheduleCG.CurrYrLosses = newScheduleCG.CurrYrLosses;
    }

    // Merge AccruOrRecOfCG similarly to CurrYrLosses
    if (mergedScheduleCG.AccruOrRecOfCG && newScheduleCG.AccruOrRecOfCG) {
        // For LongTermUnder20Per (and similarly for other categories like ShortTermUnderAppRate etc.)
        if (mergedScheduleCG.AccruOrRecOfCG.LongTermUnder20Per && newScheduleCG.AccruOrRecOfCG.LongTermUnder20Per) {
            const existingDR = mergedScheduleCG.AccruOrRecOfCG.LongTermUnder20Per.DateRange;
            const newDR = newScheduleCG.AccruOrRecOfCG.LongTermUnder20Per.DateRange;
            
            existingDR.Up16Of12To15Of3 = (existingDR.Up16Of12To15Of3 || 0) + (newDR.Up16Of12To15Of3 || 0);
            existingDR.Up16Of3To31Of3 = (existingDR.Up16Of3To31Of3 || 0) + (newDR.Up16Of3To31Of3 || 0);
            existingDR.Up16Of9To15Of12 = (existingDR.Up16Of9To15Of12 || 0) + (newDR.Up16Of9To15Of12 || 0);
            existingDR.Upto15Of6 = (existingDR.Upto15Of6 || 0) + (newDR.Upto15Of6 || 0);
            existingDR.Upto15Of9 = (existingDR.Upto15Of9 || 0) + (newDR.Upto15Of9 || 0);
        } else if (newScheduleCG.AccruOrRecOfCG.LongTermUnder20Per) {
            // If existing doesn't have it, but new one does, assign it (deep clone for safety)
            mergedScheduleCG.AccruOrRecOfCG.LongTermUnder20Per = cloneDeep(newScheduleCG.AccruOrRecOfCG.LongTermUnder20Per);
        }
        // This pattern needs to be repeated for all relevant fields within AccruOrRecOfCG:
        // LongTermUnder10Per, LongTermUnderDTAARate, ShortTermUnder15Per, ShortTermUnder30Per,
        // ShortTermUnderAppRate, ShortTermUnderDTAARate, VDATrnsfGainsUnder30Per.
    } else if (newScheduleCG.AccruOrRecOfCG) {
        mergedScheduleCG.AccruOrRecOfCG = newScheduleCG.AccruOrRecOfCG;
    }

    // Update totals
    mergedScheduleCG.SumOfCGIncm =
        ((mergedScheduleCG.ShortTermCapGainFor23?.TotalSTCG || 0) +
            (mergedScheduleCG.LongTermCapGain23?.TotalLTCG || 0));

    mergedScheduleCG.TotScheduleCGFor23 = mergedScheduleCG.SumOfCGIncm;

    return mergedScheduleCG;
};

/**
 * Merges Foreign Tax Credit in PartB-TTI
 * 
 * @param existingPartBTTI - Existing PartB-TTI section from ITR
 * @param foreignTaxCredit - Foreign Tax Credit from US equity data
 * @returns Updated PartB-TTI section
 */
const mergeForeignTaxCredit = (existingPartBTTI: PartBTTI, foreignTaxCredit: number): PartBTTI => {
    // Create a new copy to avoid mutations
    const updatedPartBTTI = { ...existingPartBTTI };

    // Ensure ComputationOfTaxLiability property exists
    if (!updatedPartBTTI.ComputationOfTaxLiability) {
        updatedPartBTTI.ComputationOfTaxLiability = {
            AggregateTaxInterestLiability: 0,
            CreditUS115JD: 0,
            EducationCess: 0,
            GrossTaxLiability: 0,
            GrossTaxPayable: 0,
            IntrstPay: {
                IntrstPayUs234A: 0,
                IntrstPayUs234B: 0,
                IntrstPayUs234C: 0,
                LateFilingFee234F: 0,
                TotalIntrstPay: 0
            },
            NetTaxLiability: 0,
            Rebate87A: 0,
            Surcharge25ofSI: 0,
            Surcharge25ofSIBeforeMarginal: 0,
            SurchargeOnAboveCrore: 0,
            SurchargeOnAboveCroreBeforeMarginal: 0,
            TaxPayAfterCreditUs115JD: 0,
            TaxPayableOnRebate: 0,
            TaxPayableOnTI: {
                RebateOnAgriInc: 0,
                TaxAtNormalRatesOnAggrInc: 0,
                TaxAtSpecialRates: 0,
                TaxPayableOnTotInc: 0
            },
            TaxRelief: {
                TotTaxRelief: 0
            },
            TotalSurcharge: 0
        };
    } else {
        // Create a new ComputationOfTaxLiability object
        updatedPartBTTI.ComputationOfTaxLiability = {
            ...updatedPartBTTI.ComputationOfTaxLiability
        };
    }

    // Ensure TaxRelief property exists
    if (!updatedPartBTTI.ComputationOfTaxLiability.TaxRelief) {
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief = {
            TotTaxRelief: 0
        };
    } else {
        // Create a new TaxRelief object
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief = {
            ...updatedPartBTTI.ComputationOfTaxLiability.TaxRelief
        };
    }

    // Update Section90 (relief for taxes paid outside India)
    if (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 !== undefined) {
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 += foreignTaxCredit;
    } else {
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 = foreignTaxCredit;
    }

    // Update total tax relief
    updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.TotTaxRelief =
        (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section89 || 0) +
        (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 || 0) +
        (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section91 || 0);

    return updatedPartBTTI;
};

export const generateITR = async (
    userId: number,
    assessmentYear: string,
): Promise<Itr> => {
    logger.info(`Starting ITR generation for user ${userId}, AY ${assessmentYear}`);

    // --- 1. Initialize Base ITR Structure ---
    const baseITR: Itr2 = initializeBaseITR2(assessmentYear) as Itr2;

    // --- 2. Fetch All Document Data ---
    logger.info('Fetching document data from all sources...');
    
    const form16Sections = await getForm16Sections(userId, assessmentYear);
    const form26ASSections = await getForm26ASSections(userId, assessmentYear);
    // logger.info('Form 26AS sections fetched', form26ASSections);
    const aisSections = await getAISSections(userId, assessmentYear);
    const userInputResult = await getUserInputSections(userId, assessmentYear);
    const userInputSections = userInputResult.sections;
    const userInputData = userInputResult.rawData;

    const usEquityCapitalGainSections = await getUSEquityCapitalGainSections(userId, assessmentYear);
    const camsMFCapitalGainSections = await getCAMSMFCapitalGainSections(userId, assessmentYear);
    const charlesSchwabSections = await getCharlesSchwabSections(userId, assessmentYear);
    const usInvestmentIncomeSections = await getUSInvestmentIncomeSections(userId, assessmentYear);

    // Set base ITR fields using merge functions (Form 16 > Form 26AS priority)
    const mergedCreationInfo = mergeCreationInfo({
        form16: form16Sections?.creationInfo,
        form26AS: form26ASSections?.creationInfo
    });
    
    const mergedFormITR2 = mergeFormITR2({
        form16: form16Sections?.formITR2,
        form26AS: form26ASSections?.formITR2
    });
    
    const mergedPartAGEN1 = mergePartAGEN1({
        form16: form16Sections?.partAGEN1,
        form26AS: form26ASSections?.partAGEN1
    });
    
    const mergedVerification = mergeVerification({
        form16: form16Sections?.verification,
        form26AS: form26ASSections?.verification
    });

    if (mergedCreationInfo) baseITR.CreationInfo = mergedCreationInfo;
    if (mergedFormITR2) baseITR.Form_ITR2 = mergedFormITR2;
    if (mergedPartAGEN1) baseITR.PartA_GEN1 = mergedPartAGEN1;
    if (mergedVerification) baseITR.Verification = mergedVerification;

    // --- 3. Merge Core Tax Sections Using Clean Priority/Accumulation Logic ---
    logger.info('Merging core tax sections...');
    
    // Priority-based merging (Form 16 > Form 26AS > AIS)
    const mergedScheduleS = mergeScheduleS({
        form16: form16Sections?.scheduleS,
        form26AS: form26ASSections?.scheduleS,
        ais: undefined // Schedule S not available in AIS yet
    });
    
    const mergedScheduleTDS1 = mergeScheduleTDS1({
        form16: form16Sections?.scheduleTDS1,
        form26AS: form26ASSections?.scheduleTDS1,
        ais: undefined // Schedule TDS1 not available in AIS yet
    });

    // Accumulation-based merging (combine all sources)
    const mergedScheduleTDS2 = mergeScheduleTDS2({
        form26AS: form26ASSections?.scheduleTDS2,
        ais: aisSections?.scheduleTDS2,
        userInput: undefined // TDS2 not supported in user input yet
    });
    
    const mergedScheduleTCS = mergeScheduleTCS({
        form26AS: form26ASSections?.scheduleTCS,
        ais: undefined, // TCS not available in AIS yet
        userInput: undefined // TCS not supported in user input yet
    });
    
    const mergedScheduleIT = mergeScheduleIT({
        form26AS: form26ASSections?.scheduleIT,
        userInput: userInputSections?.scheduleIT
    });
    
    const mergedScheduleOS = mergeScheduleOS({
        form26AS: form26ASSections?.scheduleOS,
        ais: aisSections?.scheduleOS,
        userInput: undefined // OS not supported in user input yet
    });

    // Merge complex sections using clean priority/accumulation logic
    const mergedScheduleCGFromOtherSources = mergeScheduleCGFromSources({
        usEquity: usEquityCapitalGainSections.scheduleCG,
        camsMF: camsMFCapitalGainSections.scheduleCG,
        userInput: undefined // CG not supported in user input yet
    });
    
    const mergedScheduleFAFromSources = mergeScheduleFA({
        charlesSchwab: charlesSchwabSections.scheduleFA,
        userInput: undefined // FA not supported in user input yet
    });
    
    const mergedScheduleTR1FromOtherSources = mergeScheduleTR1FromSources({
        usInvestment: usInvestmentIncomeSections.scheduleTR1,
        userInput: undefined // TR1 not supported in user input yet
    });
    
    const mergedScheduleFSIFromOtherSources = mergeScheduleFSIFromSources({
        usInvestment: usInvestmentIncomeSections.scheduleFSI,
        userInput: undefined // FSI not supported in user input yet
    });

    // TODO1: Note: For now, we skip additional ScheduleOS merge due to complex type requirements
    // The main ScheduleOS merge already handles most cases
    // TODO2: mergeForeignTaxCredit

    // 4. Assign merged sections to base ITR
    if (mergedScheduleS) baseITR.ScheduleS = mergedScheduleS;
    if (mergedScheduleTDS1) baseITR.ScheduleTDS1 = mergedScheduleTDS1;
    if (mergedScheduleTDS2) baseITR.ScheduleTDS2 = mergedScheduleTDS2;
    if (mergedScheduleTCS) baseITR.ScheduleTCS = mergedScheduleTCS;
    if (mergedScheduleIT) baseITR.ScheduleIT = mergedScheduleIT;
    if (mergedScheduleOS) baseITR.ScheduleOS = mergedScheduleOS;

    // Add Schedule CFL from user input if available
    if (userInputSections?.scheduleCFL) {
        baseITR.ScheduleCFL = userInputSections.scheduleCFL;
        logger.info('Added Schedule CFL from user input');
    }

    // Assign merged complex sections to base ITR
    if (mergedScheduleCGFromOtherSources) baseITR.ScheduleCGFor23 = mergedScheduleCGFromOtherSources;
    if (mergedScheduleFAFromSources) baseITR.ScheduleFA = mergedScheduleFAFromSources;
    if (mergedScheduleTR1FromOtherSources) baseITR.ScheduleTR1 = mergedScheduleTR1FromOtherSources;
    if (mergedScheduleFSIFromOtherSources) baseITR.ScheduleFSI = mergedScheduleFSIFromOtherSources;
    
    // Add Schedule 112A from CAMS if available
    if (camsMFCapitalGainSections.schedule112A) {
        baseITR.Schedule112A = camsMFCapitalGainSections.schedule112A;
        logger.info('Added Schedule 112A from CAMS MF data');
    }

    // --- 5. Post-Process Schedule CG for Intra-Head Set-offs ---
    if (baseITR.ScheduleCGFor23) {
        // The postProcessScheduleCG function will handle intra-head set-offs
        // and populate derived fields like InLossSetOff, LossRemainSetOff, etc.
        baseITR.ScheduleCGFor23 = postProcessScheduleCG(baseITR.ScheduleCGFor23);
        logger.info('Post-processed Schedule CG for intra-head set-offs.');
    } else {
        logger.info('No Schedule CG found to post-process.');
    }

    // ---- Derived fields ----
    // --- 4. Calculate Schedule CYLA: Statement of income after set off of current year's losses ---
    const scheduleCYLA = calculateScheduleCYLA(baseITR);
    baseITR.ScheduleCYLA = scheduleCYLA;
    logger.info('Calculated Schedule CYLA.');

    // --- 4.5 Calculate Schedule BFLA ---
    // Ensure ScheduleCFL and ScheduleCYLA exist before calling
    if (baseITR.ScheduleCFL && baseITR.ScheduleCYLA) {
        const scheduleBFLA = calculateScheduleBFLA(baseITR);
        baseITR.ScheduleBFLA = scheduleBFLA;
        logger.info('Calculated Schedule BFLA.');
    } else {
        logger.warn('Skipping Schedule BFLA calculation as ScheduleCFL or ScheduleCYLA is missing.');
    }

    // --- 5. Calculate Schedule SI (for special income tax rates) BEFORE Part B-TI ---
    const scheduleSI = calculateScheduleSI(baseITR);
    baseITR.ScheduleSI = scheduleSI;
    logger.info('Calculated Schedule SI for special income tax rates.');

    // --- 6. Calculate PartB-TI (Using post-exemption amounts from Schedule SI) ---
    const partBTI = calculatePartBTI(baseITR);
    baseITR["PartB-TI"] = partBTI;
    logger.info('Calculated PartB-TI using post-exemption amounts.');

    // --- 7. Calculate PartB-TTI (Integrated with Schedule SI) ---
    const {partBTTI, chosenRegimeName} = calculatePartBTTI(baseITR, TaxRegimePreference.AUTO, userInputData?.generalInfoAdditions?.bankDetails);
    baseITR.PartA_GEN1.FilingStatus.OptOutNewTaxRegime = chosenRegimeName === 'OLD' ? TaxRescertifiedFlag.Y : TaxRescertifiedFlag.N;

    baseITR["PartB_TTI"] = partBTTI;
    logger.info('Calculated PartB-TTI with integrated special rates.');

    // --- 8. Calculate Schedule AMTC ---
    if (isAMTApplicable(baseITR)) {
        const scheduleAMTC = calculateScheduleAMTC(baseITR);
        baseITR.ScheduleAMTC = scheduleAMTC;
        logger.info('Calculated Schedule AMTC for Alternative Minimum Tax Credit.');
    } else {
        logger.info('AMT not applicable, skipping Schedule AMTC calculation.');
    }

    // --- 9. Final ITR Object ---
    let finalITR: Itr = {
        ITR: {
            ITR2: baseITR as Itr2
        }
    };

    // --- 10. Round all numbers in the final ITR object ---
    logger.info('Rounding numbers in the final ITR object.');
    finalITR = roundNumbersInObject(finalITR); // Apply rounding

    // --- 11. Generate and log the final computation sheet ---
    if (finalITR.ITR?.ITR2) {
        const computationSheet = generateComputationSheet(finalITR.ITR.ITR2);
        logger.info(`\n\n${computationSheet}\n\n`);
    }

    //validate the ITR
    try {
        validateITR(finalITR);
        logger.info('ITR validation successful.');
    } catch (error: any) {
        // Log the validation error details if it's a ValidationError
        if (error instanceof ValidationError) {
            // logger.error('ITR validation failed:', error.errors);
        } else {
            // logger.error('ITR validation failed with an unexpected error:', error);
        }
    }

    logger.info(`ITR generation complete for user ${userId}, AY ${assessmentYear}`);
    return finalITR;
};

// --- Helper Functions ---

function initializeBaseITR2(assessmentYear: string): Partial<Itr2> {
    logger.debug('Initializing base ITR-2 structure.');
    // Creates a basic ITR-2 structure 
    return {
        Form_ITR2: {
            FormName: "ITR-2",
            Description: "For Individuals and HUFs not having income from profits and gains of business or profession",
            AssessmentYear: assessmentYear.substring(0, 4),
            SchemaVer: "Ver1.0",
            FormVer: "Ver1.0"
        },
        // Initialize other mandatory base sections like CreationInfo, PartA_GEN1 with placeholders
        ScheduleHP: {
            PassThroghIncome: 0,
            TotalIncomeChargeableUnHP: 0
        },
        ScheduleVDA: {
            ScheduleVDADtls: [],
            TotIncCapGain: 0
        },
        ScheduleEI: {
            ExpIncAgri: 0,
            GrossAgriRecpt: 0,
            IncNotChrgblToTax: 0,
            InterestInc: 0,
            NetAgriIncOrOthrIncRule7: 0,
            Others: 0,
            PassThrIncNotChrgblTax: 0,
            TotalExemptInc: 0,
            UnabAgriLossPrev8: 0
        },
        // Initialize other necessary schedules with default empty structures if needed
    };
}

// Create the service wrapper
export const itrGenerator = {
    generateITR: generateITR
};
import { UserInputData } from '../types/userInput.types';
import { ScheduleCFL, ScheduleIT, TaxPayment } from '../types/itr';
import { getLogger, ILogger } from '../utils/logger';
import { ParseResult } from '../utils/parserTypes';

const logger: ILogger = getLogger('userInputToITRProcessor');

// Define the specific structure for sections generated from user input
export interface UserInputITRSections {
    scheduleCFL?: ScheduleCFL;
    scheduleIT?: ScheduleIT;
    // Add other potential sections like scheduleFA, taxesPaid, chapterVIA etc. later
}

/**
 * Converts raw user input record to a structured object containing relevant ITR sections.
 * Processes Schedule CFL and Schedule IT (self-assessment tax).
 *
 * @param userInputRecord - The raw user input record retrieved from the service.
 * @param assessmentYear - The assessment year (currently unused but kept for potential future use).
 * @returns A Result object containing UserInputITRSections on success.
 */
export const convertUserInputToITRSections = (
    inputData: UserInputData,
    assessmentYear: string // Kept for consistency
): ParseResult<UserInputITRSections> => {
    const generatedSections: UserInputITRSections = {};

    // Process Schedule CFL Additions
    if (inputData.scheduleCFLAdditions?.lossesToCarryForward && inputData.scheduleCFLAdditions.lossesToCarryForward.length > 0) {
        // Get the loss entries from user input
        const lossEntries = inputData.scheduleCFLAdditions.lossesToCarryForward;
        
        // Calculate totals for summary sections
        let totalSTCGLoss = 0;
        let totalLTCGLoss = 0;
        let totalHPLoss = 0;
        let totalOtherSourcesLoss = 0;
        
        // Sum up the losses from all entries
        lossEntries.forEach(entry => {
            totalSTCGLoss += entry.shortTermCapitalLossCF || 0;
            totalLTCGLoss += entry.longTermCapitalLossCF || 0;
            totalHPLoss += entry.housePropertyLossCF || 0;
            // Business losses (not implemented for race horses specifically yet)
            totalOtherSourcesLoss += entry.businessLossCF || 0;
        });
        
        // Create the summary detail object to be reused
        const lossSummaryDetail = {
            TotalSTCGPTILossCF: totalSTCGLoss,
            TotalLTCGPTILossCF: totalLTCGLoss,
            TotalHPPTILossCF: totalHPLoss,
            OthSrcLossRaceHorseCF: totalOtherSourcesLoss
        };
        
        // Only proceed if there are actually losses to carry forward
        if (totalSTCGLoss > 0 || totalLTCGLoss > 0 || totalHPLoss > 0 || totalOtherSourcesLoss > 0) {
            // Find the most recent loss entry for the current year loss field
            const currentYearEntry = lossEntries.find(e => e.lossYearAY === assessmentYear);
            
            // Structure ScheduleCFL according to the expected format
            const transformedCFL: ScheduleCFL = {
                // Previous 8th year losses (typically AY from 8 years ago)
                // This needs to be properly structured with CarryFwdLossDetail
                LossCFFromPrev8thYearFromAY: {
                    CarryFwdLossDetail: {
                        DateOfFiling: lossEntries[0]?.dateOfFiling || "",
                        TotalSTCGPTILossCF: lossEntries[0]?.shortTermCapitalLossCF || 0,
                        TotalLTCGPTILossCF: lossEntries[0]?.longTermCapitalLossCF || 0,
                        TotalHPPTILossCF: lossEntries[0]?.housePropertyLossCF || 0
                    }
                },
                
                // Current year losses
                CurrentAYloss: {
                    LossSummaryDetail: {
                        TotalSTCGPTILossCF: currentYearEntry?.shortTermCapitalLossCF || 0,
                        TotalLTCGPTILossCF: currentYearEntry?.longTermCapitalLossCF || 0,
                        TotalHPPTILossCF: currentYearEntry?.housePropertyLossCF || 0,
                        OthSrcLossRaceHorseCF: currentYearEntry?.businessLossCF || 0
                    }
                },
                
                // Adjusted total BF loss in BFLA
                AdjTotBFLossInBFLA: {
                    LossSummaryDetail: lossSummaryDetail
                },
                
                // Total loss CF summary
                TotalLossCFSummary: {
                    LossSummaryDetail: lossSummaryDetail
                },
                
                // Total of BF losses from earlier years
                TotalOfBFLossesEarlierYrs: {
                    LossSummaryDetail: lossSummaryDetail
                }
            };
            
            // If there's a specific entry for the previous year, add it
            if (lossEntries.length > 1) {
                const prevYearEntry = lossEntries.find(e => e.lossYearAY !== assessmentYear);
                if (prevYearEntry) {
                    transformedCFL.LossCFFromPrevYrToAY = {
                        CarryFwdLossDetail: {
                            DateOfFiling: prevYearEntry.dateOfFiling || "",
                            TotalSTCGPTILossCF: prevYearEntry.shortTermCapitalLossCF || 0,
                            TotalLTCGPTILossCF: prevYearEntry.longTermCapitalLossCF || 0,
                            TotalHPPTILossCF: prevYearEntry.housePropertyLossCF || 0
                        }
                    };
                }
            }
            
            generatedSections.scheduleCFL = transformedCFL;
            logger.info('Transformed user input Schedule CFL additions.');
        }
    }

    // Process Self-Assessment Tax Payments
    if (inputData.taxesPaidAdditions?.selfAssessmentTax && inputData.taxesPaidAdditions.selfAssessmentTax.length > 0) {
        const taxPayments = inputData.taxesPaidAdditions.selfAssessmentTax;
        
        // Convert each tax payment to the required format
        const transformedTaxPayments: TaxPayment[] = taxPayments.map(payment => ({
            BSRCode: payment.bsrCode,
            DateDep: payment.dateDeposit, // Assumes date is in YYYY-MM-DD format
            SrlNoOfChaln: parseInt(payment.challanSerialNo, 10) || 0, // Convert to number, default to 0 if NaN
            Amt: payment.amount
        }));
        
        // Calculate total tax payments
        const totalTaxPayments = transformedTaxPayments.reduce((sum, payment) => sum + payment.Amt, 0);
        
        // Create Schedule IT structure
        const scheduleIT: ScheduleIT = {
            TaxPayment: transformedTaxPayments,
            TotalTaxPayments: totalTaxPayments
        };
        
        generatedSections.scheduleIT = scheduleIT;
        logger.info('Transformed user input Self-Assessment Tax payments.');
    }

    // Add processors for other user input sections (scheduleFAAdditions, etc.) here in the future

    return { success: true, data: generatedSections };
}; 
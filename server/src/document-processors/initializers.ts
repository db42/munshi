import { Form16 } from '../types/form16';
import { Capacity, Declaration, ScheduleBFLA, ScheduleCYLA, Verification } from '../types/itr';

/**
 * Initializes Schedule BFLA (Brought Forward Loss Adjustment)
 * This schedule is for setting off brought forward losses against current year income
 */
// export const initializeScheduleBFLA = (): ScheduleBFLA => ({
    // Current year income after CYLA (Current Year Loss Adjustment)
    // IncomeOfCurrYrAftCYLABFLA: 0,
    
    // // Long Term Capital Gains at different rates
    // LTCG10Per: 0,           // LTCG taxable at 10%
    // LTCG20Per: 0,           // LTCG taxable at 20%
    // LTCGDTAARate: 0,        // LTCG taxable at special rates as per DTAA
    
    // // Short Term Capital Gains at different rates
    // STCG15Per: 0,           // STCG taxable at 15%
    // STCG30Per: 0,           // STCG taxable at 30%
    // STCGAppRate: 0,         // STCG taxable at applicable rates
    // STCGDTAARate: 0,        // STCG taxable at special rates as per DTAA
    
    // // Other income sources
    // OthersInc: 0,           // Other income sources
    // TotalBFLA: 0            // Total Brought Forward Loss Adjustment
// });

/**
 * Initializes Schedule CYLA (Current Year Loss Adjustment)
 * This schedule is for setting off loss from one head against income from another head
 */
// export const initializeScheduleCYLA = (): ScheduleCYLA => ({
//     // TODO: Add required CYLA properties based on interface
// });

/**
 * Initializes Verification section
 * Contains details about the person verifying the return
 */
export const initializeVerification = (form16: Form16): Verification => ({
  //generate this implemenation
  Capacity: Capacity.A,              // or another appropriate enum value
  Date: new Date().toISOString().split('T')[0], 
  Declaration: {
    AssesseeVerName: form16.employee.name,
    AssesseeVerPAN:  form16.employee.pan,
    FatherName:      'XXX',
  },        // or another appropriate enum value
  Place: 'Mumbai'  

    // TODO: Add required Verification properties based on interface
});
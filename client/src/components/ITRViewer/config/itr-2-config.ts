import { ITRViewerStepConfig } from '../types';

// Defines the sequence and configuration of steps for the ITR-2 viewer wizard.
export const itr2StepsConfig: ITRViewerStepConfig[] = [
  {
    id: 'personalInfo',
    title: 'Personal Information',
    associatedSchedules: ['PartA'], // Assuming PartA contains general info
  },
  {
    id: 'incomeDetails',
    title: 'Income Details',
    associatedSchedules: ['ScheduleS', 'ScheduleHP', 'ScheduleOS'],
  },
  {
    id: 'capitalGains',
    title: 'Capital Gains',
    associatedSchedules: ['ScheduleCG'],
    isConditional: true,
  },
  {
    id: 'deductions',
    title: 'Deductions',
    isConditional: false,
  },
  {
    id: 'losses',
    title: 'Losses',
    isConditional: false,
  },
  {
    id: 'foreignAssetsIncome',
    title: 'Foreign Assets & Income',
    associatedSchedules: ['ScheduleFA'],
    isConditional: true,
    // TODO: Define the actual condition field path in ITRData later
    // e.g., conditionField: 'ITR.ITR2.ScheduleFA.TotalForeignAssetsFlag' 
  },
  {
    id: 'taxRegimeSelection',
    title: 'Tax Regime Selection',
    associatedSchedules: [], // This is a UI-only step for now
  },
  {
    id: 'assetsLiabilities',
    title: 'Assets & Liabilities',
    associatedSchedules: ['ScheduleAL'],
    isConditional: true,
    // TODO: Define the actual condition field path in ITRData later
    // e.g., conditionField: 'ITR.ITR2.PersonalInfo.TotalIncomeExceeds50Lakh'
  },
  {
    id: 'taxCalculationPayments',
    title: 'Tax Calculation & Payments',
    // Assuming PartB-TI and PartB-TTI contain these details + TaxPayments schedule
    associatedSchedules: ['PartBTI', 'PartBTTI', 'TaxPayments'], 
  },
  {
    id: 'summaryConfirmation',
    title: 'Summary & Confirmation',
    // This step might summarize data from various parts
    associatedSchedules: [], 
  },
]; 
import { type ITRViewerStepConfig } from '../types';

// Defines the sequence and configuration of steps for the ITR-1 viewer wizard.
export const itr1StepsConfig: ITRViewerStepConfig[] = [
  {
    id: 'personalInfo',
    title: 'Personal Information',
    associatedSchedules: ['PartA'],
  },
  {
    id: 'incomeDetails',
    title: 'Income Details',
    associatedSchedules: ['ITR1_IncomeDeductions'],
  },
  {
    id: 'deductions',
    title: 'Deductions',
    associatedSchedules: ['DeductUndChapVIA'],
  },
  {
    id: 'taxRegimeSelection',
    title: 'Tax Regime Selection',
    associatedSchedules: [], // UI-only step
  },
  {
    id: 'taxCalculationPayments',
    title: 'Tax Calculation & Payments',
    associatedSchedules: ['ITR1_TaxComputation', 'TaxPayments'],
  },
  {
    id: 'summaryConfirmation',
    title: 'Summary & Confirmation',
    associatedSchedules: [],
  },
]; 
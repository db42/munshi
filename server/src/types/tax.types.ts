export enum TaxRegimePreference {
    OLD = 'OLD',
    NEW = 'NEW',
    AUTO = 'AUTO'
}

export interface TaxRegimeComparison {
    oldRegimeTax: number;
    newRegimeTax: number;
    savings: number;
    recommendation: TaxRegimePreference.OLD | TaxRegimePreference.NEW;
} 
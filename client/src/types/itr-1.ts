import type { CreationInfo, FilingStatus, Clauseiv7Provisio139IType, AllwncExemptUs10, AllwncExemptUs10DtlsType, SalNatureDesc, NOT89AType, NOT89ACountrycode, DateRangeType, DateRange, IntrstPay, PersonalInfo, Address, CountryCode, AssesseeName, Refund, BankAccountDtls, BankDetailType, AccountType, Schedule80D, Sec80DSelfFamSrCtznHealth, Schedule80DD, DependentType, Schedule80G, Don100Percent, DoneeWithPan, AddressDetail, Don100PercentApprReqd, Don50PercentApprReqd, Don50PercentNoApprReqd, Schedule80GGA, DonationDtlsSciRsrchRuralDev, RelevantClauseUndrDedClaimed, Schedule80GGC, Schedule80GGCDetail, Schedule80U, ScheduleTCS, Tc, EmployerOrDeductorOrCollectDetl, TDSonSalary, TaxPaid, TaxesPaid, TaxPayment, TaxReturnPreparer, Verification, Capacity, Declaration } from "./itr";

// To parse this data:
//
//   import { Convert, Itr } from "./file";
//
//   const itr = Convert.toItr(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Itr {
    ITR?: ITRClass;
}

/**
 * This is root node. Irrespective of Individual or bulk IT returns filed.
 */
export interface ITRClass {
    ITR1: Itr1;
}

export interface Itr1 {
    CreationInfo:          CreationInfo;
    FilingStatus:          FilingStatus;
    Form_ITR1:             FormITR1;
    ITR1_IncomeDeductions: ITR1IncomeDeductions;
    ITR1_TaxComputation:   ITR1TaxComputation;
    LTCG112A?:             Ltcg112A;
    PersonalInfo:          PersonalInfo;
    Refund:                Refund;
    Schedule80C?:          Schedule80C;
    Schedule80D?:          Schedule80D;
    Schedule80DD?:         Schedule80DD;
    Schedule80E?:          Schedule80E;
    Schedule80EE?:         Schedule80EE;
    Schedule80EEA?:        Schedule80EEA;
    Schedule80EEB?:        Schedule80EEB;
    Schedule80G?:          Schedule80G;
    Schedule80GGA?:        Schedule80GGA;
    Schedule80GGC?:        Schedule80GGC;
    Schedule80U?:          Schedule80U;
    ScheduleEA10_13A?:     ScheduleEA1013A;
    ScheduleTCS?:          ScheduleTCS;
    ScheduleTDS3Dtls?:     ScheduleTDS3Dtls;
    ScheduleUs24B?:        ScheduleUs24B;
    TDSonOthThanSals?:     TDSonOthThanSals;
    TDSonSalaries?:        TDSonSalaries;
    TaxPaid:               TaxPaid;
    TaxPayments?:          TaxPayments;
    TaxReturnPreparer?:    TaxReturnPreparer;
    Verification:          Verification;
}

/**
 * 1 - the aggregate of tax deducted at source and tax collected at source during the
 * previous year, in the case of the person, is twenty-five thousand rupees or more(fifty
 * thousand for resident senior citizen); 2 - the deposit in one or more savings bank
 * account of the person, in aggregate, is fifty lakh rupees or more, in the previous year
 *
 * 1: Metro, 2: Non-Metro
 *
 * 1 : Self or dependent ; 2 : Self or Dependent - Senior Citizen
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * 1 : Dependent person with disability  ; 2 : Dependent person with severe disability
 *
 * 1 : autism, cerebral palsy, or multiple disabilities; 2 : others;
 *
 * 1 : Self with disability  ; 2 : Self with severe disability
 */
export enum Section80DdbUSRType {
    The1 = "1",
    The2 = "2",
}

/**
 * This is the element identified for ITR-1, holding AY, Form and Schema version values.
 */
export interface FormITR1 {
    AssessmentYear: string;
    Description:    string;
    FormName:       string;
    FormVer:        string;
    SchemaVer:      string;
}

/**
 * Income and deduction details
 */
export interface ITR1IncomeDeductions {
    AllwncExemptUs10?:          AllwncExemptUs10;
    AnnualValue:                number;
    ArrearsUnrealizedRentRcvd?: number;
    DeductUndChapVIA:           DeductUndChapVIAType;
    DeductionUs16:              number;
    DeductionUs16ia?:           number;
    DeductionUs57iia?:          number;
    EntertainmentAlw16ii?:      number;
    ExemptIncAgriOthUs10?:      ExemptIncAgriOthUs10;
    GrossRentReceived?:         number;
    GrossSalary:                number;
    /**
     * Gross Total Income without LTCG u/s 112A
     */
    GrossTotIncome: number;
    /**
     * Gross Total Income including LTCG u/s 112A
     */
    GrossTotIncomeIncLTCG112A: number;
    IncomeFromSal:             number;
    IncomeNotified89A:         number;
    IncomeNotified89AType?:    NOT89AType[];
    IncomeNotifiedOther89A?:   number;
    IncomeOthSrc:              number;
    Increliefus89A?:           number;
    Increliefus89AOS?:         number;
    InterestPayable?:          number;
    NetSalary:                 number;
    OthersInc?:                OthersInc;
    PerquisitesValue?:         number;
    ProfessionalTaxUs16iii?:   number;
    ProfitsInSalary?:          number;
    Salary?:                   number;
    /**
     * This field refers to Part-B B2 iv - 30% of Annual Value
     */
    StandardDeduction: number;
    TaxPaidlocalAuth?: number;
    TotalIncome:       number;
    /**
     * House Property income
     */
    TotalIncomeOfHP: number;
    /**
     * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
     */
    TypeOfHP?:           string;
    UsrDeductUndChapVIA: USRDeductUndChapVIAType;
}

/**
 * Deductions from income
 */
export interface DeductUndChapVIAType {
    AnyOthSec80CCH: number;
    Section80C:     number;
    Section80CCC:   number;
    Section80CCD1B: number;
    /**
     * For Employee/SelfEmployed
     */
    Section80CCDEmployeeOrSE: number;
    Section80CCDEmployer:     number;
    Section80D:               number;
    Section80DD:              number;
    Section80DDB:             number;
    Section80E:               number;
    Section80EE:              number;
    Section80EEA:             number;
    Section80EEB:             number;
    Section80G:               number;
    Section80GG:              number;
    Section80GGA:             number;
    Section80GGC:             number;
    Section80TTA:             number;
    Section80TTB:             number;
    Section80U:               number;
    TotalChapVIADeductions:   number;
}

export interface ExemptIncAgriOthUs10 {
    ExemptIncAgriOthUs10Dtls?: ExemptIncAgriOthUs10Type[];
    ExemptIncAgriOthUs10Total: number;
}

export interface ExemptIncAgriOthUs10Type {
    /**
     * AGRI : Agriculture Income (<= Rs.5000); 10(10BC): Sec 10(10BC)-Any amount from the
     * Central/State Govt./local authority by way of compensation on account of any disaster;
     * 10(10D) : Sec 10(10D)- Any sum received under a life insurance policy, including the sum
     * allocated by way of bonus on such policy except sum as mentioned in sub-clause (a) to (d)
     * of Sec.10(10D); 10(11) : Sec 10(11)-Statuory Provident Fund received; 10(12) : Sec
     * 10(12)-Recognised Provident Fund received;10(12C) : Sec 10(12C)-Any payment from the
     * Agniveer Corpus Fund to a person enrolled under the Agnipath Scheme, or to his nominee.;
     * 10(13) : Sec 10(13)-Approved superannuation fund received; 10(16) : Sec
     * 10(16)-Scholarships granted to meet the cost of education; 10(17) : Sec 10(17)-Allowance
     * MP/MLA/MLC; 10(17A) : Sec 10(17A)-Award instituted by Government; 10(18) : Sec
     * 10(18)-Pension received by winner of "Param Vir Chakra" or "Maha Vir Chakra" or "Vir
     * Chakra" or such other gallantry award; DMDP : Defense medical disability pension; 10(19)
     * : Sec 10(19)-Armed Forces Family pension in case of death during operational duty; 10(26)
     * : Sec 10(26)-Any income as referred to in section 10(26); 10(26AAA): Sec 10(26AAA)-Any
     * income as referred to in section 10(26AAA) ; OTH : Any Other
     */
    NatureDesc:   NatureDesc;
    OthAmount:    number;
    OthNatOfInc?: string;
}

/**
 * AGRI : Agriculture Income (<= Rs.5000); 10(10BC): Sec 10(10BC)-Any amount from the
 * Central/State Govt./local authority by way of compensation on account of any disaster;
 * 10(10D) : Sec 10(10D)- Any sum received under a life insurance policy, including the sum
 * allocated by way of bonus on such policy except sum as mentioned in sub-clause (a) to (d)
 * of Sec.10(10D); 10(11) : Sec 10(11)-Statuory Provident Fund received; 10(12) : Sec
 * 10(12)-Recognised Provident Fund received;10(12C) : Sec 10(12C)-Any payment from the
 * Agniveer Corpus Fund to a person enrolled under the Agnipath Scheme, or to his nominee.;
 * 10(13) : Sec 10(13)-Approved superannuation fund received; 10(16) : Sec
 * 10(16)-Scholarships granted to meet the cost of education; 10(17) : Sec 10(17)-Allowance
 * MP/MLA/MLC; 10(17A) : Sec 10(17A)-Award instituted by Government; 10(18) : Sec
 * 10(18)-Pension received by winner of "Param Vir Chakra" or "Maha Vir Chakra" or "Vir
 * Chakra" or such other gallantry award; DMDP : Defense medical disability pension; 10(19)
 * : Sec 10(19)-Armed Forces Family pension in case of death during operational duty; 10(26)
 * : Sec 10(26)-Any income as referred to in section 10(26); 10(26AAA): Sec 10(26AAA)-Any
 * income as referred to in section 10(26AAA) ; OTH : Any Other
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum NatureDesc {
    Agri = "AGRI",
    Dmdp = "DMDP",
    Oth = "OTH",
    The1010Bc = "10(10BC)",
    The1010D = "10(10D)",
    The1011 = "10(11)",
    The1012 = "10(12)",
    The1012C = "10(12C)",
    The1013 = "10(13)",
    The1016 = "10(16)",
    The1017 = "10(17)",
    The1017A = "10(17A)",
    The1018 = "10(18)",
    The1019 = "10(19)",
    The1026 = "10(26)",
    The1026AAA = "10(26AAA)",
}

export interface OthersInc {
    OthersIncDtlsOthSrc?: OtherSourceIncome[];
}

export interface OtherSourceIncome {
    DividendInc?: DateRangeType;
    NOT89A?:      NOT89AType[];
    NOT89AInc?:   DateRangeType;
    /**
     * SAV : Interest from Saving Account; IFD : Interest from Deposit(Bank/Post
     * Office/Cooperative Society); TAX : Interest from Income Tax Refund; FAP : Family pension;
     * DIV : Dividend; 10(11)(iP) : Interest accrued on contributions to provident fund to the
     * extent taxable as per first proviso to section 10(11); 10(11)(iiP) : Interest accrued on
     * contributions to provident fund to the extent taxable as per second proviso to section
     * 10(11); 10(12)(iP) : Interest accrued on contributions to provident fund to the extent
     * taxable as per first proviso to section 10(12); 10(12)(iiP) : Interest accrued on
     * contributions to provident fund to the extent taxable as per second proviso to section
     * 10(12); NOT89A : Income from retirement benefit account maintained in a notified country
     * u/s 89A ; OTHNOT89A : Income from retirement benefit account maintained in a country
     * other than a country notified u/s 89A ; OTH : Any Other
     */
    OthSrcNatureDesc:   OthSrcNatureDesc;
    OthSrcOthAmount:    number;
    OthSrcOthNatOfInc?: string;
}

/**
 * SAV : Interest from Saving Account; IFD : Interest from Deposit(Bank/Post
 * Office/Cooperative Society); TAX : Interest from Income Tax Refund; FAP : Family pension;
 * DIV : Dividend; 10(11)(iP) : Interest accrued on contributions to provident fund to the
 * extent taxable as per first proviso to section 10(11); 10(11)(iiP) : Interest accrued on
 * contributions to provident fund to the extent taxable as per second proviso to section
 * 10(11); 10(12)(iP) : Interest accrued on contributions to provident fund to the extent
 * taxable as per first proviso to section 10(12); 10(12)(iiP) : Interest accrued on
 * contributions to provident fund to the extent taxable as per second proviso to section
 * 10(12); NOT89A : Income from retirement benefit account maintained in a notified country
 * u/s 89A ; OTHNOT89A : Income from retirement benefit account maintained in a country
 * other than a country notified u/s 89A ; OTH : Any Other
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum OthSrcNatureDesc {
    Div = "DIV",
    FAP = "FAP",
    Ifd = "IFD",
    Not89A = "NOT89A",
    Oth = "OTH",
    Othnot89A = "OTHNOT89A",
    Sav = "SAV",
    Tax = "TAX",
    The1011IP = "10(11)(iP)",
    The1011IiP = "10(11)(iiP)",
    The1012IP = "10(12)(iP)",
    The1012IiP = "10(12)(iiP)",
}

/**
 * Deductions from income
 */
export interface USRDeductUndChapVIAType {
    AnyOthSec80CCH:  number;
    Form10BAAckNum?: string;
    /**
     * a : Dementia; b : Dystonia Musculorum Deformans; c : Motor Neuron Disease; d : Ataxia; e
     * : Chorea; f : Hemiballismus; g : Aphasia; h: Parkinsons Disease; i : Malignant Cancers; j
     * : Full Blown Acquired Immuno-Deficiency Syndrome (AIDS); k:Chronic Renal failure;
     * l:Hematological disorders; m: Hemophilia; n:Thalassaemia
     */
    NameOfSpecDisease80DDB?: NameOfSpecDisease80Ddb;
    PRANNum?:                string;
    Section80C:              number;
    Section80CCC:            number;
    Section80CCD1B:          number;
    /**
     * For Employee/SelfEmployed
     */
    Section80CCDEmployeeOrSE: number;
    Section80CCDEmployer:     number;
    Section80D:               number;
    Section80DD:              number;
    Section80DDB:             number;
    /**
     * 1 : Self or dependent ; 2 : Self or Dependent - Senior Citizen
     */
    Section80DDBUsrType?:   Section80DdbUSRType;
    Section80E:             number;
    Section80EE:            number;
    Section80EEA?:          number;
    Section80EEB?:          number;
    Section80G:             number;
    Section80GG:            number;
    Section80GGA:           number;
    Section80GGC:           number;
    Section80TTA:           number;
    Section80TTB:           number;
    Section80U:             number;
    TotalChapVIADeductions: number;
}

/**
 * a : Dementia; b : Dystonia Musculorum Deformans; c : Motor Neuron Disease; d : Ataxia; e
 * : Chorea; f : Hemiballismus; g : Aphasia; h: Parkinsons Disease; i : Malignant Cancers; j
 * : Full Blown Acquired Immuno-Deficiency Syndrome (AIDS); k:Chronic Renal failure;
 * l:Hematological disorders; m: Hemophilia; n:Thalassaemia
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum NameOfSpecDisease80Ddb {
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
    I = "i",
    J = "j",
    K = "k",
    L = "l",
    M = "m",
    N = "n",
}

/**
 * Tax computation details
 */
export interface ITR1TaxComputation {
    EducationCess:     number;
    GrossTaxLiability: number;
    IntrstPay:         IntrstPay;
    /**
     * Balance Tax After Relief
     */
    NetTaxLiability:     number;
    Rebate87A:           number;
    Section89:           number;
    TaxPayableOnRebate:  number;
    TotTaxPlusIntrstPay: number;
    TotalIntrstPay:      number;
    TotalTaxPayable:     number;
}

/**
 * Long Term capital gains u/s 112A
 */
export interface Ltcg112A {
    LongCap112A:   number;
    TotCstAcqisn:  number;
    TotSaleCnsdrn: number;
}

/**
 * 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
 * 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
 * 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
 * Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21-meghalaya;
 * 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
 * Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
 * 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh; 99-Foreign
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum AddressStateCode {
    The01 = "01",
    The02 = "02",
    The03 = "03",
    The04 = "04",
    The05 = "05",
    The06 = "06",
    The07 = "07",
    The08 = "08",
    The09 = "09",
    The10 = "10",
    The11 = "11",
    The12 = "12",
    The13 = "13",
    The14 = "14",
    The15 = "15",
    The16 = "16",
    The17 = "17",
    The18 = "18",
    The19 = "19",
    The20 = "20",
    The21 = "21",
    The22 = "22",
    The23 = "23",
    The24 = "24",
    The25 = "25",
    The26 = "26",
    The27 = "27",
    The28 = "28",
    The29 = "29",
    The30 = "30",
    The31 = "31",
    The32 = "32",
    The33 = "33",
    The34 = "34",
    The35 = "35",
    The36 = "36",
    The37 = "37",
    The99 = "99",
}

/**
 * CGOV:Central Government, SGOV:State Government, PSU:Public Sector Unit, PE:Pensioners -
 * Central Government, PESG:Pensioners - State Government, PEPS:Pensioners - Public sector
 * undertaking, PEO:Pensioners - Others, OTH:Others, NA:Not Applicable
 */
export enum EmployerCategory {
    Cgov = "CGOV",
    Na = "NA",
    Oth = "OTH",
    PE = "PE",
    PSU = "PSU",
    Peo = "PEO",
    Peps = "PEPS",
    Pesg = "PESG",
    Sgov = "SGOV",
}

/**
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum UseForRefund {
    False = "false",
    True = "true",
}

export interface Schedule80C {
    Schedule80CDtls: Schedule80CDtl[];
    TotalAmt:        number;
}

export interface Schedule80CDtl {
    Amount:           number;
    IdentificationNo: string;
}

export interface Sec80DParentsHIDtls {
    Sch80DInsDtls: Sch80DInsDtls[];
    TotalPayments: number;
}

export interface Sch80DInsDtls {
    HealthInsAmt: number;
    InsurerName:  string;
    PolicyNo:     string;
}

export interface Sec80DParentsSrCtznHIDtls {
    Sch80DInsDtls: Sch80DInsDtls[];
    TotalPayments: number;
}

export interface Sec80DSelfFamHIDtls {
    Sch80DInsDtls: Sch80DInsDtls[];
    TotalPayments: number;
}

export interface Sec80DSelfFamSrCtznHIDtls {
    Sch80DInsDtls: Sch80DInsDtls[];
    TotalPayments: number;
}

export interface Schedule80E {
    Schedule80EDtls:  Schedule80EDtl[];
    TotalInterest80E: number;
}

export interface Schedule80EDtl {
    BankOrInstnName: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofLoan:                  string;
    Interest80E:                 number;
    LoanAccNoOfBankOrInstnRefNo: string;
    LoanOutstndngAmt:            number;
    /**
     * B: Bank, I: Institution
     */
    LoanTknFrom:  LoanTknFrom;
    TotalLoanAmt: number;
}

/**
 * B: Bank, I: Institution
 *
 * B: Bank, I: Other than Bank
 */
export enum LoanTknFrom {
    B = "B",
    I = "I",
}

export interface Schedule80EE {
    Schedule80EEDtls:  Schedule80EEDtl[];
    TotalInterest80EE: number;
}

export interface Schedule80EEDtl {
    BankOrInstnName: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofLoan:                  string;
    Interest80EE:                number;
    LoanAccNoOfBankOrInstnRefNo: string;
    LoanOutstndngAmt:            number;
    /**
     * B: Bank, I: Institution
     */
    LoanTknFrom:  LoanTknFrom;
    TotalLoanAmt: number;
}

export interface Schedule80EEA {
    PropStmpDtyVal:     number;
    Schedule80EEADtls:  Schedule80EEADtl[];
    TotalInterest80EEA: number;
}

export interface Schedule80EEADtl {
    BankOrInstnName: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofLoan:                  string;
    Interest80EEA:               number;
    LoanAccNoOfBankOrInstnRefNo: string;
    LoanOutstndngAmt:            number;
    /**
     * B: Bank, I: Institution
     */
    LoanTknFrom:  LoanTknFrom;
    TotalLoanAmt: number;
}

export interface Schedule80EEB {
    Schedule80EEBDtls:  Schedule80EEBDtl[];
    TotalInterest80EEB: number;
}

export interface Schedule80EEBDtl {
    BankOrInstnName: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofLoan:                  string;
    Interest80EEB:               number;
    LoanAccNoOfBankOrInstnRefNo: string;
    LoanOutstndngAmt:            number;
    /**
     * B: Bank, I: Institution
     */
    LoanTknFrom:  LoanTknFrom;
    TotalLoanAmt: number;
    VehicleRegNo: string;
}

/**
 * 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
 * 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
 * 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
 * Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21-meghalaya;
 * 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
 * Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
 * 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum AddressDetailStateCode {
    The01 = "01",
    The02 = "02",
    The03 = "03",
    The04 = "04",
    The05 = "05",
    The06 = "06",
    The07 = "07",
    The08 = "08",
    The09 = "09",
    The10 = "10",
    The11 = "11",
    The12 = "12",
    The13 = "13",
    The14 = "14",
    The15 = "15",
    The16 = "16",
    The17 = "17",
    The18 = "18",
    The19 = "19",
    The20 = "20",
    The21 = "21",
    The22 = "22",
    The23 = "23",
    The24 = "24",
    The25 = "25",
    The26 = "26",
    The27 = "27",
    The28 = "28",
    The29 = "29",
    The30 = "30",
    The31 = "31",
    The32 = "32",
    The33 = "33",
    The34 = "34",
    The35 = "35",
    The36 = "36",
    The37 = "37",
}

export interface ScheduleEA1013A {
    ActlHRARecv:            number;
    ActlRentPaid:           number;
    ActlRentPaid10Per:      number;
    BasicSalary:            number;
    DearnessAllwnc?:        number;
    DtlsSalUsSec171:        number;
    EligbleExmpAllwncUs13A: number;
    /**
     * 1: Metro, 2: Non-Metro
     */
    Placeofwork:  Section80DdbUSRType;
    Sal40Or50Per: number;
}

/**
 * 2024: 2024-25; 2023: 2023-24; 2022: 2022-23; 2021: 2021-22; 2020: 2020-21; 2019: 2019-20;
 * 2018: 2018-19; 2017: 2017-18; 2016: 2016-17; 2015: 2015-16; 2014: 2014-15; 2013: 2013-14;
 * 2012: 2012-13; 2011: 2011-12; 2010: 2010-11; 2009: 2009-10; 2008: 2008-09
 *
 * 2024: 2024-25; 2023: 2023-24; 2022: 2022-23; 2021: 2021-22; 2020: 2020-21; 2019: 2019-20;
 * 2018: 2018-19; 2017: 2017-18; 2016: 2016-17; 2015: 2015-16; 2014: 2014-15; 2013: 2013-14;
 * 2012: 2012-13; 2011: 2011-12; 2010: 2010-11; 2009: 2009-10; 2008: 2008-09
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum CollectedYrEnum {
    The2008 = "2008",
    The2009 = "2009",
    The2010 = "2010",
    The2011 = "2011",
    The2012 = "2012",
    The2013 = "2013",
    The2014 = "2014",
    The2015 = "2015",
    The2016 = "2016",
    The2017 = "2017",
    The2018 = "2018",
    The2019 = "2019",
    The2020 = "2020",
    The2021 = "2021",
    The2022 = "2022",
    The2023 = "2023",
    The2024 = "2024",
}

/**
 * Details of Tax Deducted at Source [16C furnished by the Deductor(s)]
 */
export interface ScheduleTDS3Dtls {
    TDS3Details?:     TDS3Details[];
    TotalTDS3Details: number;
}

export interface TDS3Details {
    AadhaarofTenant?: string;
    /**
     * 2024:2024-25; 2023:2023-24; 2022:2022-23; 2021:2021-22; 2020:2020-21; 2019:2019-20;
     * 2018:2018-19; 2017:2017-18;
     */
    DeductedYr:         TDS3DetailDeductedYr;
    GrsRcptToTaxDeduct: number;
    NameOfTenant:       string;
    PANofTenant:        string;
    TDSClaimed:         number;
    TDSDeducted:        number;
    /**
     * 92A:192- Salary-Payment to Government employees other than Indian Government employees;
     * 92B:192- Salary-Payment to employees other than Government employees; 92C:192-
     * Salary-Payment to Indian Government employees; 192A:192A/2AA- TDS on PF withdrawal;
     * 193:193- Interest on Securities; 194:194- Dividends; 94A:194A- Interest other than
     * 'Interest on securities'; 94B:194B- Winning from lottery or crossword puzzle; 94BA:194BA-
     * Winnings from online games; 4BB:194BB- Winning from horse race; 94C:194C- Payments to
     * contractors and sub-contractors; 94D:194D- Insurance commission; 4DA:194DA- Payment in
     * respect of life insurance policy; 94E:194E- Payments to non-resident sportsmen or sports
     * associations; 4EE:194EE- Payments in respect of deposits under National Savings;
     * 4F:194F/94F- Payments on account of repurchase of units by Mutual Fund or Unit Trust of
     * India; 4G:194G/94G- Commission, price, etc. on sale of lottery tickets; 4H:194H/94H-
     * Commission or brokerage; 4-IA:194I(a)/4IA- Rent on hiring of plant and machinery;
     * 4-IB:194I(b)/4IB - Rent on other than plant and machinery; 4IA:194IA/9IA- TDS on Sale of
     * immovable property; 4IB:194IB/9IB- Payment of rent by certain individuals or Hindu
     * undivided; 4IC:194IC- Payment under specified agreement; 94J-A:194J(a)/4JA - Fees for
     * technical services; 94J-B:194J(b)/4JB- Fees for professional  services or royalty etc;
     * 94K:194K- Income payable to a resident assessee in respect of units of a specified mutual
     * fund or of the units of the Unit Trust of India; 4LA:194LA- Payment of compensation on
     * acquisition of certain immovable; 4LB:194LB- Income by way of Interest from
     * Infrastructure Debt fund; 4LC1:194LC/LC1- 194LC (2)(i) and (ia) Income under clause (i)
     * and (ia) of sub-section (2) of section 194LC; 4LC2:194LC/LC2- 194LC (2)(ib) Income under
     * clause (ib) of sub-section (2) of section 194LC; 4LC3:194LC/LC3- 194LC (2)(ic) Income
     * under clause (ic) of sub-section (2) of section 194LC; 4BA1:194LBA(a)/BA1- Certain income
     * in the form of interest from units of a business trust to a resident unit holder; 4BA2:
     * 194LBA(b)/BA2- Certain income in the form of dividend from units of a business trust to a
     * resident unit holder; LBA1:194LBA(a)/BA1- 194LBA(a) income referred to in section
     * 10(23FC)(a) from units of a business trust-NR; LBA2:194LBA(b)/BA2-194LBA(b) Income
     * referred to in section 10(23FC)(b) from units of a business trust-NR; LBA3:194LBA(c)/BA3-
     * 194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR; LBB:
     * 194LBB- Income in respect of units of investment fund; 94R:194R- Benefits or perquisites
     * of business or profession; 94S:194S- Payment of consideration for transfer of virtual
     * digital asset by persons other than specified persons; 94B-P:Proviso to section 194B/4BP-
     * Winnings from lotteries and crossword puzzles where consideration is made in kind or cash
     * is not sufficient to meet the tax liability and tax has been paid before such winnings
     * are released; 94R-P: First Proviso to sub-section(1) of section 194R/4RP- Benefits or
     * perquisites of business or profession where such benefit is provided in kind or where
     * part in cash is not sufficient to meet tax liability and tax required to be deducted is
     * paid before such benefit is released; 94S-P:Proviso to sub- section(1) of section
     * 194S/4SP- Payment for transfer of virtual digital asset where payment is in kind or in
     * exchange of another virtual digital asset and tax required to be deducted is paid before
     * such payment is released; LBC:194LBC- Income in respect of investment in securitization
     * trust; 4LD:194LD- TDS on interest on bonds / government securities; 94M:194M- Payment of
     * certain sums by certain individuals or HUF; 94N:194N- Payment of certain amounts in cash
     * other than cases covered by first proviso or third proviso; 94N-F: 194N/4NF -First
     * Proviso Payment of certain amounts in cash to non-filers except in case of
     * co-operativesocieties; 94N-C:194N/4NC- Third Proviso Payment of certain amounts in cash
     * to co-operative societies not covered by first proviso; 94N-FT: 194N/NFT- First Proviso
     * read with Third Proviso Payment of certain amount in cash to non-filers being
     * co-operative societies; 94O:194O- Payment of certain sums by e-commerce operator to
     * e-commerce participant.; 94P: 194P- Deduction of tax in case of specified senior citizen;
     * 94Q:194Q- Deduction of tax at source on payment of certain sum for purchase of goods;
     * 195:195- Other sums payable to a non-resident; 96A:196A- Income in respect of units of
     * non-residents; 96B:196B- Payments in respect of units to an offshore fund; 96C:196C-
     * Income from foreign currency bonds or shares of Indian; 96D:196D- Income of foreign
     * institutional investors from securities; 96DA:196D(1A)/6DA- Income of specified fund from
     * securities; 94BA-P: 194BA(2)/BAP-Sub-section (2) of section 194BA Net Winnings from
     * online games where the net winnings are made in kind or cash is not sufficient to meet
     * the tax liability and tax has been paid before such net winnings are released;
     */
    TDSSection: TdsSection;
}

/**
 * 2024:2024-25; 2023:2023-24; 2022:2022-23; 2021:2021-22; 2020:2020-21; 2019:2019-20;
 * 2018:2018-19; 2017:2017-18;
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum TDS3DetailDeductedYr {
    The2017 = "2017",
    The2018 = "2018",
    The2019 = "2019",
    The2020 = "2020",
    The2021 = "2021",
    The2022 = "2022",
    The2023 = "2023",
    The2024 = "2024",
}

/**
 * 92A:192- Salary-Payment to Government employees other than Indian Government employees;
 * 92B:192- Salary-Payment to employees other than Government employees; 92C:192-
 * Salary-Payment to Indian Government employees; 192A:192A/2AA- TDS on PF withdrawal;
 * 193:193- Interest on Securities; 194:194- Dividends; 94A:194A- Interest other than
 * 'Interest on securities'; 94B:194B- Winning from lottery or crossword puzzle; 94BA:194BA-
 * Winnings from online games; 4BB:194BB- Winning from horse race; 94C:194C- Payments to
 * contractors and sub-contractors; 94D:194D- Insurance commission; 4DA:194DA- Payment in
 * respect of life insurance policy; 94E:194E- Payments to non-resident sportsmen or sports
 * associations; 4EE:194EE- Payments in respect of deposits under National Savings;
 * 4F:194F/94F- Payments on account of repurchase of units by Mutual Fund or Unit Trust of
 * India; 4G:194G/94G- Commission, price, etc. on sale of lottery tickets; 4H:194H/94H-
 * Commission or brokerage; 4-IA:194I(a)/4IA- Rent on hiring of plant and machinery;
 * 4-IB:194I(b)/4IB - Rent on other than plant and machinery; 4IA:194IA/9IA- TDS on Sale of
 * immovable property; 4IB:194IB/9IB- Payment of rent by certain individuals or Hindu
 * undivided; 4IC:194IC- Payment under specified agreement; 94J-A:194J(a)/4JA - Fees for
 * technical services; 94J-B:194J(b)/4JB- Fees for professional  services or royalty etc;
 * 94K:194K- Income payable to a resident assessee in respect of units of a specified mutual
 * fund or of the units of the Unit Trust of India; 4LA:194LA- Payment of compensation on
 * acquisition of certain immovable; 4LB:194LB- Income by way of Interest from
 * Infrastructure Debt fund; 4LC1:194LC/LC1- 194LC (2)(i) and (ia) Income under clause (i)
 * and (ia) of sub-section (2) of section 194LC; 4LC2:194LC/LC2- 194LC (2)(ib) Income under
 * clause (ib) of sub-section (2) of section 194LC; 4LC3:194LC/LC3- 194LC (2)(ic) Income
 * under clause (ic) of sub-section (2) of section 194LC; 4BA1:194LBA(a)/BA1- Certain income
 * in the form of interest from units of a business trust to a resident unit holder; 4BA2:
 * 194LBA(b)/BA2- Certain income in the form of dividend from units of a business trust to a
 * resident unit holder; LBA1:194LBA(a)/BA1- 194LBA(a) income referred to in section
 * 10(23FC)(a) from units of a business trust-NR; LBA2:194LBA(b)/BA2-194LBA(b) Income
 * referred to in section 10(23FC)(b) from units of a business trust-NR; LBA3:194LBA(c)/BA3-
 * 194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR; LBB:
 * 194LBB- Income in respect of units of investment fund; 94R:194R- Benefits or perquisites
 * of business or profession; 94S:194S- Payment of consideration for transfer of virtual
 * digital asset by persons other than specified persons; 94B-P:Proviso to section 194B/4BP-
 * Winnings from lotteries and crossword puzzles where consideration is made in kind or cash
 * is not sufficient to meet the tax liability and tax has been paid before such winnings
 * are released; 94R-P: First Proviso to sub-section(1) of section 194R/4RP- Benefits or
 * perquisites of business or profession where such benefit is provided in kind or where
 * part in cash is not sufficient to meet tax liability and tax required to be deducted is
 * paid before such benefit is released; 94S-P:Proviso to sub- section(1) of section
 * 194S/4SP- Payment for transfer of virtual digital asset where payment is in kind or in
 * exchange of another virtual digital asset and tax required to be deducted is paid before
 * such payment is released; LBC:194LBC- Income in respect of investment in securitization
 * trust; 4LD:194LD- TDS on interest on bonds / government securities; 94M:194M- Payment of
 * certain sums by certain individuals or HUF; 94N:194N- Payment of certain amounts in cash
 * other than cases covered by first proviso or third proviso; 94N-F: 194N/4NF -First
 * Proviso Payment of certain amounts in cash to non-filers except in case of
 * co-operativesocieties; 94N-C:194N/4NC- Third Proviso Payment of certain amounts in cash
 * to co-operative societies not covered by first proviso; 94N-FT: 194N/NFT- First Proviso
 * read with Third Proviso Payment of certain amount in cash to non-filers being
 * co-operative societies; 94O:194O- Payment of certain sums by e-commerce operator to
 * e-commerce participant.; 94P: 194P- Deduction of tax in case of specified senior citizen;
 * 94Q:194Q- Deduction of tax at source on payment of certain sum for purchase of goods;
 * 195:195- Other sums payable to a non-resident; 96A:196A- Income in respect of units of
 * non-residents; 96B:196B- Payments in respect of units to an offshore fund; 96C:196C-
 * Income from foreign currency bonds or shares of Indian; 96D:196D- Income of foreign
 * institutional investors from securities; 96DA:196D(1A)/6DA- Income of specified fund from
 * securities; 94BA-P: 194BA(2)/BAP-Sub-section (2) of section 194BA Net Winnings from
 * online games where the net winnings are made in kind or cash is not sufficient to meet
 * the tax liability and tax has been paid before such net winnings are released;
 *
 * House Property income Type - S:Self Occupied; L:Let Out; D:Deemed let out
 *
 * Enter Last or Sur name for Individual name here
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 */
export enum TdsSection {
    Lba1 = "LBA1",
    Lba2 = "LBA2",
    Lba3 = "LBA3",
    Lbb = "LBB",
    Lbc = "LBC",
    TdsSection4IA = "4IA",
    TdsSection4IB = "4IB",
    The192A = "192A",
    The193 = "193",
    The194 = "194",
    The195 = "195",
    The4Ba1 = "4BA1",
    The4Ba2 = "4BA2",
    The4Bb = "4BB",
    The4Da = "4DA",
    The4Ee = "4EE",
    The4F = "4F",
    The4G = "4G",
    The4H = "4H",
    The4IC = "4IC",
    The4Ia = "4-IA",
    The4Ib = "4-IB",
    The4LB = "4LB",
    The4La = "4LA",
    The4Lc1 = "4LC1",
    The4Lc2 = "4LC2",
    The4Lc3 = "4LC3",
    The4Ld = "4LD",
    The92A = "92A",
    The92B = "92B",
    The92C = "92C",
    The94A = "94A",
    The94B = "94B",
    The94BP = "94B-P",
    The94Ba = "94BA",
    The94BaP = "94BA-P",
    The94C = "94C",
    The94D = "94D",
    The94E = "94E",
    The94JA = "94J-A",
    The94JB = "94J-B",
    The94K = "94K",
    The94M = "94M",
    The94N = "94N",
    The94NC = "94N-C",
    The94NF = "94N-F",
    The94NFt = "94N-FT",
    The94O = "94O",
    The94P = "94P",
    The94Q = "94Q",
    The94R = "94R",
    The94RP = "94R-P",
    The94S = "94S",
    The94SP = "94S-P",
    The96A = "96A",
    The96B = "96B",
    The96C = "96C",
    The96D = "96D",
    The96Da = "96DA",
}

export interface ScheduleUs24B {
    ScheduleUs24BDtls:  ScheduleUs24BDtl[];
    TotalInterestUs24B: number;
}

export interface ScheduleUs24BDtl {
    BankOrInstnName: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofLoan:                  string;
    InterestUs24B:               number;
    LoanAccNoOfBankOrInstnRefNo: string;
    LoanOutstndngAmt:            number;
    /**
     * B: Bank, I: Other than Bank
     */
    LoanTknFrom:  LoanTknFrom;
    TotalLoanAmt: number;
}

/**
 * 22. Details of Tax Deducted at Source on Interest [As per Form 16 A issued by Deductor(s)]
 */
export interface TDSonOthThanSals {
    TDSonOthThanSal?:      TDSonOthThanSal[];
    TotalTDSonOthThanSals: number;
}

export interface TDSonOthThanSal {
    AmtForTaxDeduct:           number;
    ClaimOutOfTotTDSOnAmtPaid: number;
    /**
     * 2024: 2024-25; 2023: 2023-24; 2022: 2022-23; 2021: 2021-22; 2020: 2020-21; 2019: 2019-20;
     * 2018: 2018-19; 2017: 2017-18; 2016: 2016-17; 2015: 2015-16; 2014: 2014-15; 2013: 2013-14;
     * 2012: 2012-13; 2011: 2011-12; 2010: 2010-11; 2009: 2009-10; 2008: 2008-09
     */
    DeductedYr:                      CollectedYrEnum;
    EmployerOrDeductorOrCollectDetl: EmployerOrDeductorOrCollectDetl;
    /**
     * 92A:192- Salary-Payment to Government employees other than Indian Government employees;
     * 92B:192- Salary-Payment to employees other than Government employees; 92C:192-
     * Salary-Payment to Indian Government employees; 192A:192A/2AA- TDS on PF withdrawal;
     * 193:193- Interest on Securities; 194:194- Dividends; 94A:194A- Interest other than
     * 'Interest on securities'; 94B:194B- Winning from lottery or crossword puzzle; 94BA:194BA-
     * Winnings from online games; 4BB:194BB- Winning from horse race; 94C:194C- Payments to
     * contractors and sub-contractors; 94D:194D- Insurance commission; 4DA:194DA- Payment in
     * respect of life insurance policy; 94E:194E- Payments to non-resident sportsmen or sports
     * associations; 4EE:194EE- Payments in respect of deposits under National Savings;
     * 4F:194F/94F- Payments on account of repurchase of units by Mutual Fund or Unit Trust of
     * India; 4G:194G/94G- Commission, price, etc. on sale of lottery tickets; 4H:194H/94H-
     * Commission or brokerage; 4-IA:194I(a)/4IA- Rent on hiring of plant and machinery;
     * 4-IB:194I(b)/4IB - Rent on other than plant and machinery; 4IA:194IA/9IA- TDS on Sale of
     * immovable property; 4IB:194IB/9IB- Payment of rent by certain individuals or Hindu
     * undivided; 4IC:194IC- Payment under specified agreement; 94J-A:194J(a)/4JA - Fees for
     * technical services; 94J-B:194J(b)/4JB- Fees for professional  services or royalty etc;
     * 94K:194K- Income payable to a resident assessee in respect of units of a specified mutual
     * fund or of the units of the Unit Trust of India; 4LA:194LA- Payment of compensation on
     * acquisition of certain immovable; 4LB:194LB- Income by way of Interest from
     * Infrastructure Debt fund; 4LC1:194LC/LC1- 194LC (2)(i) and (ia) Income under clause (i)
     * and (ia) of sub-section (2) of section 194LC; 4LC2:194LC/LC2- 194LC (2)(ib) Income under
     * clause (ib) of sub-section (2) of section 194LC; 4LC3:194LC/LC3- 194LC (2)(ic) Income
     * under clause (ic) of sub-section (2) of section 194LC; 4BA1:194LBA(a)/BA1- Certain income
     * in the form of interest from units of a business trust to a resident unit holder; 4BA2:
     * 194LBA(b)/BA2- Certain income in the form of dividend from units of a business trust to a
     * resident unit holder; LBA1:194LBA(a)/BA1- 194LBA(a) income referred to in section
     * 10(23FC)(a) from units of a business trust-NR; LBA2:194LBA(b)/BA2-194LBA(b) Income
     * referred to in section 10(23FC)(b) from units of a business trust-NR; LBA3:194LBA(c)/BA3-
     * 194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR; LBB:
     * 194LBB- Income in respect of units of investment fund; 94R:194R- Benefits or perquisites
     * of business or profession; 94S:194S- Payment of consideration for transfer of virtual
     * digital asset by persons other than specified persons; 94B-P:Proviso to section 194B/4BP-
     * Winnings from lotteries and crossword puzzles where consideration is made in kind or cash
     * is not sufficient to meet the tax liability and tax has been paid before such winnings
     * are released; 94R-P: First Proviso to sub-section(1) of section 194R/4RP- Benefits or
     * perquisites of business or profession where such benefit is provided in kind or where
     * part in cash is not sufficient to meet tax liability and tax required to be deducted is
     * paid before such benefit is released; 94S-P:Proviso to sub- section(1) of section
     * 194S/4SP- Payment for transfer of virtual digital asset where payment is in kind or in
     * exchange of another virtual digital asset and tax required to be deducted is paid before
     * such payment is released; LBC:194LBC- Income in respect of investment in securitization
     * trust; 4LD:194LD- TDS on interest on bonds / government securities; 94M:194M- Payment of
     * certain sums by certain individuals or HUF; 94N:194N- Payment of certain amounts in cash
     * other than cases covered by first proviso or third proviso; 94N-F: 194N/4NF -First
     * Proviso Payment of certain amounts in cash to non-filers except in case of
     * co-operativesocieties; 94N-C:194N/4NC- Third Proviso Payment of certain amounts in cash
     * to co-operative societies not covered by first proviso; 94N-FT: 194N/NFT- First Proviso
     * read with Third Proviso Payment of certain amount in cash to non-filers being
     * co-operative societies; 94O:194O- Payment of certain sums by e-commerce operator to
     * e-commerce participant.; 94P: 194P- Deduction of tax in case of specified senior citizen;
     * 94Q:194Q- Deduction of tax at source on payment of certain sum for purchase of goods;
     * 195:195- Other sums payable to a non-resident; 96A:196A- Income in respect of units of
     * non-residents; 96B:196B- Payments in respect of units to an offshore fund; 96C:196C-
     * Income from foreign currency bonds or shares of Indian; 96D:196D- Income of foreign
     * institutional investors from securities; 96DA:196D(1A)/6DA- Income of specified fund from
     * securities; 94BA-P: 194BA(2)/BAP-Sub-section (2) of section 194BA Net Winnings from
     * online games where the net winnings are made in kind or cash is not sufficient to meet
     * the tax liability and tax has been paid before such net winnings are released;
     */
    TDSSection:      TdsSection;
    TotTDSOnAmtPaid: number;
}

/**
 * Salary TDS details
 */
export interface TDSonSalaries {
    TDSonSalary?:       TDSonSalary[];
    TotalTDSonSalaries: number;
}

/**
 * Tax payment details
 */
export interface TaxPayments {
    TaxPayment?:      TaxPayment[];
    TotalTaxPayments: number;
}
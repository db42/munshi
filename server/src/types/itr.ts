import type { Itr } from "./common-itr";

// To parse this data:
//
//   import { Convert, Itr } from "./file";
//
//   const itr = Convert.toItr(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Itr2 {
    CreationInfo:       CreationInfo;
    Form_ITR2:          FormITR2;
    PartA_GEN1:         PartAGEN1;
    "PartB-TI":         PartBTI;
    PartB_TTI:          PartBTTI;
    Schedule112A?:      Schedule112A;
    Schedule115AD?:     Schedule115AD;
    Schedule5A2014?:    Schedule5A2014;
    Schedule80D?:       Schedule80D;
    Schedule80DD?:      Schedule80DD;
    Schedule80G?:       Schedule80G;
    Schedule80GGA?:     Schedule80GGA;
    Schedule80GGC?:     Schedule80GGC;
    Schedule80U?:       Schedule80U;
    ScheduleAL?:        ScheduleAL;
    ScheduleAMT?:       ScheduleAMT;
    ScheduleAMTC?:      ScheduleAMTC;
    ScheduleBFLA:       ScheduleBFLA;
    ScheduleCFL?:       ScheduleCFL;
    ScheduleCGFor23?:   ScheduleCGFor23;
    ScheduleCYLA:       ScheduleCYLA;
    ScheduleEI?:        ScheduleEI;
    ScheduleESOP?:      ScheduleESOP;
    ScheduleFA?:        ScheduleFA;
    ScheduleFSI?:       ScheduleFSI;
    ScheduleHP?:        ScheduleHP;
    ScheduleIT?:        ScheduleIT;
    ScheduleOS?:        ScheduleOS;
    SchedulePTI?:       SchedulePTI;
    ScheduleS?:         ScheduleS;
    ScheduleSI?:        ScheduleSI;
    ScheduleSPI?:       ScheduleSPI;
    ScheduleTCS?:       ScheduleTCS;
    ScheduleTDS1?:      ScheduleTDS1;
    ScheduleTDS2?:      ScheduleTDS2;
    ScheduleTDS3?:      ScheduleTDS3;
    ScheduleTR1?:       ScheduleTR1;
    ScheduleVDA?:       ScheduleVDA;
    ScheduleVIA?:       ScheduleVIA;
    TaxReturnPreparer?: TaxReturnPreparer;
    Verification:       Verification;
}

/**
 * This element will be used by third party vendors and intermediaries to give details of
 * their software or JSON creation.
 */
export interface CreationInfo {
    Digest:           string;
    IntermediaryCity: string;
    JSONCreatedBy:    string;
    /**
     * Date in YYYY-MM-DD format on or after 2023-04-01
     */
    JSONCreationDate: string;
    SWCreatedBy:      string;
    SWVersionNo:      string;
}

export interface FormITR2 {
    AssessmentYear: string;
    /**
     * For Individuals and HUFs not having income from profits and gains of business or
     * profession
     */
    Description: string;
    FormName:    string;
    FormVer:     string;
    SchemaVer:   string;
}

/**
 * General
 */
export interface PartAGEN1 {
    FilingStatus: FilingStatus;
    PersonalInfo: PersonalInfo;
}

export interface FilingStatus {
    AmtSeventhProvisio139i?:   number;
    AmtSeventhProvisio139ii?:  number;
    AmtSeventhProvisio139iii?: number;
    /**
     * Y - Yes; N - No
     */
    AsseseeRepFlg?: TaxRescertifiedFlag;
    AssesseeRep?:   AssesseeRep;
    /**
     * Y-YES; N-NO
     */
    BenefitUs115HFlg?:  TaxRescertifiedFlag;
    CompDirectorPrvYr?: CompDirectorPrvYr;
    /**
     * Y - Yes; N - No
     */
    CompDirectorPrvYrFlg?: TaxRescertifiedFlag;
    /**
     * 1 : You were in India for 182 days or more during the previous year [section 6(1)(a)]; 2
     * : You were in India for 60 days or more during the previous year, and have been in India
     * for 365 days or more within the 4 preceding years [section (6)(1)(c)] [where Explanation
     * 1 is not applicable]; 3 : You have been a non-resident in India in 9 out of 10 preceding
     * years [section 6(6)(a)]; 4 : You have been in India for 729 days or less during the 7
     * preceding years [section 6(6)(a)]; 5 : You were a non-resident during the previous year;
     * 6 : You are a citizen of India or person of Indian origin, who comes on a visit to India,
     * having total income, other than the income from foreign sources, exceeding Rs. 15 lakh
     * and have been in India for 120 days or more but less than 182 days during the previous
     * year [section 6(6)(c)]; 7 : You are a citizen of India having total income, other than
     * the income from foreign sources, exceeding Rs. 15 lakh during the previous year and not
     * liable to tax in any other country or territory by reason of your domicile or residence
     * or any other criteria of similar nature [section 6(6)(d) rws 6(1A)]; 8 : You are a
     * citizen of India, who left India, for the purpose of employment, as a member of the crew
     * of an Indian ship and were in India for 182 days or more during the previous year and 365
     * days or more within the preceding 4 years [Explanation 1(a) of section (6)(1)(c)]; 9 :
     * You are a citizen of India or a person of Indian origin and have come on a visit to India
     * during the previous year and were in India for a) 182 days or more during the previous
     * year and 365 days or more within the preceding 4 years; or b) 120 days or more during the
     * previous year and 365 days or more within the preceding 4 years if the total income,
     * other than income from foreign sources, exceeds Rs. 15 lakh. [Explanation 1(b) of section
     * (6)(1)(c)]
     */
    ConditionsResStatus?:        ConditionsResStatus;
    DepAmtAggAmtExcd1CrPrYrFlg?: string;
    /**
     * Whether you are an FII/FPI?; Y - Yes; N - No
     */
    FiiFpiFlag:             TaxRescertifiedFlag;
    HeldUnlistedEqShrPrYr?: HeldUnlistedEqShrPRYr;
    /**
     * Y - Yes; N - No
     */
    HeldUnlistedEqShrPrYrFlg:         TaxRescertifiedFlag;
    IncrExpAggAmt1LkElctrctyPrYrFlg?: string;
    IncrExpAggAmt2LkTrvFrgnCntryFlg?: string;
    ItrFilingDueDate:                 string;
    JurisdictionResPrevYr?:           JurisdictionResPrevYr;
    LEIDtls?:                         LEIDtls;
    /**
     * Enter date when the notice was issued to the assessee in YYYY-MM-DD format
     */
    NoticeDate?:        string;
    NoticeNo?:          string;
    OptOutNewTaxRegime: string;
    /**
     * Enter Date of filing of Original return in YYYY-MM-DD format
     */
    OrigRetFiledDate?: string;
    /**
     * Y - Yes; N - No
     */
    PortugeseCC5A?: TaxRescertifiedFlag;
    /**
     * Enter Acknowledgment No. of Original return
     */
    ReceiptNo?: string;
    /**
     * RES - Resident; NRI - Non Resident; NOR - Resident but not Ordinarily resident
     */
    ResidentialStatus: ResidentialStatus;
    /**
     * 11 - 139(1)-On or before due date; 12 - 139(4)-After due date; 13 - 142(1); 14 - 148;16 :
     * 153C; 17 - 139(5)-Revised Return; 18 - 139(9); 19 - 92CD-Modified return; 20 -
     * 119(2)(b)-after condonation of delay
     */
    ReturnFileSec: number;
    /**
     * if above field is selected as yes, provide SEBI Registration Number.
     */
    SebiRegnNo?:                string;
    SeventhProvisio139:         string;
    TotalPrStayIndia4PrecYr?:   number;
    TotalPrStayIndiaPrevYr?:    number;
    clauseiv7provisio139i?:     string;
    clauseiv7provisio139iDtls?: Clauseiv7Provisio139IType[];
}

/**
 * Y - Yes; N - No
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 *
 * Y-YES; N-NO
 *
 * Whether you are an FII/FPI?; Y - Yes; N - No
 */
export enum TaxRescertifiedFlag {
    N = "N",
    Y = "Y",
}

/**
 * Assessee representative
 */
export interface AssesseeRep {
    RepAadhaar?: string;
    RepAddress:  string;
    /**
     * L - Legal Heir; M - Manager; G - Guardian; O - Other
     */
    RepCapacity: RepCapacity;
    RepName:     string;
    RepPAN:      string;
}

/**
 * L - Legal Heir; M - Manager; G - Guardian; O - Other
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum RepCapacity {
    G = "G",
    L = "L",
    M = "M",
    O = "O",
}

export interface CompDirectorPrvYr {
    CompDirectorPrvYrDtls?: CompDirectorPrvYrDtls[];
}

export interface CompDirectorPrvYrDtls {
    /**
     * D - Domestic; F - Foreign
     */
    CompanyType:   CompanyType;
    DIN?:          string;
    NameOfCompany: string;
    PAN?:          string;
    /**
     * L - Listed; U - Unlisted
     */
    SharesTypes: SharesTypes;
}

/**
 * D - Domestic; F - Foreign
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum CompanyType {
    D = "D",
    F = "F",
}

/**
 * L - Listed; U - Unlisted
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum SharesTypes {
    L = "L",
    U = "U",
}

/**
 * 1 : You were in India for 182 days or more during the previous year [section 6(1)(a)]; 2
 * : You were in India for 60 days or more during the previous year, and have been in India
 * for 365 days or more within the 4 preceding years [section (6)(1)(c)] [where Explanation
 * 1 is not applicable]; 3 : You have been a non-resident in India in 9 out of 10 preceding
 * years [section 6(6)(a)]; 4 : You have been in India for 729 days or less during the 7
 * preceding years [section 6(6)(a)]; 5 : You were a non-resident during the previous year;
 * 6 : You are a citizen of India or person of Indian origin, who comes on a visit to India,
 * having total income, other than the income from foreign sources, exceeding Rs. 15 lakh
 * and have been in India for 120 days or more but less than 182 days during the previous
 * year [section 6(6)(c)]; 7 : You are a citizen of India having total income, other than
 * the income from foreign sources, exceeding Rs. 15 lakh during the previous year and not
 * liable to tax in any other country or territory by reason of your domicile or residence
 * or any other criteria of similar nature [section 6(6)(d) rws 6(1A)]; 8 : You are a
 * citizen of India, who left India, for the purpose of employment, as a member of the crew
 * of an Indian ship and were in India for 182 days or more during the previous year and 365
 * days or more within the preceding 4 years [Explanation 1(a) of section (6)(1)(c)]; 9 :
 * You are a citizen of India or a person of Indian origin and have come on a visit to India
 * during the previous year and were in India for a) 182 days or more during the previous
 * year and 365 days or more within the preceding 4 years; or b) 120 days or more during the
 * previous year and 365 days or more within the preceding 4 years if the total income,
 * other than income from foreign sources, exceeds Rs. 15 lakh. [Explanation 1(b) of section
 * (6)(1)(c)]
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum ConditionsResStatus {
    The1 = "1",
    The2 = "2",
    The3 = "3",
    The4 = "4",
    The5 = "5",
    The6 = "6",
    The7 = "7",
    The8 = "8",
    The9 = "9",
}

export interface HeldUnlistedEqShrPRYr {
    HeldUnlistedEqShrPrYrDtls?: HeldUnlistedEqShrPRYrDtls[];
}

export interface HeldUnlistedEqShrPRYrDtls {
    ClsngBalCostOfAcquisition: number;
    ClsngBalNumberOfShares:    number;
    /**
     * D - Domestic; F - Foreign
     */
    CompanyType: CompanyType;
    /**
     * Date in YYYY-MM-DD format
     */
    DateOfSubscrPurchase?:      string;
    FaceValuePerShare?:         number;
    IssuePricePerShare?:        number;
    NameOfCompany:              string;
    OpngBalCostOfAcquisition:   number;
    OpngBalNumberOfShares:      number;
    PAN?:                       string;
    PurchasePricePerShare?:     number;
    ShrAcqDurYrNumberOfShares?: number;
    ShrTrnfNumberOfShares?:     number;
    ShrTrnfSaleConsideration?:  number;
}

export interface JurisdictionResPrevYr {
    JurisdictionResPrevYrDtls?: JurisdictionResPrevYrDtls[];
}

export interface JurisdictionResPrevYrDtls {
    /**
     * 93:AFGHANISTAN; 1001:ÅLAND ISLANDS; 355:ALBANIA; 213:ALGERIA; 684:AMERICAN SAMOA;
     * 376:ANDORRA; 244:ANGOLA; 1264:ANGUILLA; 1010:ANTARCTICA; 1268:ANTIGUA AND BARBUDA;
     * 54:ARGENTINA; 374:ARMENIA; 297:ARUBA; 61:AUSTRALIA; 43:AUSTRIA; 994:AZERBAIJAN;
     * 1242:BAHAMAS; 973:BAHRAIN; 880:BANGLADESH; 1246:BARBADOS; 375:BELARUS; 32:BELGIUM;
     * 501:BELIZE; 229:BENIN; 1441:BERMUDA; 975:BHUTAN; 591:BOLIVIA (PLURINATIONAL STATE OF);
     * 1002:BONAIRE, SINT EUSTATIUS AND SABA; 387:BOSNIA AND HERZEGOVINA; 267:BOTSWANA;
     * 1003:BOUVET ISLAND; 55:BRAZIL; 1014:BRITISH INDIAN OCEAN TERRITORY; 673:BRUNEI
     * DARUSSALAM; 359:BULGARIA; 226: BURKINA FASO; 257:BURUNDI; 238:CABO VERDE; 855:CAMBODIA;
     * 237:CAMEROON; 1:CANADA; 1345:CAYMAN ISLANDS; 236:CENTRAL AFRICAN REPUBLIC; 235:CHAD;
     * 56:CHILE; 86:CHINA; 9:CHRISTMAS ISLAND; 672:COCOS (KEELING) ISLANDS; 57:COLOMBIA;
     * 270:COMOROS; 242:CONGO; 243:CONGO (DEMOCRATIC REPUBLIC OF THE); 682:COOK ISLANDS;
     * 506:COSTA RICA; 225:CÔTE D'IVOIRE; 385:CROATIA; 53:CUBA; 1015:CURAÇAO; 357:CYPRUS;
     * 420:CZECHIA; 45:DENMARK; 253:DJIBOUTI; 1767:DOMINICA; 1809:DOMINICAN REPUBLIC;
     * 593:ECUADOR; 20:EGYPT; 503:EL SALVADOR; 240:EQUATORIAL GUINEA; 291:ERITREA; 372:ESTONIA;
     * 251:ETHIOPIA; 500:FALKLAND ISLANDS (MALVINAS); 298:FAROE ISLANDS; 679:FIJI; 358:FINLAND;
     * 33:FRANCE; 594:FRENCH GUIANA; 689:FRENCH POLYNESIA; 1004:FRENCH SOUTHERN TERRITORIES;
     * 241:GABON; 220:GAMBIA; 995:GEORGIA; 49:GERMANY; 233:GHANA; 350:GIBRALTAR; 30:GREECE;
     * 299:GREENLAND; 1473:GRENADA; 590:GUADELOUPE; 1671:GUAM; 502:GUATEMALA; 1481:GUERNSEY;
     * 224:GUINEA; 245:GUINEA-BISSAU; 592:GUYANA; 509:HAITI; 1005:HEARD ISLAND AND MCDONALD
     * ISLANDS; 6:HOLY SEE; 504:HONDURAS; 852:HONG KONG; 36:HUNGARY; 354:ICELAND; 62:INDONESIA;
     * 98:IRAN (ISLAMIC REPUBLIC OF); 964:IRAQ; 353:IRELAND; 1624:ISLE OF MAN; 972:ISRAEL;
     * 5:ITALY; 1876:JAMAICA; 81:JAPAN; 1534:JERSEY; 962:JORDAN; 7:KAZAKHSTAN; 254:KENYA;
     * 686:KIRIBATI; 850:KOREA(DEMOCRATIC PEOPLE'S REPUBLIC OF); 82:KOREA (REPUBLIC OF);
     * 965:KUWAIT; 996:KYRGYZSTAN; 856:LAO PEOPLE'S DEMOCRATIC REPUBLIC; 371:LATVIA;
     * 961:LEBANON; 266:LESOTHO; 231:LIBERIA; 218:LIBYA; 423:LIECHTENSTEIN; 370:LITHUANIA;
     * 352:LUXEMBOURG; 853:MACAO; 389:MACEDONIA(THE FORMER YUGOSLAV REPUBLIC OF);
     * 261:MADAGASCAR; 256:MALAWI; 60:MALAYSIA; 960:MALDIVES; 223:MALI; 356:MALTA; 692:MARSHALL
     * ISLANDS; 596:MARTINIQUE; 222:MAURITANIA; 230:MAURITIUS; 269:MAYOTTE; 52:MEXICO;
     * 691:MICRONESIA (FEDERATED STATES OF); 373:MOLDOVA (REPUBLIC OF); 377:MONACO;
     * 976:MONGOLIA; 382:MONTENEGRO; 1664:MONTSERRAT; 212:MOROCCO; 258:MOZAMBIQUE; 95:MYANMAR;
     * 264:NAMIBIA; 674:NAURU; 977:NEPAL; 31:NETHERLANDS; 687:NEW CALEDONIA; 64:NEW ZEALAND;
     * 505:NICARAGUA; 227:NIGER; 234:NIGERIA; 683:NIUE; 15:NORFOLK ISLAND; 1670:NORTHERN MARIANA
     * ISLANDS; 47:NORWAY; 968:OMAN; 92:PAKISTAN; 680:PALAU; 970:PALESTINE, STATE OF;
     * 507:PANAMA; 675:PAPUA NEW GUINEA; 595:PARAGUAY; 51:PERU; 63:PHILIPPINES; 1011:PITCAIRN;
     * 48:POLAND; 14:PORTUGAL; 1787:PUERTO RICO; 974:QATAR; 262:RÉUNION; 40:ROMANIA; 8:RUSSIAN
     * FEDERATION; 250:RWANDA; 1006:SAINT BARTHÉLEMY; 290: SAINT HELENA, ASCENSION AND TRISTAN
     * DA CUNHA; 1869:SAINT KITTS AND NEVIS; 1758:SAINT LUCIA; 1007:SAINT MARTIN (FRENCH PART);
     * 508:SAINT PIERRE AND MIQUELON; 1784:SAINT VINCENT AND THE GRENADINES; 685:SAMOA; 378:SAN
     * MARINO; 239:SAO TOME AND PRINCIPE; 966:SAUDI ARABIA; 221:SENEGAL; 381:SERBIA;
     * 248:SEYCHELLES; 232:SIERRA LEONE; 65:SINGAPORE; 1721:SINT MAARTEN (DUTCH PART);
     * 421:SLOVAKIA; 386:SLOVENIA; 677:SOLOMON ISLANDS; 252:SOMALIA; 28:SOUTH AFRICA; 1008:SOUTH
     * GEORGIA AND THE SOUTH SANDWICH ISLANDS; 211:SOUTH SUDAN; 35:SPAIN; 94:SRI LANKA;
     * 249:SUDAN; 597:SURINAME; 1012:SVALBARD AND JAN MAYEN; 268:SWAZILAND; 46:SWEDEN;
     * 41:SWITZERLAND; 963:SYRIAN ARAB REPUBLIC; 886:TAIWAN; 992:TAJIKISTAN; 255:TANZANIA,
     * UNITED REPUBLIC OF; 66:THAILAND; 670:TIMOR-LESTE (EAST TIMOR); 228:TOGO; 690:TOKELAU;
     * 676:TONGA; 1868:TRINIDAD AND TOBAGO; 216:TUNISIA; 90:TURKEY; 993:TURKMENISTAN; 1649:TURKS
     * AND CAICOS ISLANDS; 688:TUVALU; 256:UGANDA; 380:UKRAINE; 971:UNITED ARAB EMIRATES;
     * 44:UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND; 2:UNITED STATES OF AMERICA;
     * 1009:UNITED STATES MINOR OUTLYING ISLANDS; 598:URUGUAY; 998:UZBEKISTAN; 678:VANUATU;
     * 58:VENEZUELA (BOLIVARIAN REPUBLIC OF); 84:VIET NAM; 1284:VIRGIN ISLANDS (BRITISH);
     * 1340:VIRGIN ISLANDS (U.S.); 681:WALLIS AND FUTUNA; 1013:WESTERN SAHARA; 967:YEMEN;
     * 260:ZAMBIA; 263:ZIMBABWE; 9999:OTHERS; 9998:Not Applicable (Not Resident in any Country)
     */
    JurisdictionResidence: JurisdictionResidence;
    TIN:                   string;
}

/**
 * 93:AFGHANISTAN; 1001:ÅLAND ISLANDS; 355:ALBANIA; 213:ALGERIA; 684:AMERICAN SAMOA;
 * 376:ANDORRA; 244:ANGOLA; 1264:ANGUILLA; 1010:ANTARCTICA; 1268:ANTIGUA AND BARBUDA;
 * 54:ARGENTINA; 374:ARMENIA; 297:ARUBA; 61:AUSTRALIA; 43:AUSTRIA; 994:AZERBAIJAN;
 * 1242:BAHAMAS; 973:BAHRAIN; 880:BANGLADESH; 1246:BARBADOS; 375:BELARUS; 32:BELGIUM;
 * 501:BELIZE; 229:BENIN; 1441:BERMUDA; 975:BHUTAN; 591:BOLIVIA (PLURINATIONAL STATE OF);
 * 1002:BONAIRE, SINT EUSTATIUS AND SABA; 387:BOSNIA AND HERZEGOVINA; 267:BOTSWANA;
 * 1003:BOUVET ISLAND; 55:BRAZIL; 1014:BRITISH INDIAN OCEAN TERRITORY; 673:BRUNEI
 * DARUSSALAM; 359:BULGARIA; 226: BURKINA FASO; 257:BURUNDI; 238:CABO VERDE; 855:CAMBODIA;
 * 237:CAMEROON; 1:CANADA; 1345:CAYMAN ISLANDS; 236:CENTRAL AFRICAN REPUBLIC; 235:CHAD;
 * 56:CHILE; 86:CHINA; 9:CHRISTMAS ISLAND; 672:COCOS (KEELING) ISLANDS; 57:COLOMBIA;
 * 270:COMOROS; 242:CONGO; 243:CONGO (DEMOCRATIC REPUBLIC OF THE); 682:COOK ISLANDS;
 * 506:COSTA RICA; 225:CÔTE D'IVOIRE; 385:CROATIA; 53:CUBA; 1015:CURAÇAO; 357:CYPRUS;
 * 420:CZECHIA; 45:DENMARK; 253:DJIBOUTI; 1767:DOMINICA; 1809:DOMINICAN REPUBLIC;
 * 593:ECUADOR; 20:EGYPT; 503:EL SALVADOR; 240:EQUATORIAL GUINEA; 291:ERITREA; 372:ESTONIA;
 * 251:ETHIOPIA; 500:FALKLAND ISLANDS (MALVINAS); 298:FAROE ISLANDS; 679:FIJI; 358:FINLAND;
 * 33:FRANCE; 594:FRENCH GUIANA; 689:FRENCH POLYNESIA; 1004:FRENCH SOUTHERN TERRITORIES;
 * 241:GABON; 220:GAMBIA; 995:GEORGIA; 49:GERMANY; 233:GHANA; 350:GIBRALTAR; 30:GREECE;
 * 299:GREENLAND; 1473:GRENADA; 590:GUADELOUPE; 1671:GUAM; 502:GUATEMALA; 1481:GUERNSEY;
 * 224:GUINEA; 245:GUINEA-BISSAU; 592:GUYANA; 509:HAITI; 1005:HEARD ISLAND AND MCDONALD
 * ISLANDS; 6:HOLY SEE; 504:HONDURAS; 852:HONG KONG; 36:HUNGARY; 354:ICELAND; 62:INDONESIA;
 * 98:IRAN (ISLAMIC REPUBLIC OF); 964:IRAQ; 353:IRELAND; 1624:ISLE OF MAN; 972:ISRAEL;
 * 5:ITALY; 1876:JAMAICA; 81:JAPAN; 1534:JERSEY; 962:JORDAN; 7:KAZAKHSTAN; 254:KENYA;
 * 686:KIRIBATI; 850:KOREA(DEMOCRATIC PEOPLE'S REPUBLIC OF); 82:KOREA (REPUBLIC OF);
 * 965:KUWAIT; 996:KYRGYZSTAN; 856:LAO PEOPLE'S DEMOCRATIC REPUBLIC; 371:LATVIA;
 * 961:LEBANON; 266:LESOTHO; 231:LIBERIA; 218:LIBYA; 423:LIECHTENSTEIN; 370:LITHUANIA;
 * 352:LUXEMBOURG; 853:MACAO; 389:MACEDONIA(THE FORMER YUGOSLAV REPUBLIC OF);
 * 261:MADAGASCAR; 256:MALAWI; 60:MALAYSIA; 960:MALDIVES; 223:MALI; 356:MALTA; 692:MARSHALL
 * ISLANDS; 596:MARTINIQUE; 222:MAURITANIA; 230:MAURITIUS; 269:MAYOTTE; 52:MEXICO;
 * 691:MICRONESIA (FEDERATED STATES OF); 373:MOLDOVA (REPUBLIC OF); 377:MONACO;
 * 976:MONGOLIA; 382:MONTENEGRO; 1664:MONTSERRAT; 212:MOROCCO; 258:MOZAMBIQUE; 95:MYANMAR;
 * 264:NAMIBIA; 674:NAURU; 977:NEPAL; 31:NETHERLANDS; 687:NEW CALEDONIA; 64:NEW ZEALAND;
 * 505:NICARAGUA; 227:NIGER; 234:NIGERIA; 683:NIUE; 15:NORFOLK ISLAND; 1670:NORTHERN MARIANA
 * ISLANDS; 47:NORWAY; 968:OMAN; 92:PAKISTAN; 680:PALAU; 970:PALESTINE, STATE OF;
 * 507:PANAMA; 675:PAPUA NEW GUINEA; 595:PARAGUAY; 51:PERU; 63:PHILIPPINES; 1011:PITCAIRN;
 * 48:POLAND; 14:PORTUGAL; 1787:PUERTO RICO; 974:QATAR; 262:RÉUNION; 40:ROMANIA; 8:RUSSIAN
 * FEDERATION; 250:RWANDA; 1006:SAINT BARTHÉLEMY; 290: SAINT HELENA, ASCENSION AND TRISTAN
 * DA CUNHA; 1869:SAINT KITTS AND NEVIS; 1758:SAINT LUCIA; 1007:SAINT MARTIN (FRENCH PART);
 * 508:SAINT PIERRE AND MIQUELON; 1784:SAINT VINCENT AND THE GRENADINES; 685:SAMOA; 378:SAN
 * MARINO; 239:SAO TOME AND PRINCIPE; 966:SAUDI ARABIA; 221:SENEGAL; 381:SERBIA;
 * 248:SEYCHELLES; 232:SIERRA LEONE; 65:SINGAPORE; 1721:SINT MAARTEN (DUTCH PART);
 * 421:SLOVAKIA; 386:SLOVENIA; 677:SOLOMON ISLANDS; 252:SOMALIA; 28:SOUTH AFRICA; 1008:SOUTH
 * GEORGIA AND THE SOUTH SANDWICH ISLANDS; 211:SOUTH SUDAN; 35:SPAIN; 94:SRI LANKA;
 * 249:SUDAN; 597:SURINAME; 1012:SVALBARD AND JAN MAYEN; 268:SWAZILAND; 46:SWEDEN;
 * 41:SWITZERLAND; 963:SYRIAN ARAB REPUBLIC; 886:TAIWAN; 992:TAJIKISTAN; 255:TANZANIA,
 * UNITED REPUBLIC OF; 66:THAILAND; 670:TIMOR-LESTE (EAST TIMOR); 228:TOGO; 690:TOKELAU;
 * 676:TONGA; 1868:TRINIDAD AND TOBAGO; 216:TUNISIA; 90:TURKEY; 993:TURKMENISTAN; 1649:TURKS
 * AND CAICOS ISLANDS; 688:TUVALU; 256:UGANDA; 380:UKRAINE; 971:UNITED ARAB EMIRATES;
 * 44:UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND; 2:UNITED STATES OF AMERICA;
 * 1009:UNITED STATES MINOR OUTLYING ISLANDS; 598:URUGUAY; 998:UZBEKISTAN; 678:VANUATU;
 * 58:VENEZUELA (BOLIVARIAN REPUBLIC OF); 84:VIET NAM; 1284:VIRGIN ISLANDS (BRITISH);
 * 1340:VIRGIN ISLANDS (U.S.); 681:WALLIS AND FUTUNA; 1013:WESTERN SAHARA; 967:YEMEN;
 * 260:ZAMBIA; 263:ZIMBABWE; 9999:OTHERS; 9998:Not Applicable (Not Resident in any Country)
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum JurisdictionResidence {
    The1 = "1",
    The1001 = "1001",
    The1002 = "1002",
    The1003 = "1003",
    The1004 = "1004",
    The1005 = "1005",
    The1006 = "1006",
    The1007 = "1007",
    The1008 = "1008",
    The1009 = "1009",
    The1010 = "1010",
    The1011 = "1011",
    The1012 = "1012",
    The1013 = "1013",
    The1014 = "1014",
    The1015 = "1015",
    The1242 = "1242",
    The1246 = "1246",
    The1264 = "1264",
    The1268 = "1268",
    The1284 = "1284",
    The1340 = "1340",
    The1345 = "1345",
    The14 = "14",
    The1441 = "1441",
    The1473 = "1473",
    The1481 = "1481",
    The15 = "15",
    The1534 = "1534",
    The1624 = "1624",
    The1649 = "1649",
    The1664 = "1664",
    The1670 = "1670",
    The1671 = "1671",
    The1721 = "1721",
    The1758 = "1758",
    The1767 = "1767",
    The1784 = "1784",
    The1787 = "1787",
    The1809 = "1809",
    The1868 = "1868",
    The1869 = "1869",
    The1876 = "1876",
    The2 = "2",
    The20 = "20",
    The211 = "211",
    The212 = "212",
    The213 = "213",
    The216 = "216",
    The218 = "218",
    The220 = "220",
    The221 = "221",
    The222 = "222",
    The223 = "223",
    The224 = "224",
    The225 = "225",
    The226 = "226",
    The227 = "227",
    The228 = "228",
    The229 = "229",
    The230 = "230",
    The231 = "231",
    The232 = "232",
    The233 = "233",
    The234 = "234",
    The235 = "235",
    The236 = "236",
    The237 = "237",
    The238 = "238",
    The239 = "239",
    The240 = "240",
    The241 = "241",
    The242 = "242",
    The243 = "243",
    The244 = "244",
    The245 = "245",
    The248 = "248",
    The249 = "249",
    The250 = "250",
    The251 = "251",
    The252 = "252",
    The253 = "253",
    The254 = "254",
    The255 = "255",
    The256 = "256",
    The257 = "257",
    The258 = "258",
    The260 = "260",
    The261 = "261",
    The262 = "262",
    The263 = "263",
    The264 = "264",
    The265 = "265",
    The266 = "266",
    The267 = "267",
    The268 = "268",
    The269 = "269",
    The270 = "270",
    The28 = "28",
    The290 = "290",
    The291 = "291",
    The297 = "297",
    The298 = "298",
    The299 = "299",
    The30 = "30",
    The31 = "31",
    The32 = "32",
    The33 = "33",
    The35 = "35",
    The350 = "350",
    The352 = "352",
    The353 = "353",
    The354 = "354",
    The355 = "355",
    The356 = "356",
    The357 = "357",
    The358 = "358",
    The359 = "359",
    The36 = "36",
    The370 = "370",
    The371 = "371",
    The372 = "372",
    The373 = "373",
    The374 = "374",
    The375 = "375",
    The376 = "376",
    The377 = "377",
    The378 = "378",
    The380 = "380",
    The381 = "381",
    The382 = "382",
    The385 = "385",
    The386 = "386",
    The387 = "387",
    The389 = "389",
    The40 = "40",
    The41 = "41",
    The420 = "420",
    The421 = "421",
    The423 = "423",
    The43 = "43",
    The44 = "44",
    The45 = "45",
    The46 = "46",
    The47 = "47",
    The48 = "48",
    The49 = "49",
    The5 = "5",
    The500 = "500",
    The501 = "501",
    The502 = "502",
    The503 = "503",
    The504 = "504",
    The505 = "505",
    The506 = "506",
    The507 = "507",
    The508 = "508",
    The509 = "509",
    The51 = "51",
    The52 = "52",
    The53 = "53",
    The54 = "54",
    The55 = "55",
    The56 = "56",
    The57 = "57",
    The58 = "58",
    The590 = "590",
    The591 = "591",
    The592 = "592",
    The593 = "593",
    The594 = "594",
    The595 = "595",
    The596 = "596",
    The597 = "597",
    The598 = "598",
    The6 = "6",
    The60 = "60",
    The61 = "61",
    The62 = "62",
    The63 = "63",
    The64 = "64",
    The65 = "65",
    The66 = "66",
    The670 = "670",
    The672 = "672",
    The673 = "673",
    The674 = "674",
    The675 = "675",
    The676 = "676",
    The677 = "677",
    The678 = "678",
    The679 = "679",
    The680 = "680",
    The681 = "681",
    The682 = "682",
    The683 = "683",
    The684 = "684",
    The685 = "685",
    The686 = "686",
    The687 = "687",
    The688 = "688",
    The689 = "689",
    The690 = "690",
    The691 = "691",
    The692 = "692",
    The7 = "7",
    The8 = "8",
    The81 = "81",
    The82 = "82",
    The84 = "84",
    The850 = "850",
    The852 = "852",
    The853 = "853",
    The855 = "855",
    The856 = "856",
    The86 = "86",
    The880 = "880",
    The886 = "886",
    The9 = "9",
    The90 = "90",
    The92 = "92",
    The93 = "93",
    The94 = "94",
    The95 = "95",
    The960 = "960",
    The961 = "961",
    The962 = "962",
    The963 = "963",
    The964 = "964",
    The965 = "965",
    The966 = "966",
    The967 = "967",
    The968 = "968",
    The970 = "970",
    The971 = "971",
    The972 = "972",
    The973 = "973",
    The974 = "974",
    The975 = "975",
    The976 = "976",
    The977 = "977",
    The98 = "98",
    The992 = "992",
    The993 = "993",
    The994 = "994",
    The995 = "995",
    The996 = "996",
    The998 = "998",
    The9998 = "9998",
    The9999 = "9999",
}

export interface LEIDtls {
    LEINumber?: string;
    /**
     * Date in YYYY-MM-DD format
     */
    ValidUptoDate?: string;
}

/**
 * RES - Resident; NRI - Non Resident; NOR - Resident but not Ordinarily resident
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum ResidentialStatus {
    Nor = "NOR",
    Nri = "NRI",
    Res = "RES",
}

export interface Clauseiv7Provisio139IType {
    clauseiv7provisio139iAmount: number;
    /**
     * 1 - the aggregate of tax deducted at source and tax collected at source during the
     * previous year, in the case of the person, is twenty-five thousand rupees (fifty-thousand
     * for resident senior citizen) or more; 2 - The deposit in one or more savings bank account
     * of the person, in aggregate, is fifty lakh rupees or more, in the previous year
     */
    clauseiv7provisio139iNature: NatureOfDisability;
}

/**
 * 1 - the aggregate of tax deducted at source and tax collected at source during the
 * previous year, in the case of the person, is twenty-five thousand rupees (fifty-thousand
 * for resident senior citizen) or more; 2 - The deposit in one or more savings bank account
 * of the person, in aggregate, is fifty lakh rupees or more, in the previous year
 *
 * 1 : Dependent person with disability  ; 2 : Dependent person with severe disability
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 *
 * 1 - Self ; 2 - Spouse or Other Person
 *
 * 1 : Self or dependent; 2 : Self or Dependent (Senior Citizen)
 */
export enum NatureOfDisability {
    The1 = "1",
    The2 = "2",
}

/**
 * Enter personal information
 */
export interface PersonalInfo {
    AadhaarCardNo?:      string;
    AadhaarEnrolmentId?: string;
    Address:             Address;
    AssesseeName:        AssesseeName;
    /**
     * Date of birth of Assessee - On or before 2023-03-31
     */
    DOB: string;
    PAN: string;
    /**
     * I - Individual; H - HUF
     */
    Status: Status;
}

export interface Address {
    CityOrTownOrDistrict:    string;
    CountryCode:             CountryCode;
    CountryCodeMobile:       number;
    CountryCodeMobileNoSec?: number;
    EmailAddress:            string;
    EmailAddressSec?:        string;
    LocalityOrArea:          string;
    MobileNo:                number;
    MobileNoSec?:            number;
    Phone?:                  Phone;
    PinCode?:                number;
    ResidenceName?:          string;
    ResidenceNo:             string;
    RoadOrStreet?:           string;
    StateCode:               StateCode;
    ZipCode?:                string;
}

/**
 * 93:AFGHANISTAN; 1001:ÅLAND ISLANDS; 355:ALBANIA; 213:ALGERIA; 684:AMERICAN SAMOA;
 * 376:ANDORRA; 244:ANGOLA; 1264:ANGUILLA; 1010:ANTARCTICA; 1268:ANTIGUA AND BARBUDA;
 * 54:ARGENTINA; 374:ARMENIA; 297:ARUBA; 61:AUSTRALIA; 43:AUSTRIA; 994:AZERBAIJAN;
 * 1242:BAHAMAS; 973:BAHRAIN; 880:BANGLADESH; 1246:BARBADOS; 375:BELARUS; 32:BELGIUM;
 * 501:BELIZE; 229:BENIN; 1441:BERMUDA; 975:BHUTAN; 591:BOLIVIA (PLURINATIONAL STATE OF);
 * 1002:BONAIRE, SINT EUSTATIUS AND SABA; 387:BOSNIA AND HERZEGOVINA; 267:BOTSWANA;
 * 1003:BOUVET ISLAND; 55:BRAZIL; 1014:BRITISH INDIAN OCEAN TERRITORY; 673:BRUNEI
 * DARUSSALAM; 359:BULGARIA; 226: BURKINA FASO; 257:BURUNDI; 238:CABO VERDE; 855:CAMBODIA;
 * 237:CAMEROON; 1:CANADA; 1345:CAYMAN ISLANDS; 236:CENTRAL AFRICAN REPUBLIC; 235:CHAD;
 * 56:CHILE; 86:CHINA; 9:CHRISTMAS ISLAND; 672:COCOS (KEELING) ISLANDS; 57:COLOMBIA;
 * 270:COMOROS; 242:CONGO; 243:CONGO (DEMOCRATIC REPUBLIC OF THE); 682:COOK ISLANDS;
 * 506:COSTA RICA; 225:CÔTE D'IVOIRE; 385:CROATIA; 53:CUBA; 1015:CURAÇAO; 357:CYPRUS;
 * 420:CZECHIA; 45:DENMARK; 253:DJIBOUTI; 1767:DOMINICA; 1809:DOMINICAN REPUBLIC;
 * 593:ECUADOR; 20:EGYPT; 503:EL SALVADOR; 240:EQUATORIAL GUINEA; 291:ERITREA; 372:ESTONIA;
 * 251:ETHIOPIA; 500:FALKLAND ISLANDS (MALVINAS); 298:FAROE ISLANDS; 679:FIJI; 358:FINLAND;
 * 33:FRANCE; 594:FRENCH GUIANA; 689:FRENCH POLYNESIA; 1004:FRENCH SOUTHERN TERRITORIES;
 * 241:GABON; 220:GAMBIA; 995:GEORGIA; 49:GERMANY; 233:GHANA; 350:GIBRALTAR; 30:GREECE;
 * 299:GREENLAND; 1473:GRENADA; 590:GUADELOUPE; 1671:GUAM; 502:GUATEMALA; 1481:GUERNSEY;
 * 224:GUINEA; 245:GUINEA-BISSAU; 592:GUYANA; 509:HAITI; 1005:HEARD ISLAND AND MCDONALD
 * ISLANDS; 6:HOLY SEE; 504:HONDURAS; 852:HONG KONG; 36:HUNGARY; 354:ICELAND; 91:INDIA;
 * 62:INDONESIA; 98:IRAN (ISLAMIC REPUBLIC OF); 964:IRAQ; 353:IRELAND; 1624:ISLE OF MAN;
 * 972:ISRAEL; 5:ITALY; 1876:JAMAICA; 81:JAPAN; 1534:JERSEY; 962:JORDAN; 7:KAZAKHSTAN;
 * 254:KENYA; 686:KIRIBATI; 850:KOREA(DEMOCRATIC PEOPLE'S REPUBLIC OF); 82:KOREA (REPUBLIC
 * OF); 965:KUWAIT; 996:KYRGYZSTAN; 856:LAO PEOPLE'S DEMOCRATIC REPUBLIC; 371:LATVIA;
 * 961:LEBANON; 266:LESOTHO; 231:LIBERIA; 218:LIBYA; 423:LIECHTENSTEIN; 370:LITHUANIA;
 * 352:LUXEMBOURG; 853:MACAO; 389:MACEDONIA(THE FORMER YUGOSLAV REPUBLIC OF);
 * 261:MADAGASCAR; 256:MALAWI; 60:MALAYSIA; 960:MALDIVES; 223:MALI; 356:MALTA; 692:MARSHALL
 * ISLANDS; 596:MARTINIQUE; 222:MAURITANIA; 230:MAURITIUS; 269:MAYOTTE; 52:MEXICO;
 * 691:MICRONESIA (FEDERATED STATES OF); 373:MOLDOVA (REPUBLIC OF); 377:MONACO;
 * 976:MONGOLIA; 382:MONTENEGRO; 1664:MONTSERRAT; 212:MOROCCO; 258:MOZAMBIQUE; 95:MYANMAR;
 * 264:NAMIBIA; 674:NAURU; 977:NEPAL; 31:NETHERLANDS; 687:NEW CALEDONIA; 64:NEW ZEALAND;
 * 505:NICARAGUA; 227:NIGER; 234:NIGERIA; 683:NIUE; 15:NORFOLK ISLAND; 1670:NORTHERN MARIANA
 * ISLANDS; 47:NORWAY; 968:OMAN; 92:PAKISTAN; 680:PALAU; 970:PALESTINE, STATE OF;
 * 507:PANAMA; 675:PAPUA NEW GUINEA; 595:PARAGUAY; 51:PERU; 63:PHILIPPINES; 1011:PITCAIRN;
 * 48:POLAND; 14:PORTUGAL; 1787:PUERTO RICO; 974:QATAR; 262:RÉUNION; 40:ROMANIA; 8:RUSSIAN
 * FEDERATION; 250:RWANDA; 1006:SAINT BARTHÉLEMY; 290: SAINT HELENA, ASCENSION AND TRISTAN
 * DA CUNHA; 1869:SAINT KITTS AND NEVIS; 1758:SAINT LUCIA; 1007:SAINT MARTIN (FRENCH PART);
 * 508:SAINT PIERRE AND MIQUELON; 1784:SAINT VINCENT AND THE GRENADINES; 685:SAMOA; 378:SAN
 * MARINO; 239:SAO TOME AND PRINCIPE; 966:SAUDI ARABIA; 221:SENEGAL; 381:SERBIA;
 * 248:SEYCHELLES; 232:SIERRA LEONE; 65:SINGAPORE; 1721:SINT MAARTEN (DUTCH PART);
 * 421:SLOVAKIA; 386:SLOVENIA; 677:SOLOMON ISLANDS; 252:SOMALIA; 28:SOUTH AFRICA; 1008:SOUTH
 * GEORGIA AND THE SOUTH SANDWICH ISLANDS; 211:SOUTH SUDAN; 35:SPAIN; 94:SRI LANKA;
 * 249:SUDAN; 597:SURINAME; 1012:SVALBARD AND JAN MAYEN; 268:SWAZILAND; 46:SWEDEN;
 * 41:SWITZERLAND; 963:SYRIAN ARAB REPUBLIC; 886:TAIWAN; 992:TAJIKISTAN; 255:TANZANIA,
 * UNITED REPUBLIC OF; 66:THAILAND; 670:TIMOR-LESTE (EAST TIMOR); 228:TOGO; 690:TOKELAU;
 * 676:TONGA; 1868:TRINIDAD AND TOBAGO; 216:TUNISIA; 90:TURKEY; 993:TURKMENISTAN; 1649:TURKS
 * AND CAICOS ISLANDS; 688:TUVALU; 256:UGANDA; 380:UKRAINE; 971:UNITED ARAB EMIRATES;
 * 44:UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND; 2:UNITED STATES OF AMERICA;
 * 1009:UNITED STATES MINOR OUTLYING ISLANDS; 598:URUGUAY; 998:UZBEKISTAN; 678:VANUATU;
 * 58:VENEZUELA (BOLIVARIAN REPUBLIC OF); 84:VIET NAM; 1284:VIRGIN ISLANDS (BRITISH);
 * 1340:VIRGIN ISLANDS (U.S.); 681:WALLIS AND FUTUNA; 1013:WESTERN SAHARA; 967:YEMEN;
 * 260:ZAMBIA; 263:ZIMBABWE; 9999:OTHERS
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum CountryCode {
    The1 = "1",
    The1001 = "1001",
    The1002 = "1002",
    The1003 = "1003",
    The1004 = "1004",
    The1005 = "1005",
    The1006 = "1006",
    The1007 = "1007",
    The1008 = "1008",
    The1009 = "1009",
    The1010 = "1010",
    The1011 = "1011",
    The1012 = "1012",
    The1013 = "1013",
    The1014 = "1014",
    The1015 = "1015",
    The1242 = "1242",
    The1246 = "1246",
    The1264 = "1264",
    The1268 = "1268",
    The1284 = "1284",
    The1340 = "1340",
    The1345 = "1345",
    The14 = "14",
    The1441 = "1441",
    The1473 = "1473",
    The1481 = "1481",
    The15 = "15",
    The1534 = "1534",
    The1624 = "1624",
    The1649 = "1649",
    The1664 = "1664",
    The1670 = "1670",
    The1671 = "1671",
    The1721 = "1721",
    The1758 = "1758",
    The1767 = "1767",
    The1784 = "1784",
    The1787 = "1787",
    The1809 = "1809",
    The1868 = "1868",
    The1869 = "1869",
    The1876 = "1876",
    The2 = "2",
    The20 = "20",
    The211 = "211",
    The212 = "212",
    The213 = "213",
    The216 = "216",
    The218 = "218",
    The220 = "220",
    The221 = "221",
    The222 = "222",
    The223 = "223",
    The224 = "224",
    The225 = "225",
    The226 = "226",
    The227 = "227",
    The228 = "228",
    The229 = "229",
    The230 = "230",
    The231 = "231",
    The232 = "232",
    The233 = "233",
    The234 = "234",
    The235 = "235",
    The236 = "236",
    The237 = "237",
    The238 = "238",
    The239 = "239",
    The240 = "240",
    The241 = "241",
    The242 = "242",
    The243 = "243",
    The244 = "244",
    The245 = "245",
    The248 = "248",
    The249 = "249",
    The250 = "250",
    The251 = "251",
    The252 = "252",
    The253 = "253",
    The254 = "254",
    The255 = "255",
    The256 = "256",
    The257 = "257",
    The258 = "258",
    The260 = "260",
    The261 = "261",
    The262 = "262",
    The263 = "263",
    The264 = "264",
    The265 = "265",
    The266 = "266",
    The267 = "267",
    The268 = "268",
    The269 = "269",
    The270 = "270",
    The28 = "28",
    The290 = "290",
    The291 = "291",
    The297 = "297",
    The298 = "298",
    The299 = "299",
    The30 = "30",
    The31 = "31",
    The32 = "32",
    The33 = "33",
    The35 = "35",
    The350 = "350",
    The352 = "352",
    The353 = "353",
    The354 = "354",
    The355 = "355",
    The356 = "356",
    The357 = "357",
    The358 = "358",
    The359 = "359",
    The36 = "36",
    The370 = "370",
    The371 = "371",
    The372 = "372",
    The373 = "373",
    The374 = "374",
    The375 = "375",
    The376 = "376",
    The377 = "377",
    The378 = "378",
    The380 = "380",
    The381 = "381",
    The382 = "382",
    The385 = "385",
    The386 = "386",
    The387 = "387",
    The389 = "389",
    The40 = "40",
    The41 = "41",
    The420 = "420",
    The421 = "421",
    The423 = "423",
    The43 = "43",
    The44 = "44",
    The45 = "45",
    The46 = "46",
    The47 = "47",
    The48 = "48",
    The49 = "49",
    The5 = "5",
    The500 = "500",
    The501 = "501",
    The502 = "502",
    The503 = "503",
    The504 = "504",
    The505 = "505",
    The506 = "506",
    The507 = "507",
    The508 = "508",
    The509 = "509",
    The51 = "51",
    The52 = "52",
    The53 = "53",
    The54 = "54",
    The55 = "55",
    The56 = "56",
    The57 = "57",
    The58 = "58",
    The590 = "590",
    The591 = "591",
    The592 = "592",
    The593 = "593",
    The594 = "594",
    The595 = "595",
    The596 = "596",
    The597 = "597",
    The598 = "598",
    The6 = "6",
    The60 = "60",
    The61 = "61",
    The62 = "62",
    The63 = "63",
    The64 = "64",
    The65 = "65",
    The66 = "66",
    The670 = "670",
    The672 = "672",
    The673 = "673",
    The674 = "674",
    The675 = "675",
    The676 = "676",
    The677 = "677",
    The678 = "678",
    The679 = "679",
    The680 = "680",
    The681 = "681",
    The682 = "682",
    The683 = "683",
    The684 = "684",
    The685 = "685",
    The686 = "686",
    The687 = "687",
    The688 = "688",
    The689 = "689",
    The690 = "690",
    The691 = "691",
    The692 = "692",
    The7 = "7",
    The8 = "8",
    The81 = "81",
    The82 = "82",
    The84 = "84",
    The850 = "850",
    The852 = "852",
    The853 = "853",
    The855 = "855",
    The856 = "856",
    The86 = "86",
    The880 = "880",
    The886 = "886",
    The9 = "9",
    The90 = "90",
    The91 = "91",
    The92 = "92",
    The93 = "93",
    The94 = "94",
    The95 = "95",
    The960 = "960",
    The961 = "961",
    The962 = "962",
    The963 = "963",
    The964 = "964",
    The965 = "965",
    The966 = "966",
    The967 = "967",
    The968 = "968",
    The970 = "970",
    The971 = "971",
    The972 = "972",
    The973 = "973",
    The974 = "974",
    The975 = "975",
    The976 = "976",
    The977 = "977",
    The98 = "98",
    The992 = "992",
    The993 = "993",
    The994 = "994",
    The995 = "995",
    The996 = "996",
    The998 = "998",
    The9999 = "9999",
}

export interface Phone {
    PhoneNo: string;
    STDcode: number;
}

/**
 * 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
 * 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
 * 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
 * Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21-meghalaya;
 * 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
 * Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
 * 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh; 99- Foreign
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 *
 * 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
 * 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
 * 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
 * Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21- Meghalaya;
 * 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
 * Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
 * 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh; 99- State outside India
 */
export enum StateCode {
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
 * Assessee name with Surname mandatory
 */
export interface AssesseeName {
    FirstName?:  string;
    MiddleName?: string;
    /**
     * Enter Last or Sur name for Individual or HUF name here
     */
    SurNameOrOrgName: string;
}

/**
 * I - Individual; H - HUF
 */
export enum Status {
    H = "H",
    I = "I",
}

/**
 * Computation of Total Income
 */
export interface PartBTI {
    AggregateIncome: number;
    /**
     * Balance after set-off current year losses
     */
    BalanceAfterSetoffLosses: number;
    /**
     * Brought forward losses set off from BFLA
     */
    BroughtFwdLossesSetoff: number;
    CapGain:                CapGain;
    /**
     * Losses of current year set off from CYLA
     */
    CurrentYearLoss: number;
    /**
     * From Schedule VIA
     */
    DeductionsUnderScheduleVIA: number;
    DeemedIncomeUs115JC:        number;
    /**
     * Gross Total income
     */
    GrossTotalIncome:           number;
    IncChargeTaxSplRate111A112: number;
    /**
     * From total of (i) of schedule SI
     */
    IncChargeableTaxSplRates: number;
    IncFromOS:                IncFromOS;
    /**
     * Income from house property
     */
    IncomeFromHP: number;
    /**
     * Losses of current year to be carried forward from CFL
     */
    LossesOfCurrentYearCarriedFwd: number;
    /**
     * From Schedule EI
     */
    NetAgricultureIncomeOrOtherIncomeForRate: number;
    /**
     * Income from Salary
     */
    Salaries:    number;
    TotalIncome: number;
    TotalTI:     number;
}

/**
 * capital gains
 */
export interface CapGain {
    CapGains30Per115BBH:    number;
    LongTerm:               LongTerm;
    ShortTerm:              ShortTerm;
    ShortTermLongTermTotal: number;
    TotalCapGains:          number;
}

/**
 * Long term gains
 */
export interface LongTerm {
    LongTerm10Per:       number;
    LongTerm20Per:       number;
    LongTermSplRateDTAA: number;
    TotalLongTerm:       number;
}

/**
 * Short term gains
 */
export interface ShortTerm {
    /**
     * Short-term chargeable @ 15%
     */
    ShortTerm15Per: number;
    /**
     * Short-term chargeable @ 30%
     */
    ShortTerm30Per: number;
    /**
     * Short-term chargeable at applicable rate
     */
    ShortTermAppRate: number;
    /**
     * Short-term chargeable at special rates in India as per DTAA
     */
    ShortTermSplRateDTAA: number;
    TotalShortTerm:       number;
}

/**
 * Income of other sources
 */
export interface IncFromOS {
    FromOwnRaceHorse:         number;
    IncChargblSplRate:        number;
    OtherSrcThanOwnRaceHorse: number;
    TotIncFromOS:             number;
}

/**
 * Computation of tax liability on total income
 */
export interface PartBTTI {
    /**
     * This field is applicable only in case of resident assessee. It is to know if the assessee
     * has any interest in any asset/signing authority in any account located outside India.
     */
    AssetOutIndiaFlag:          AssetOutIndiaFlag;
    ComputationOfTaxLiability:  ComputationOfTaxLiability;
    HealthEduCess:              number;
    Refund:                     Refund;
    Surcharge:                  number;
    TaxPaid:                    TaxPaid;
    TaxPayDeemedTotIncUs115JC:  number;
    TotalTaxPayablDeemedTotInc: number;
}

/**
 * This field is applicable only in case of resident assessee. It is to know if the assessee
 * has any interest in any asset/signing authority in any account located outside India.
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 *
 * Property co-owned by other than the taxpayer (if please enter following details)
 */
export enum AssetOutIndiaFlag {
    No = "NO",
    Yes = "YES",
}

export interface ComputationOfTaxLiability {
    AggregateTaxInterestLiability: number;
    CreditUS115JD:                 number;
    /**
     * Education Cess
     */
    EducationCess:     number;
    GrossTaxLiability: number;
    GrossTaxPay?:      GrossTaxPay;
    GrossTaxPayable:   number;
    IntrstPay:         IntrstPay;
    NetTaxLiability:   number;
    Rebate87A:         number;
    /**
     * 115BBE Surcharge after marginal relief
     */
    Surcharge25ofSI: number;
    /**
     * 115BBE Surcharge before marginal relief
     */
    Surcharge25ofSIBeforeMarginal: number;
    /**
     * Surcharge other than 115BBE after marginal relief
     */
    SurchargeOnAboveCrore: number;
    /**
     * Surcharge other than 115BBE before marginal relief
     */
    SurchargeOnAboveCroreBeforeMarginal: number;
    TaxPayAfterCreditUs115JD:            number;
    TaxPayableOnRebate:                  number;
    TaxPayableOnTI:                      TaxPayableOnTI;
    TaxRelief?:                          TaxRelief;
    TotalSurcharge:                      number;
}

/**
 * Gross tax payable
 */
export interface GrossTaxPay {
    /**
     * Tax deferred - relatable to income on perquisites referred in section 17(2)(vi) received
     * from employer, being an eligible start-up referred to in section 80-IAC
     */
    TaxDeferred17: number;
    /**
     * Tax deferred from earlier years but payable during current AY (Total of col. 7 of
     * schedule Tax Deferred on ESOP)
     */
    TaxDeferredPayableCY: number;
    /**
     * Tax on income without including income on perquisites referred in section 17(2)(vi)
     * received from employer, being an eligible start-up referred to in section 80-IAC (
     * Schedule Salary)
     */
    TaxInc17: number;
}

export interface IntrstPay {
    IntrstPayUs234A:   number;
    IntrstPayUs234B:   number;
    IntrstPayUs234C:   number;
    LateFilingFee234F: number;
    TotalIntrstPay:    number;
}

export interface TaxPayableOnTI {
    RebateOnAgriInc:           number;
    TaxAtNormalRatesOnAggrInc: number;
    TaxAtSpecialRates:         number;
    TaxPayableOnTotInc:        number;
}

/**
 * Tax relief
 */
export interface TaxRelief {
    Section89?:   number;
    Section90?:   number;
    Section91?:   number;
    TotTaxRelief: number;
}

/**
 * Refund details
 */
export interface Refund {
    BankAccountDtls: BankAccountDtls;
    /**
     * Total Taxes Paid is greater than Aggregate Liability
     */
    RefundDue: number;
}

/**
 * Bank details
 */
export interface BankAccountDtls {
    AddtnlBankDetails?:  BankDetailType[];
    BankDtlsFlag:        TaxRescertifiedFlag;
    ForeignBankDetails?: ForeignBankDtls[];
}

export interface BankDetailType {
    /**
     * SB: Savings Account, CA: Current Account,CC: Cash Credit Account, OD: Over draft account,
     * NRO: Non Resident Account, CGAS - Capital Gain Account Scheme,OTH: Other
     */
    AccountType:   AccountType;
    BankAccountNo: string;
    BankName:      string;
    IFSCCode:      string;
}

/**
 * SB: Savings Account, CA: Current Account,CC: Cash Credit Account, OD: Over draft account,
 * NRO: Non Resident Account, CGAS - Capital Gain Account Scheme,OTH: Other
 */
export enum AccountType {
    CA = "CA",
    Cc = "CC",
    Cgas = "CGAS",
    Nro = "NRO",
    Od = "OD",
    Oth = "OTH",
    Sb = "SB",
}

export interface ForeignBankDtls {
    BankName:    string;
    CountryCode: CountryCode;
    IBAN:        string;
    SWIFTCode:   string;
}

/**
 * Tax paid details
 */
export interface TaxPaid {
    BalTaxPayable?: number;
    TaxesPaid:      TaxesPaid;
}

export interface TaxesPaid {
    AdvanceTax:        number;
    SelfAssessmentTax: number;
    TCS:               number;
    TDS:               number;
    TotalTaxesPaid:    number;
}

export interface Schedule112A {
    AcquisitionCost112A:     number;
    Balance112A:             number;
    CostAcqWithoutIndx112A:  number;
    Deductions112A:          number;
    ExpExclCnctTransfer112A: number;
    FairMktValueCapAst112A:  number;
    LTCGBeforelowerB1B2112A: number;
    SaleValue112A:           number;
    Schedule112ADtls?:       Schedule112A115ADType[];
}

export interface Schedule112A115ADType {
    AcquisitionCost:          number;
    Balance:                  number;
    CostAcqWithoutIndx:       number;
    ExpExclCnctTransfer:      number;
    FairMktValuePerShareunit: number;
    /**
     * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
     */
    ISINCode:               string;
    LTCGBeforelowerB1B2:    number;
    NumSharesUnits?:        number;
    SalePricePerShareUnit?: number;
    /**
     * BE - On or Before 31st January 2018; AE - After 31st January 2018
     */
    ShareOnOrBefore: ShareOnOrBefore;
    /**
     * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
     */
    ShareUnitName:         string;
    TotFairMktValueCapAst: number;
    TotSaleValue:          number;
    TotalDeductions:       number;
}

/**
 * BE - On or Before 31st January 2018; AE - After 31st January 2018
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum ShareOnOrBefore {
    AE = "AE",
    Be = "BE",
}

export interface Schedule115AD {
    AcquisitionCost115AD:     number;
    Balance115AD:             number;
    CostAcqWithoutIndx115AD:  number;
    Deductions115AD:          number;
    ExpExclCnctTransfer115AD: number;
    FairMktValueCapAst115AD:  number;
    LTCGBeforelowerB1B2115AD: number;
    SaleValue115AD:           number;
    Schedule115ADDtls?:       Schedule112A115ADType[];
}

/**
 * Schedule 5A Information regarding apportionment of income between spouses governed by
 * Portuguese Civil Code
 */
export interface Schedule5A2014 {
    AadhaarOfSpouse?:       string;
    CapGainHeadIncome:      Sch5AIncType;
    HPHeadIncome:           Sch5AIncType;
    NameOfSpouse:           string;
    OtherSourcesHeadIncome: Sch5AIncType;
    PANOfSpouse:            string;
    TotalHeadIncome:        Sch5AIncType;
}

export interface Sch5AIncType {
    AmtApprndOfSpouse: number;
    AmtTDSDeducted:    number;
    IncRecvdUndHead:   number;
    TDSApprndOfSpouse: number;
}

export interface Schedule80D {
    Sec80DSelfFamSrCtznHealth?: Sec80DSelfFamSrCtznHealth;
}

export interface Sec80DSelfFamSrCtznHealth {
    EligibleAmountOfDedn:      number;
    HealthInsPremSlfFam?:      number;
    HlthInsPremParents?:       number;
    HlthInsPremParentsSrCtzn?: number;
    HlthInsPremSlfFamSrCtzn?:  number;
    MedicalExpParentsSrCtzn?:  number;
    MedicalExpSlfFamSrCtzn?:   number;
    Parents:                   number;
    ParentsSeniorCitizen:      number;
    /**
     * Y - Yes; N - No; P - Not claiming for Parents
     */
    ParentsSeniorCitizenFlag?:    string;
    PrevHlthChckUpParents?:       number;
    PrevHlthChckUpParentsSrCtzn?: number;
    PrevHlthChckUpSlfFam?:        number;
    PrevHlthChckUpSlfFamSrCtzn?:  number;
    SelfAndFamily:                number;
    SelfAndFamilySeniorCitizen:   number;
    /**
     * Y - Yes; N - No; S - Not claiming for Self/ Family
     */
    SeniorCitizenFlag?: string;
}

export interface Schedule80DD {
    DeductionAmount:   number;
    DependentAadhaar?: string;
    DependentPan?:     string;
    /**
     * 1. Spouse; 2. Son; 3. Daughter; 4. Father; 5. Mother; 6. Brother; 7. Sister; 8. Member of
     * the HUF (in case of HUF)
     */
    DependentType:       DependentType;
    Form10IAAckNum?:     string;
    Form10IAFilingDate?: string;
    /**
     * 1 : Dependent person with disability  ; 2 : Dependent person with severe disability
     */
    NatureOfDisability: NatureOfDisability;
    UDIDNum?:           string;
}

/**
 * 1. Spouse; 2. Son; 3. Daughter; 4. Father; 5. Mother; 6. Brother; 7. Sister; 8. Member of
 * the HUF (in case of HUF)
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum DependentType {
    The1 = "1",
    The2 = "2",
    The3 = "3",
    The4 = "4",
    The5 = "5",
    The6 = "6",
    The7 = "7",
    The8 = "8",
}

export interface Schedule80G {
    Don100Percent?:               Don100Percent;
    Don100PercentApprReqd?:       Don100PercentApprReqd;
    Don50PercentApprReqd?:        Don50PercentApprReqd;
    Don50PercentNoApprReqd?:      Don50PercentNoApprReqd;
    TotalDonationsUs80G:          number;
    TotalDonationsUs80GCash:      number;
    TotalDonationsUs80GOtherMode: number;
    TotalEligibleDonationsUs80G:  number;
}

export interface Don100Percent {
    DoneeWithPan?:             DoneeWithPan[];
    TotDon100Percent:          number;
    TotDon100PercentCash:      number;
    TotDon100PercentOtherMode: number;
    TotEligibleDon100Percent:  number;
}

export interface DoneeWithPan {
    AddressDetail: AddressDetail80G;
    /**
     * Please enter ARN (Donation reference Number)
     */
    ArnNbr?:              string;
    DonationAmt:          number;
    DonationAmtCash:      number;
    DonationAmtOtherMode: number;
    DoneePAN:             string;
    DoneeWithPanName:     string;
    EligibleDonationAmt:  number;
}

export interface AddressDetail80G {
    AddrDetail:           string;
    CityOrTownOrDistrict: string;
    PinCode:              number;
    /**
     * 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
     * 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
     * 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
     * Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21-meghalaya;
     * 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
     * Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
     * 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh
     */
    StateCode: PurpleStateCode;
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
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PurpleStateCode {
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

export interface Don100PercentApprReqd {
    DoneeWithPan?:                     DoneeWithPan[];
    TotDon100PercentApprReqd:          number;
    TotDon100PercentApprReqdCash:      number;
    TotDon100PercentApprReqdOtherMode: number;
    TotEligibleDon100PercentApprReqd:  number;
}

export interface Don50PercentApprReqd {
    DoneeWithPan?:                    DoneeWithPan[];
    TotDon50PercentApprReqd:          number;
    TotDon50PercentApprReqdCash:      number;
    TotDon50PercentApprReqdOtherMode: number;
    TotEligibleDon50PercentApprReqd:  number;
}

export interface Don50PercentNoApprReqd {
    DoneeWithPan?:                      DoneeWithPan[];
    TotDon50PercentNoApprReqd:          number;
    TotDon50PercentNoApprReqdCash:      number;
    TotDon50PercentNoApprReqdOtherMode: number;
    TotEligibleDon50Percent:            number;
}

export interface Schedule80GGA {
    DonationDtlsSciRsrchRuralDev?:  DonationDtlsSciRsrchRuralDev[];
    TotalDonationAmtCash80GGA:      number;
    TotalDonationAmtOtherMode80GGA: number;
    TotalDonationsUs80GGA:          number;
    TotalEligibleDonationAmt80GGA:  number;
}

export interface DonationDtlsSciRsrchRuralDev {
    AddressDetail:        AddressDetail80G;
    DonationAmt:          number;
    DonationAmtCash:      number;
    DonationAmtOtherMode: number;
    DoneePAN:             string;
    EligibleDonationAmt:  number;
    NameOfDonee:          string;
    /**
     * 80GGA(2)(a) - Sum paid to Research Association or University, college or other
     * institution for Scientific Research; 80GGA(2)(aa) - Sum paid to Research Association or
     * University, college or other institution for Social science or Statistical Research;
     * 80GGA(2)(b) - Sum paid to an association or institution for Rural Development;
     * 80GGA(2)(bb) - Sum paid to PSU or Local Authority or an association or institution
     * approved by the National Committee for carrying out any eligible project; 80GGA(2)(c) -
     * Sum paid to an association or institution for Conservation of Natural Resources or for
     * afforestation; 80GGA(2)(cc) - Sum paid for Afforestation, to the funds, which are;
     * notified by Central Govt.; 80GGA(2)(d) - Sum paid for Rural Development to the funds,
     * which are notified by Central Govt.; 80GGA(2)(e) - Sum paid to National Urban Poverty
     * Eradication Fund as setup and notified by Central Govt.
     */
    RelevantClauseUndrDedClaimed: RelevantClauseUndrDedClaimed;
}

/**
 * 80GGA(2)(a) - Sum paid to Research Association or University, college or other
 * institution for Scientific Research; 80GGA(2)(aa) - Sum paid to Research Association or
 * University, college or other institution for Social science or Statistical Research;
 * 80GGA(2)(b) - Sum paid to an association or institution for Rural Development;
 * 80GGA(2)(bb) - Sum paid to PSU or Local Authority or an association or institution
 * approved by the National Committee for carrying out any eligible project; 80GGA(2)(c) -
 * Sum paid to an association or institution for Conservation of Natural Resources or for
 * afforestation; 80GGA(2)(cc) - Sum paid for Afforestation, to the funds, which are;
 * notified by Central Govt.; 80GGA(2)(d) - Sum paid for Rural Development to the funds,
 * which are notified by Central Govt.; 80GGA(2)(e) - Sum paid to National Urban Poverty
 * Eradication Fund as setup and notified by Central Govt.
 */
export enum RelevantClauseUndrDedClaimed {
    The80GGA2A = "80GGA2a",
    The80GGA2Aa = "80GGA2aa",
    The80GGA2B = "80GGA2b",
    The80GGA2Bb = "80GGA2bb",
    The80GGA2C = "80GGA2c",
    The80GGA2Cc = "80GGA2cc",
    The80GGA2D = "80GGA2d",
    The80GGA2E = "80GGA2e",
}

export interface Schedule80GGC {
    Schedule80GGCDetails?:          Schedule80GGCDetail[];
    TotalDonationAmtCash80GGC:      number;
    TotalDonationAmtOtherMode80GGC: number;
    TotalDonationsUs80GGC:          number;
    TotalEligibleDonationAmt80GGC:  number;
}

export interface Schedule80GGCDetail {
    DonationAmt:          number;
    DonationAmtCash:      number;
    DonationAmtOtherMode: number;
    /**
     * Date of Donation in YYYY-MM-DD format
     */
    DonationDate:        string;
    EligibleDonationAmt: number;
    IFSCCode?:           string;
    TransactionRefNum?:  string;
}

export interface Schedule80U {
    DeductionAmount:     number;
    Form10IAAckNum?:     string;
    Form10IAFilingDate?: string;
    /**
     * 1 : Dependent person with disability  ; 2 : Dependent person with severe disability
     */
    NatureOfDisability: NatureOfDisability;
    UDIDNum?:           string;
}

export interface ScheduleAL {
    ImmovableDetails?:      ImmovableDetails[];
    LiabilityInRelatAssets: number;
    MovableAsset:           MovableAsset;
}

export interface ImmovableDetails {
    AddressAL:   AddressAL;
    Amount:      number;
    Description: string;
}

/**
 * Address of immovable property in Sch AL
 */
export interface AddressAL {
    CityOrTownOrDistrict: string;
    CountryCode:          CountryCode;
    LocalityOrArea:       string;
    PinCode?:             number;
    ResidenceName?:       string;
    ResidenceNo:          string;
    RoadOrStreet?:        string;
    StateCode:            StateCode;
    ZipCode?:             string;
}

export interface MovableAsset {
    ArchCollDrawPaintSulpArt:   number;
    CashInHand:                 number;
    DepositsInBank:             number;
    InsurancePolicies:          number;
    JewelleryBullionEtc:        number;
    LoansAndAdvancesGiven:      number;
    SharesAndSecurities:        number;
    VehiclYachtsBoatsAircrafts: number;
}

export interface ScheduleAMT {
    AdjustedUnderSec115JC:    number;
    DeductionClaimUndrAnySec: number;
    TaxPayableUnderSec115JC:  number;
    TotalIncItemPartBTI:      number;
}

export interface ScheduleAMTC {
    AmtLiabilityAvailable:   number;
    AmtTaxCreditAvailable:   number;
    CurrAssYr?:              CurrAssYr;
    CurrYrAmtCreditFwd:      number;
    CurrYrCreditCarryFwd:    number;
    ScheduleAMTCDtls?:       ScheduleAMTCDtls[];
    TaxOthProvisions:        number;
    TaxSection115JC:         number;
    TaxSection115JD:         number;
    TotAMTGross:             number;
    TotAmtCreditUtilisedCY?: number;
    TotBalAMTCreditCF:       number;
    TotBalBF:                number;
    TotSetOffEys:            number;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum CurrAssYr {
    The202425 = "2024-25",
}

export interface ScheduleAMTCDtls {
    AmtCreditBalBroughtFwd: number;
    AmtCreditSetOfEy:       number;
    AmtCreditUtilized:      number;
    AssYr:                  AssYr;
    BalAmtCreditCarryFwd:   number;
    Gross:                  number;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum AssYr {
    The201314 = "2013-14",
    The201415 = "2014-15",
    The201516 = "2015-16",
    The201617 = "2016-17",
    The201718 = "2017-18",
    The201819 = "2018-19",
    The201920 = "2019-20",
    The202021 = "2020-21",
    The202122 = "2021-22",
    The202223 = "2022-23",
    The202324 = "2023-24",
}

/**
 * Details of Income after Set off of Brought forward; losses of earlier years
 */
export interface ScheduleBFLA {
    /**
     * Do you want to edit the auto-populated details?
     */
    BFLAEditFlag?:             string;
    HP?:                       ScheduleBFLAHP;
    IncomeOfCurrYrAftCYLABFLA: number;
    LTCG10Per:                 ScheduleBFLALTCG10Per;
    LTCG20Per:                 ScheduleBFLALTCG20Per;
    LTCGDTAARate:              ScheduleBFLALTCGDTAARate;
    OthSrcExclRaceHorse?:      ScheduleBFLAOthSrcExclRaceHorse;
    OthSrcRaceHorse?:          ScheduleBFLAOthSrcRaceHorse;
    STCG15Per:                 ScheduleBFLASTCG15Per;
    STCG30Per:                 ScheduleBFLASTCG30Per;
    STCGAppRate:               ScheduleBFLASTCGAppRate;
    STCGDTAARate:              ScheduleBFLASTCGDTAARate;
    Salary:                    ScheduleBFLASalary;
    TotalBFLossSetOff:         TotalBFLossSetOff;
}

export interface ScheduleBFLAHP {
    IncBFLA: IncBFLA;
}

export interface IncBFLA {
    BFlossPrevYrUndSameHeadSetoff: number;
    IncOfCurYrAfterSetOffBFLosses: number;
    /**
     * Income after set-off, if any, of current year’s losses
     */
    IncOfCurYrUndHeadFromCYLA: number;
}

export interface ScheduleBFLALTCG10Per {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLALTCG20Per {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLALTCGDTAARate {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLAOthSrcExclRaceHorse {
    IncBFLA: SalaryOthSrcIncBFLA;
}

export interface SalaryOthSrcIncBFLA {
    IncOfCurYrAfterSetOffBFLosses: number;
    /**
     * Fill positive or zero value only
     */
    IncOfCurYrUndHeadFromCYLA: number;
}

export interface ScheduleBFLAOthSrcRaceHorse {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLASTCG15Per {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLASTCG30Per {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLASTCGAppRate {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLASTCGDTAARate {
    IncBFLA: IncBFLA;
}

export interface ScheduleBFLASalary {
    IncBFLA: SalaryOthSrcIncBFLA;
}

export interface TotalBFLossSetOff {
    TotBFLossSetoff: number;
}

/**
 * Details of Losses to be carried forward to future; years
 */
export interface ScheduleCFL {
    AdjTotBFLossInBFLA?: AdjTotBFLossInBFLA;
    /**
     * Current Year Losses
     */
    CurrentAYloss?: CurrentAYloss;
    /**
     * Carry forward losses for AY2022-23
     */
    LossCFFromPrev2ndYearFromAY?: LossCFFromPrev2NdYearFromAY;
    /**
     * Carry forward losses for AY2021-22
     */
    LossCFFromPrev3rdYearFromAY?: LossCFFromPrev3RDYearFromAY;
    /**
     * Carry forward losses for AY2020-21
     */
    LossCFFromPrev4thYearFromAY?: LossCFFromPrev4ThYearFromAY;
    /**
     * Carry forward losses for AY2019-20
     */
    LossCFFromPrev5thYearFromAY?: LossCFFromPrev5ThYearFromAY;
    /**
     * Carry forward losses for AY2018-19
     */
    LossCFFromPrev6thYearFromAY?: LossCFFromPrev6ThYearFromAY;
    /**
     * Carry forward losses for AY2017-18
     */
    LossCFFromPrev7thYearFromAY?: LossCFFromPrev7ThYearFromAY;
    /**
     * Carry forward losses for AY2016-17
     */
    LossCFFromPrev8thYearFromAY?: LossCFFromPrev8ThYearFromAY;
    /**
     * Carry forward losses for AY2023-24
     */
    LossCFFromPrevYrToAY?:     LossCFFromPrevYrToAY;
    TotalLossCFSummary:        TotalLossCFSummary;
    TotalOfBFLossesEarlierYrs: TotalOfBFLossesEarlierYrs;
}

export interface AdjTotBFLossInBFLA {
    LossSummaryDetail: LossSummaryDetail;
}

export interface LossSummaryDetail {
    OthSrcLossRaceHorseCF?: number;
    TotalHPPTILossCF:       number;
    TotalLTCGPTILossCF:     number;
    TotalSTCGPTILossCF:     number;
}

/**
 * Current Year Losses
 */
export interface CurrentAYloss {
    LossSummaryDetail: LossSummaryDetail;
}

/**
 * Carry forward losses for AY2022-23
 */
export interface LossCFFromPrev2NdYearFromAY {
    CarryFwdLossDetail: CarryFwdLossDetail;
}

export interface CarryFwdLossDetail {
    /**
     * Date in YYYY-MM-DD format on or after 2021-04-01
     */
    DateOfFiling:           string;
    OthSrcLossRaceHorseCF?: number;
    TotalHPPTILossCF:       number;
    TotalLTCGPTILossCF:     number;
    TotalSTCGPTILossCF:     number;
}

/**
 * Carry forward losses for AY2021-22
 */
export interface LossCFFromPrev3RDYearFromAY {
    CarryFwdLossDetail: CarryFwdLossDetail;
}

/**
 * Carry forward losses for AY2020-21
 */
export interface LossCFFromPrev4ThYearFromAY {
    CarryFwdLossDetail: CarryFwdLossDetail;
}

/**
 * Carry forward losses for AY2019-20
 */
export interface LossCFFromPrev5ThYearFromAY {
    CarryFwdLossDetail: CarryFwdWithoutLossDetail;
}

export interface CarryFwdWithoutLossDetail {
    /**
     * Date in YYYY-MM-DD format on or after 2013-04-01
     */
    DateOfFiling:        string;
    TotalHPPTILossCF?:   number;
    TotalLTCGPTILossCF?: number;
    TotalSTCGPTILossCF?: number;
}

/**
 * Carry forward losses for AY2018-19
 */
export interface LossCFFromPrev6ThYearFromAY {
    CarryFwdLossDetail: CarryFwdWithoutLossDetail;
}

/**
 * Carry forward losses for AY2017-18
 */
export interface LossCFFromPrev7ThYearFromAY {
    CarryFwdLossDetail: CarryFwdWithoutLossDetail;
}

/**
 * Carry forward losses for AY2016-17
 */
export interface LossCFFromPrev8ThYearFromAY {
    CarryFwdLossDetail: CarryFwdWithoutLossDetail;
}

/**
 * Carry forward losses for AY2023-24
 */
export interface LossCFFromPrevYrToAY {
    CarryFwdLossDetail: CarryFwdLossDetail;
}

export interface TotalLossCFSummary {
    LossSummaryDetail: LossSummaryDetail;
}

export interface TotalOfBFLossesEarlierYrs {
    LossSummaryDetail: LossSummaryDetail;
}

export interface ScheduleCGFor23 {
    AccruOrRecOfCG:        AccruOrRecOfCG;
    CurrYrLosses:          CurrYrLosses;
    DeducClaimInfo?:       DeducClaimInfo;
    IncmFromVDATrnsf:      number;
    LongTermCapGain23:     LongTermCapGain23;
    ShortTermCapGainFor23: ShortTermCapGainFor23;
    SumOfCGIncm:           number;
    TotScheduleCGFor23:    number;
}

export interface AccruOrRecOfCG {
    LongTermUnder10Per:       DateRangeType;
    LongTermUnder20Per:       DateRangeType;
    LongTermUnderDTAARate:    DateRangeType;
    ShortTermUnder15Per:      DateRangeType;
    ShortTermUnder30Per:      DateRangeType;
    ShortTermUnderAppRate:    DateRangeType;
    ShortTermUnderDTAARate:   DateRangeType;
    VDATrnsfGainsUnder30Per?: DateRangeType;
}

/**
 * Dividend income taxable at DTAA rates
 *
 * Dividend Income as per proviso to sec 115A(1)(a)(A) @10%  (Including PTI Income)
 *
 * Dividend Income u/s 115A(1)(a)(i)  @ 20% (Including PTI Income)
 *
 * Dividend Income u/s 115AC @ 10%
 *
 * Dividend Income u/s 115ACA (1)(a) @ 10% (Including PTI Income)
 *
 * Dividend Income (other than units referred to in section 115AB) u/s 115AD(1)(i) @ 20%
 * (Including PTI Income)
 *
 * Dividend Income referred in Sl.no.1a(i)
 *
 * Income by way of winnings from lotteries, crossword puzzles, races, games, gambling,
 * betting etc. referred to in section 2(24)(ix)
 *
 * Income by way of winnings from online games u/s 115BBJ
 *
 * Income from retirement benefit account maintained in a notified country u/s 89A (Taxable
 * portion after reducing relief u/s 89A)
 */
export interface DateRangeType {
    DateRange: DateRange;
}

export interface DateRange {
    Up16Of12To15Of3: number;
    Up16Of3To31Of3:  number;
    Up16Of9To15Of12: number;
    Upto15Of6:       number;
    Upto15Of9:       number;
}

export interface CurrYrLosses {
    InLossSetOff:     InLossSetOff;
    InLtcg10Per:      InLtcg10Per;
    InLtcg20Per:      InLtcg20Per;
    InLtcgDTAARate:   InLtcgDTAARate;
    InStcg15Per:      InStcg15Per;
    InStcg30Per:      InStcg30Per;
    InStcgAppRate:    InStcgAppRate;
    InStcgDTAARate:   InStcgDTAARate;
    LossRemainSetOff: LossRemainSetOff;
    TotLossSetOff:    TotLossSetOff;
}

export interface InLossSetOff {
    LtclSetOff10Per:    number;
    LtclSetOff20Per:    number;
    LtclSetOffDTAARate: number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface InLtcg10Per {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    LtclSetOff20Per:    number;
    LtclSetOffDTAARate: number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface InLtcg20Per {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    LtclSetOff10Per:    number;
    LtclSetOffDTAARate: number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface InLtcgDTAARate {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    LtclSetOff10Per:    number;
    LtclSetOff20Per:    number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface InStcg15Per {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface InStcg30Per {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    StclSetoff15Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface InStcgAppRate {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffDTAARate: number;
}

export interface InStcgDTAARate {
    CurrYearIncome:    number;
    CurrYrCapGain:     number;
    StclSetoff15Per:   number;
    StclSetoff30Per:   number;
    StclSetoffAppRate: number;
}

export interface LossRemainSetOff {
    LtclSetOff10Per:    number;
    LtclSetOff20Per:    number;
    LtclSetOffDTAARate: number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface TotLossSetOff {
    LtclSetOff10Per:    number;
    LtclSetOff20Per:    number;
    LtclSetOffDTAARate: number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}

export interface DeducClaimInfo {
    DeducClaimDtlsUs115F?: DeducClaimDtls115F[];
    DeducClaimDtlsUs54?:   DeducClaimDtls54N54F[];
    DeducClaimDtlsUs54B?:  DeducClaimDtls54B[];
    DeducClaimDtlsUs54EC?: DeducClaimDtls54ECn115F[];
    DeducClaimDtlsUs54F?:  DeducClaimDtls54N54F[];
    TotDeductClaim:        number;
}

export interface DeducClaimDtls115F {
    AmtDeducted: number;
    AmtInvested: number;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofInvestment: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofTransfer: string;
}

export interface DeducClaimDtls54N54F {
    AccountNo?:         string;
    AmtDeducted:        number;
    AmtDeposited?:      number;
    CostofNewResHouse?: number;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofPurchase?: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofTransfer: string;
    /**
     * Date of Deposit in format YYYY-MM-DD
     */
    DepositDate?: string;
    IFSC?:        string;
}

export interface DeducClaimDtls54B {
    AccountNo?:         string;
    AmtDeducted:        number;
    AmtDeposited?:      number;
    CostofNewAgriLand?: number;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofPurchase?: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofTransfer: string;
    /**
     * Date of Deposit in format YYYY-MM-DD
     */
    DepositDate?: string;
    IFSC?:        string;
}

export interface DeducClaimDtls54ECn115F {
    AmtDeducted:  number;
    AmtInvested?: number;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofInvestment?: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofTransfer: string;
}

export interface LongTermCapGain23 {
    AmtDeemedLtcg?:             number;
    NRICgDTAA?:                 NRITaxUsDTAALtcgType;
    NRIOnSec112and115?:         NRIOnSec112And115;
    NRIProvisoSec48?:           NRIProvisoSec48;
    NRISaleOfEquityShareUs112A: EquityShareUs112A;
    NRISaleofForeignAsset:      NRISaleofForeignAsset;
    PassThrIncNatureLTCG:       number;
    PassThrIncNatureLTCG10Per?: number;
    PassThrIncNatureLTCG20Per?: number;
    PassThrIncNatureLTCGUs112A: number;
    Proviso112Applicable?:      Proviso112Applicable[];
    SaleOfEquityShareUs112A:    EquityShareUs112A;
    SaleofAssetNA:              EquityOrUnitSec54Type;
    SaleofBondsDebntr:          EquityOrUnitSec54TypeDebn112;
    SaleofLandBuild?:           LongTermCapGain23SaleofLandBuild;
    TotalAmtDeemedLtcg:         number;
    TotalAmtNotTaxUsDTAALtcg:   number;
    TotalAmtTaxUsDTAALtcg:      number;
    TotalLTCG:                  number;
    UnutilizedCg?:              UnutilizedCGPrvYrLtcg;
    /**
     * Y - Yes; N - No; X - Not Applicable
     */
    UnutilizedLtcgFlag?: UnutilizedLtcgFlag;
}

export interface NRITaxUsDTAALtcgType {
    NRIDTAADtls?: PurpleNRIDTAADtl[];
}

export interface PurpleNRIDTAADtl {
    ApplicableRate?:           number;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    DTAAamt:                   number;
    DTAAarticle:               string;
    /**
     * B1e - B1e; B2e - B2e; B3e_112(1) - B3e_112(1); B3e_115ACA - B3e_115ACA; B4c_112A -
     * B4c_112A; B5c - B5c; B6e_112(1)(c) - B6e_112(1)(c); B6e_115AC - B6e_115AC; B6e_115AD -
     * B6e_115AD; B7c - B7c 115AD(1)(iii) proviso; B8c - B8c; B8f - B8f; B9e - B9e; B10 - B10;
     * B11a1 - B11a1; B11a2 - B11a2; B11b - B11b
     */
    ItemNoincl:           PurpleItemNoincl;
    RateAsPerITAct:       number;
    RateAsPerTreaty:      number;
    SecITAct:             string;
    TaxRescertifiedFlag?: TaxRescertifiedFlag;
}

/**
 * 93:AFGHANISTAN; 1001:ÅLAND ISLANDS; 355:ALBANIA; 213:ALGERIA; 684:AMERICAN SAMOA;
 * 376:ANDORRA; 244:ANGOLA; 1264:ANGUILLA; 1010:ANTARCTICA; 1268:ANTIGUA AND BARBUDA;
 * 54:ARGENTINA; 374:ARMENIA; 297:ARUBA; 61:AUSTRALIA; 43:AUSTRIA; 994:AZERBAIJAN;
 * 1242:BAHAMAS; 973:BAHRAIN; 880:BANGLADESH; 1246:BARBADOS; 375:BELARUS; 32:BELGIUM;
 * 501:BELIZE; 229:BENIN; 1441:BERMUDA; 975:BHUTAN; 591:BOLIVIA (PLURINATIONAL STATE OF);
 * 1002:BONAIRE, SINT EUSTATIUS AND SABA; 387:BOSNIA AND HERZEGOVINA; 267:BOTSWANA;
 * 1003:BOUVET ISLAND; 55:BRAZIL; 1014:BRITISH INDIAN OCEAN TERRITORY; 673:BRUNEI
 * DARUSSALAM; 359:BULGARIA; 226: BURKINA FASO; 257:BURUNDI; 238:CABO VERDE; 855:CAMBODIA;
 * 237:CAMEROON; 1:CANADA; 1345:CAYMAN ISLANDS; 236:CENTRAL AFRICAN REPUBLIC; 235:CHAD;
 * 56:CHILE; 86:CHINA; 9:CHRISTMAS ISLAND; 672:COCOS (KEELING) ISLANDS; 57:COLOMBIA;
 * 270:COMOROS; 242:CONGO; 243:CONGO (DEMOCRATIC REPUBLIC OF THE); 682:COOK ISLANDS;
 * 506:COSTA RICA; 225:CÔTE D'IVOIRE; 385:CROATIA; 53:CUBA; 1015:CURAÇAO; 357:CYPRUS;
 * 420:CZECHIA; 45:DENMARK; 253:DJIBOUTI; 1767:DOMINICA; 1809:DOMINICAN REPUBLIC;
 * 593:ECUADOR; 20:EGYPT; 503:EL SALVADOR; 240:EQUATORIAL GUINEA; 291:ERITREA; 372:ESTONIA;
 * 251:ETHIOPIA; 500:FALKLAND ISLANDS (MALVINAS); 298:FAROE ISLANDS; 679:FIJI; 358:FINLAND;
 * 33:FRANCE; 594:FRENCH GUIANA; 689:FRENCH POLYNESIA; 1004:FRENCH SOUTHERN TERRITORIES;
 * 241:GABON; 220:GAMBIA; 995:GEORGIA; 49:GERMANY; 233:GHANA; 350:GIBRALTAR; 30:GREECE;
 * 299:GREENLAND; 1473:GRENADA; 590:GUADELOUPE; 1671:GUAM; 502:GUATEMALA; 1481:GUERNSEY;
 * 224:GUINEA; 245:GUINEA-BISSAU; 592:GUYANA; 509:HAITI; 1005:HEARD ISLAND AND MCDONALD
 * ISLANDS; 6:HOLY SEE; 504:HONDURAS; 852:HONG KONG; 36:HUNGARY; 354:ICELAND; 62:INDONESIA;
 * 98:IRAN (ISLAMIC REPUBLIC OF); 964:IRAQ; 353:IRELAND; 1624:ISLE OF MAN; 972:ISRAEL;
 * 5:ITALY; 1876:JAMAICA; 81:JAPAN; 1534:JERSEY; 962:JORDAN; 7:KAZAKHSTAN; 254:KENYA;
 * 686:KIRIBATI; 850:KOREA(DEMOCRATIC PEOPLE'S REPUBLIC OF); 82:KOREA (REPUBLIC OF);
 * 965:KUWAIT; 996:KYRGYZSTAN; 856:LAO PEOPLE'S DEMOCRATIC REPUBLIC; 371:LATVIA;
 * 961:LEBANON; 266:LESOTHO; 231:LIBERIA; 218:LIBYA; 423:LIECHTENSTEIN; 370:LITHUANIA;
 * 352:LUXEMBOURG; 853:MACAO; 389:MACEDONIA(THE FORMER YUGOSLAV REPUBLIC OF);
 * 261:MADAGASCAR; 256:MALAWI; 60:MALAYSIA; 960:MALDIVES; 223:MALI; 356:MALTA; 692:MARSHALL
 * ISLANDS; 596:MARTINIQUE; 222:MAURITANIA; 230:MAURITIUS; 269:MAYOTTE; 52:MEXICO;
 * 691:MICRONESIA (FEDERATED STATES OF); 373:MOLDOVA (REPUBLIC OF); 377:MONACO;
 * 976:MONGOLIA; 382:MONTENEGRO; 1664:MONTSERRAT; 212:MOROCCO; 258:MOZAMBIQUE; 95:MYANMAR;
 * 264:NAMIBIA; 674:NAURU; 977:NEPAL; 31:NETHERLANDS; 687:NEW CALEDONIA; 64:NEW ZEALAND;
 * 505:NICARAGUA; 227:NIGER; 234:NIGERIA; 683:NIUE; 15:NORFOLK ISLAND; 1670:NORTHERN MARIANA
 * ISLANDS; 47:NORWAY; 968:OMAN; 92:PAKISTAN; 680:PALAU; 970:PALESTINE, STATE OF;
 * 507:PANAMA; 675:PAPUA NEW GUINEA; 595:PARAGUAY; 51:PERU; 63:PHILIPPINES; 1011:PITCAIRN;
 * 48:POLAND; 14:PORTUGAL; 1787:PUERTO RICO; 974:QATAR; 262:RÉUNION; 40:ROMANIA; 8:RUSSIAN
 * FEDERATION; 250:RWANDA; 1006:SAINT BARTHÉLEMY; 290: SAINT HELENA, ASCENSION AND TRISTAN
 * DA CUNHA; 1869:SAINT KITTS AND NEVIS; 1758:SAINT LUCIA; 1007:SAINT MARTIN (FRENCH PART);
 * 508:SAINT PIERRE AND MIQUELON; 1784:SAINT VINCENT AND THE GRENADINES; 685:SAMOA; 378:SAN
 * MARINO; 239:SAO TOME AND PRINCIPE; 966:SAUDI ARABIA; 221:SENEGAL; 381:SERBIA;
 * 248:SEYCHELLES; 232:SIERRA LEONE; 65:SINGAPORE; 1721:SINT MAARTEN (DUTCH PART);
 * 421:SLOVAKIA; 386:SLOVENIA; 677:SOLOMON ISLANDS; 252:SOMALIA; 28:SOUTH AFRICA; 1008:SOUTH
 * GEORGIA AND THE SOUTH SANDWICH ISLANDS; 211:SOUTH SUDAN; 35:SPAIN; 94:SRI LANKA;
 * 249:SUDAN; 597:SURINAME; 1012:SVALBARD AND JAN MAYEN; 268:SWAZILAND; 46:SWEDEN;
 * 41:SWITZERLAND; 963:SYRIAN ARAB REPUBLIC; 886:TAIWAN; 992:TAJIKISTAN; 255:TANZANIA,
 * UNITED REPUBLIC OF; 66:THAILAND; 670:TIMOR-LESTE (EAST TIMOR); 228:TOGO; 690:TOKELAU;
 * 676:TONGA; 1868:TRINIDAD AND TOBAGO; 216:TUNISIA; 90:TURKEY; 993:TURKMENISTAN; 1649:TURKS
 * AND CAICOS ISLANDS; 688:TUVALU; 256:UGANDA; 380:UKRAINE; 971:UNITED ARAB EMIRATES;
 * 44:UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND; 2:UNITED STATES OF AMERICA;
 * 1009:UNITED STATES MINOR OUTLYING ISLANDS; 598:URUGUAY; 998:UZBEKISTAN; 678:VANUATU;
 * 58:VENEZUELA (BOLIVARIAN REPUBLIC OF); 84:VIET NAM; 1284:VIRGIN ISLANDS (BRITISH);
 * 1340:VIRGIN ISLANDS (U.S.); 681:WALLIS AND FUTUNA; 1013:WESTERN SAHARA; 967:YEMEN;
 * 260:ZAMBIA; 263:ZIMBABWE; 9999:OTHERS
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum CountryCodeExcludingIndia {
    The1 = "1",
    The1001 = "1001",
    The1002 = "1002",
    The1003 = "1003",
    The1004 = "1004",
    The1005 = "1005",
    The1006 = "1006",
    The1007 = "1007",
    The1008 = "1008",
    The1009 = "1009",
    The1010 = "1010",
    The1011 = "1011",
    The1012 = "1012",
    The1013 = "1013",
    The1014 = "1014",
    The1015 = "1015",
    The1242 = "1242",
    The1246 = "1246",
    The1264 = "1264",
    The1268 = "1268",
    The1284 = "1284",
    The1340 = "1340",
    The1345 = "1345",
    The14 = "14",
    The1441 = "1441",
    The1473 = "1473",
    The1481 = "1481",
    The15 = "15",
    The1534 = "1534",
    The1624 = "1624",
    The1649 = "1649",
    The1664 = "1664",
    The1670 = "1670",
    The1671 = "1671",
    The1721 = "1721",
    The1758 = "1758",
    The1767 = "1767",
    The1784 = "1784",
    The1787 = "1787",
    The1809 = "1809",
    The1868 = "1868",
    The1869 = "1869",
    The1876 = "1876",
    The2 = "2",
    The20 = "20",
    The211 = "211",
    The212 = "212",
    The213 = "213",
    The216 = "216",
    The218 = "218",
    The220 = "220",
    The221 = "221",
    The222 = "222",
    The223 = "223",
    The224 = "224",
    The225 = "225",
    The226 = "226",
    The227 = "227",
    The228 = "228",
    The229 = "229",
    The230 = "230",
    The231 = "231",
    The232 = "232",
    The233 = "233",
    The234 = "234",
    The235 = "235",
    The236 = "236",
    The237 = "237",
    The238 = "238",
    The239 = "239",
    The240 = "240",
    The241 = "241",
    The242 = "242",
    The243 = "243",
    The244 = "244",
    The245 = "245",
    The248 = "248",
    The249 = "249",
    The250 = "250",
    The251 = "251",
    The252 = "252",
    The253 = "253",
    The254 = "254",
    The255 = "255",
    The256 = "256",
    The257 = "257",
    The258 = "258",
    The260 = "260",
    The261 = "261",
    The262 = "262",
    The263 = "263",
    The264 = "264",
    The265 = "265",
    The266 = "266",
    The267 = "267",
    The268 = "268",
    The269 = "269",
    The270 = "270",
    The28 = "28",
    The290 = "290",
    The291 = "291",
    The297 = "297",
    The298 = "298",
    The299 = "299",
    The30 = "30",
    The31 = "31",
    The32 = "32",
    The33 = "33",
    The35 = "35",
    The350 = "350",
    The352 = "352",
    The353 = "353",
    The354 = "354",
    The355 = "355",
    The356 = "356",
    The357 = "357",
    The358 = "358",
    The359 = "359",
    The36 = "36",
    The370 = "370",
    The371 = "371",
    The372 = "372",
    The373 = "373",
    The374 = "374",
    The375 = "375",
    The376 = "376",
    The377 = "377",
    The378 = "378",
    The380 = "380",
    The381 = "381",
    The382 = "382",
    The385 = "385",
    The386 = "386",
    The387 = "387",
    The389 = "389",
    The40 = "40",
    The41 = "41",
    The420 = "420",
    The421 = "421",
    The423 = "423",
    The43 = "43",
    The44 = "44",
    The45 = "45",
    The46 = "46",
    The47 = "47",
    The48 = "48",
    The49 = "49",
    The5 = "5",
    The500 = "500",
    The501 = "501",
    The502 = "502",
    The503 = "503",
    The504 = "504",
    The505 = "505",
    The506 = "506",
    The507 = "507",
    The508 = "508",
    The509 = "509",
    The51 = "51",
    The52 = "52",
    The53 = "53",
    The54 = "54",
    The55 = "55",
    The56 = "56",
    The57 = "57",
    The58 = "58",
    The590 = "590",
    The591 = "591",
    The592 = "592",
    The593 = "593",
    The594 = "594",
    The595 = "595",
    The596 = "596",
    The597 = "597",
    The598 = "598",
    The6 = "6",
    The60 = "60",
    The61 = "61",
    The62 = "62",
    The63 = "63",
    The64 = "64",
    The65 = "65",
    The66 = "66",
    The670 = "670",
    The672 = "672",
    The673 = "673",
    The674 = "674",
    The675 = "675",
    The676 = "676",
    The677 = "677",
    The678 = "678",
    The679 = "679",
    The680 = "680",
    The681 = "681",
    The682 = "682",
    The683 = "683",
    The684 = "684",
    The685 = "685",
    The686 = "686",
    The687 = "687",
    The688 = "688",
    The689 = "689",
    The690 = "690",
    The691 = "691",
    The692 = "692",
    The7 = "7",
    The8 = "8",
    The81 = "81",
    The82 = "82",
    The84 = "84",
    The850 = "850",
    The852 = "852",
    The853 = "853",
    The855 = "855",
    The856 = "856",
    The86 = "86",
    The880 = "880",
    The886 = "886",
    The9 = "9",
    The90 = "90",
    The92 = "92",
    The93 = "93",
    The94 = "94",
    The95 = "95",
    The960 = "960",
    The961 = "961",
    The962 = "962",
    The963 = "963",
    The964 = "964",
    The965 = "965",
    The966 = "966",
    The967 = "967",
    The968 = "968",
    The970 = "970",
    The971 = "971",
    The972 = "972",
    The973 = "973",
    The974 = "974",
    The975 = "975",
    The976 = "976",
    The977 = "977",
    The98 = "98",
    The992 = "992",
    The993 = "993",
    The994 = "994",
    The995 = "995",
    The996 = "996",
    The998 = "998",
    The9999 = "9999",
}

/**
 * B1e - B1e; B2e - B2e; B3e_112(1) - B3e_112(1); B3e_115ACA - B3e_115ACA; B4c_112A -
 * B4c_112A; B5c - B5c; B6e_112(1)(c) - B6e_112(1)(c); B6e_115AC - B6e_115AC; B6e_115AD -
 * B6e_115AD; B7c - B7c 115AD(1)(iii) proviso; B8c - B8c; B8f - B8f; B9e - B9e; B10 - B10;
 * B11a1 - B11a1; B11a2 - B11a2; B11b - B11b
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PurpleItemNoincl {
    B10 = "B10",
    B11A1 = "B11a1",
    B11A2 = "B11a2",
    B11B = "B11b",
    B1E = "B1e",
    B2E = "B2e",
    B3E1121 = "B3e_112(1)",
    B3E115ACA = "B3e_115ACA",
    B4C112A = "B4c_112A",
    B5C = "B5c",
    B6E1121C = "B6e_112(1)(c)",
    B6E115AC = "B6e_115AC",
    B6E115AD = "B6e_115AD",
    B7C = "B7c",
    B8C = "B8c",
    B8F = "B8f",
    B9E = "B9e",
}

export interface NRIOnSec112And115 {
    NRIOnSec112and115Dtls?: NRIOnSec112And115Dtl[];
}

export interface NRIOnSec112And115Dtl {
    BalanceCG:                number;
    CapgainonAssets:          number;
    DeductSec48:              DeductSec48;
    DeductionUs54F:           number;
    FairMrktValueUnqshr:      number;
    FullConsideration:        number;
    FullValueConsdOthUnqshr:  number;
    FullValueConsdRecvUnqshr: number;
    FullValueConsdSec50CA:    number;
    /**
     * 21ciii - (i) unlisted securities as per sec. 112(1)(c); 5AC1c - (ii) bonds or GDR as
     * referred in sec. 115AC; 5ADiii - (iii) securities by FII as referred to in sec. 115AD
     */
    SectionCode: SectionCode;
}

export interface DeductSec48 {
    AquisitCost: number;
    ExpOnTrans:  number;
    ImproveCost: number;
    TotalDedn:   number;
}

/**
 * 21ciii - (i) unlisted securities as per sec. 112(1)(c); 5AC1c - (ii) bonds or GDR as
 * referred in sec. 115AC; 5ADiii - (iii) securities by FII as referred to in sec. 115AD
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum SectionCode {
    The21Ciii = "21ciii",
    The5AC1C = "5AC1c",
    The5ADiii = "5ADiii",
}

export interface NRIProvisoSec48 {
    BalanceCG:          number;
    DeductionUs54F:     number;
    LTCGWithoutBenefit: number;
}

export interface EquityShareUs112A {
    BalanceCG:       number;
    CapgainonAssets: number;
    DeductionUs54F:  number;
}

export interface NRISaleofForeignAsset {
    BalOtherthanSpecAsset:   number;
    BalonSpeciAsset:         number;
    DednOtherSpecAssetus115: number;
    DednSpecAssetus115:      number;
    SaleOtherSpecAsset:      number;
    SaleonSpecAsset:         number;
}

export interface Proviso112Applicable {
    Proviso112Applicabledtls: EquityOrUnitSec54TypeDebn112;
    /**
     * 22 - (i) listed securities (other than a unit) or zero coupon bonds where proviso to
     * section 112(1) is applicable; 5ACA1b - (ii) GDR of an Indian company referred in sec.
     * 115ACA
     */
    Proviso112SectionCode: Proviso112SectionCode;
}

export interface EquityOrUnitSec54TypeDebn112 {
    BalanceCG:         number;
    CapgainonAssets:   number;
    DeductSec48:       DeductSec48;
    DeductionUs54F:    number;
    FullConsideration: number;
}

/**
 * 22 - (i) listed securities (other than a unit) or zero coupon bonds where proviso to
 * section 112(1) is applicable; 5ACA1b - (ii) GDR of an Indian company referred in sec.
 * 115ACA
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum Proviso112SectionCode {
    The22 = "22",
    The5ACA1B = "5ACA1b",
}

export interface EquityOrUnitSec54Type {
    BalanceCG:                number;
    CapgainonAssets:          number;
    DeductSec48:              DeductSec48;
    DeductionUs54F:           number;
    FairMrktValueUnqshr:      number;
    FullConsideration:        number;
    FullValueConsdOthUnqshr:  number;
    FullValueConsdRecvUnqshr: number;
    FullValueConsdSec50CA:    number;
}

export interface LongTermCapGain23SaleofLandBuild {
    SaleofLandBuildDtls?: PurpleSaleofLandBuildDtl[];
}

export interface PurpleSaleofLandBuildDtl {
    AquisitCost:         number;
    AquisitCostIndex:    number;
    Balance:             number;
    CostOfImprovements?: CostOfImprovements;
    /**
     * Date in format YYYY-MM-DD
     */
    DateofPurchase?: string;
    /**
     * Date in format YYYY-MM-DD
     */
    DateofSale?:          string;
    ExemptionOrDednUs54:  ExemptionOrDednUs54SaleLandType;
    ExpOnTrans:           number;
    FullConsideration?:   number;
    FullConsideration50C: number;
    ImproveCost:          number;
    LTCGonImmvblPrprty:   number;
    PropertyValuation?:   number;
    TotalDedn:            number;
    TrnsfImmblPrprty?:    PurpleTrnsfImmblPrprty;
}

export interface CostOfImprovements {
    CostOfImprovementsDtls?: CostOfImprovementsType[];
}

export interface CostOfImprovementsType {
    CostOfImpIndex: number;
    ImproveCost:    number;
    ImproveDate:    ImproveDate;
    slno:           number;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum ImproveDate {
    The200102 = "2001-02",
    The200203 = "2002-03",
    The200304 = "2003-04",
    The200405 = "2004-05",
    The200506 = "2005-06",
    The200607 = "2006-07",
    The200708 = "2007-08",
    The200809 = "2008-09",
    The200910 = "2009-10",
    The201011 = "2010-11",
    The201112 = "2011-12",
    The201213 = "2012-13",
    The201314 = "2013-14",
    The201415 = "2014-15",
    The201516 = "2015-16",
    The201617 = "2016-17",
    The201718 = "2017-18",
    The201819 = "2018-19",
    The201920 = "2019-20",
    The202021 = "2020-21",
    The202122 = "2021-22",
    The202223 = "2022-23",
    The202324 = "2023-24",
}

export interface ExemptionOrDednUs54SaleLandType {
    ExemptionGrandTotal:      number;
    ExemptionOrDednUs54Dtls?: ExemptionOrDednUs54Dtl[];
}

export interface ExemptionOrDednUs54Dtl {
    ExemptionAmount: number;
    /**
     * 54 - Sec 54; 54B - Sec 54B; 54EC - Sec 54EC; 54F - Sec 54F
     */
    ExemptionSecCode: ExemptionSECCode;
}

/**
 * 54 - Sec 54; 54B - Sec 54B; 54EC - Sec 54EC; 54F - Sec 54F
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum ExemptionSECCode {
    The54 = "54",
    The54B = "54B",
    The54Ec = "54EC",
    The54F = "54F",
}

export interface PurpleTrnsfImmblPrprty {
    TrnsfImmblPrprtyDtls?: TrnsfImmblPrprtyDtls[];
}

export interface TrnsfImmblPrprtyDtls {
    AaadhaarOfBuyer?:  string;
    AddressOfProperty: string;
    Amount:            number;
    CountryCode:       CountryCode;
    NameOfBuyer:       string;
    PANofBuyer?:       string;
    PercentageShare:   number;
    PinCode?:          number;
    /**
     * 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
     * 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
     * 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
     * Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21- Meghalaya;
     * 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
     * Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
     * 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh; 99- State outside India
     */
    StateCode: StateCode;
    ZipCode?:  string;
}

export interface UnutilizedCGPrvYrLtcg {
    UnutilizedCgPrvYrDtls?: PurpleUnutilizedCGPrvYrDtl[];
}

export interface PurpleUnutilizedCGPrvYrDtl {
    AmtUnutilized:           number;
    AmtUtilized?:            number;
    PrvYrInWhichAsstTrnsfrd: PurplePrvYrInWhichAsstTrnsfrd;
    /**
     * 54 - 54; 54B - 54B; 54F - 54F
     */
    SectionClmd:        PurpleSectionClmd;
    YrInWhichAssetAcq?: YrInWhichAssetAcq;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PurplePrvYrInWhichAsstTrnsfrd {
    The202021 = "2020-21",
    The202122 = "2021-22",
    The202223 = "2022-23",
}

/**
 * 54 - 54; 54B - 54B; 54F - 54F
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PurpleSectionClmd {
    The54 = "54",
    The54B = "54B",
    The54F = "54F",
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum YrInWhichAssetAcq {
    The2021 = "2021",
    The2022 = "2022",
    The2023 = "2023",
}

/**
 * Y - Yes; N - No; X - Not Applicable
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum UnutilizedLtcgFlag {
    N = "N",
    X = "X",
    Y = "Y",
}

export interface ShortTermCapGainFor23 {
    AmtDeemedStcg?:               number;
    EquityMFonSTT?:               EquityMFonSTT[];
    NRICgDTAA?:                   NRITaxUsDTAAStcgType;
    NRISecur115AD:                EquityOrUnitSec94Type;
    NRITransacSec48Dtl:           NRITransacSec48Dtl;
    PassThrIncNatureSTCG:         number;
    PassThrIncNatureSTCG15Per?:   number;
    PassThrIncNatureSTCG30Per?:   number;
    PassThrIncNatureSTCGAppRate?: number;
    SaleOnOtherAssets:            EquityOrUnitSec94Type;
    SaleofLandBuild?:             ShortTermCapGainFor23SaleofLandBuild;
    TotalAmtDeemedStcg:           number;
    TotalAmtNotTaxUsDTAAStcg:     number;
    TotalAmtTaxUsDTAAStcg:        number;
    TotalSTCG:                    number;
    UnutilizedCg?:                UnutilizedCGPrvYrStcg;
    /**
     * Y - Yes; N - No; X - Not Applicable
     */
    UnutilizedStcgFlag?: UnutilizedLtcgFlag;
}

export interface EquityMFonSTT {
    EquityMFonSTTDtls: EquityOrUnitSec94TypeMFonSTT;
    /**
     * 1A - 111A [for others]; 5AD1biip - 115AD(1)(b)(ii) [for Foreign Institutional Investors]
     */
    MFSectionCode: MFSectionCode;
}

export interface EquityOrUnitSec94TypeMFonSTT {
    BalanceCG:           number;
    CapgainonAssets:     number;
    DeductSec48:         DeductSec48;
    FullConsideration:   number;
    LossSec94of7Or94of8: number;
}

/**
 * 1A - 111A [for others]; 5AD1biip - 115AD(1)(b)(ii) [for Foreign Institutional Investors]
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum MFSectionCode {
    The1A = "1A",
    The5AD1Biip = "5AD1biip",
}

export interface NRITaxUsDTAAStcgType {
    NRIDTAADtls?: FluffyNRIDTAADtl[];
}

export interface FluffyNRIDTAADtl {
    ApplicableRate?:           number;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    DTAAamt:                   number;
    DTAAarticle:               string;
    /**
     * A1e - A1e; A2e_111A - A2e-111A; A2e_115AD - A2e-115AD; A3a - A3a; A3b - A3b; A4e - A4e;
     * A5e - A5e; A6 - A6; A7a - A7a; A7b - A7b; A7c - A7c
     */
    ItemNoincl:           FluffyItemNoincl;
    RateAsPerITAct:       number;
    RateAsPerTreaty:      number;
    SecITAct:             string;
    TaxRescertifiedFlag?: TaxRescertifiedFlag;
}

/**
 * A1e - A1e; A2e_111A - A2e-111A; A2e_115AD - A2e-115AD; A3a - A3a; A3b - A3b; A4e - A4e;
 * A5e - A5e; A6 - A6; A7a - A7a; A7b - A7b; A7c - A7c
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum FluffyItemNoincl {
    A1E = "A1e",
    A2E111A = "A2e_111A",
    A2E115AD = "A2e_115AD",
    A3A = "A3a",
    A3B = "A3b",
    A4E = "A4e",
    A5E = "A5e",
    A6 = "A6",
    A7A = "A7a",
    A7B = "A7b",
    A7C = "A7c",
}

export interface EquityOrUnitSec94Type {
    BalanceCG:                number;
    CapgainonAssets:          number;
    DeductSec48:              DeductSec48;
    FairMrktValueUnqshr:      number;
    FullConsideration:        number;
    FullValueConsdOthUnqshr:  number;
    FullValueConsdRecvUnqshr: number;
    FullValueConsdSec50CA:    number;
    LossSec94of7Or94of8:      number;
}

export interface NRITransacSec48Dtl {
    NRItaxSTTNotPaid: number;
    NRItaxSTTPaid:    number;
}

export interface ShortTermCapGainFor23SaleofLandBuild {
    SaleofLandBuildDtls?: FluffySaleofLandBuildDtl[];
}

export interface FluffySaleofLandBuildDtl {
    AquisitCost: number;
    Balance:     number;
    /**
     * Date in format YYYY-MM-DD
     */
    DateofPurchase?: string;
    /**
     * Date in format YYYY-MM-DD
     */
    DateofSale?:          string;
    DeductionUs54B:       number;
    ExpOnTrans:           number;
    FullConsideration?:   number;
    FullConsideration50C: number;
    ImproveCost:          number;
    PropertyValuation?:   number;
    STCGonImmvblPrprty:   number;
    TotalDedn:            number;
    TrnsfImmblPrprty?:    FluffyTrnsfImmblPrprty;
}

export interface FluffyTrnsfImmblPrprty {
    TrnsfImmblPrprtyDtls?: TrnsfImmblPrprtyDtls[];
}

export interface UnutilizedCGPrvYrStcg {
    UnutilizedCgPrvYrDtls?: FluffyUnutilizedCGPrvYrDtl[];
}

export interface FluffyUnutilizedCGPrvYrDtl {
    AmtUnutilized:           number;
    AmtUtilized?:            number;
    PrvYrInWhichAsstTrnsfrd: FluffyPrvYrInWhichAsstTrnsfrd;
    SectionClmd:             FluffySectionClmd;
    YrInWhichAssetAcq?:      YrInWhichAssetAcq;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum FluffyPrvYrInWhichAsstTrnsfrd {
    The202122 = "2021-22",
    The202223 = "2022-23",
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum FluffySectionClmd {
    The54B = "54B",
}

export interface ScheduleCYLA {
    /**
     * Do you want to edit the auto-populated details?
     */
    CYLAEditFlag?:        string;
    HP?:                  ScheduleCYLAHP;
    LTCG10Per:            ScheduleCYLALTCG10Per;
    LTCG20Per:            ScheduleCYLALTCG20Per;
    LTCGDTAARate:         ScheduleCYLALTCGDTAARate;
    LossRemAftSetOff:     LossRemAftSetOff;
    OthSrcExclRaceHorse?: ScheduleCYLAOthSrcExclRaceHorse;
    OthSrcRaceHorse?:     ScheduleCYLAOthSrcRaceHorse;
    STCG15Per:            ScheduleCYLASTCG15Per;
    STCG30Per:            ScheduleCYLASTCG30Per;
    STCGAppRate:          ScheduleCYLASTCGAppRate;
    STCGDTAARate:         ScheduleCYLASTCGDTAARate;
    Salary?:              ScheduleCYLASalary;
    TotalCurYr:           TotalCurYr;
    TotalLossSetOff:      TotalLossSetOff;
}

export interface ScheduleCYLAHP {
    IncCYLA: HPIncCYLA;
}

export interface HPIncCYLA {
    IncOfCurYrAfterSetOff: number;
    /**
     * Fill positive or zero value only
     */
    IncOfCurYrUnderThatHead:      number;
    OthSrcLossNoRaceHorseSetoff?: number;
}

export interface ScheduleCYLALTCG10Per {
    IncCYLA: IncCYLA;
}

export interface IncCYLA {
    HPlossCurYrSetoff?:    number;
    IncOfCurYrAfterSetOff: number;
    /**
     * Income of current year (Fill this column only if income is zero or positive)
     */
    IncOfCurYrUnderThatHead:      number;
    OthSrcLossNoRaceHorseSetoff?: number;
}

export interface ScheduleCYLALTCG20Per {
    IncCYLA: IncCYLA;
}

export interface ScheduleCYLALTCGDTAARate {
    IncCYLA: IncCYLA;
}

export interface LossRemAftSetOff {
    BalHPlossCurYrAftSetoff:           number;
    BalOthSrcLossNoRaceHorseAftSetoff: number;
}

export interface ScheduleCYLAOthSrcExclRaceHorse {
    IncCYLA: OthSrcExclRaceHorseIncCYLA;
}

export interface OthSrcExclRaceHorseIncCYLA {
    HPlossCurYrSetoff?:    number;
    IncOfCurYrAfterSetOff: number;
    /**
     * Fill positive or zero value only
     */
    IncOfCurYrUnderThatHead: number;
}

export interface ScheduleCYLAOthSrcRaceHorse {
    IncCYLA: IncCYLA;
}

export interface ScheduleCYLASTCG15Per {
    IncCYLA: IncCYLA;
}

export interface ScheduleCYLASTCG30Per {
    IncCYLA: IncCYLA;
}

export interface ScheduleCYLASTCGAppRate {
    IncCYLA: IncCYLA;
}

export interface ScheduleCYLASTCGDTAARate {
    IncCYLA: IncCYLA;
}

export interface ScheduleCYLASalary {
    IncCYLA: IncCYLA;
}

export interface TotalCurYr {
    TotHPlossCurYr:           number;
    TotOthSrcLossNoRaceHorse: number;
}

export interface TotalLossSetOff {
    TotHPlossCurYrSetoff:           number;
    TotOthSrcLossNoRaceHorseSetoff: number;
}

export interface ScheduleEI {
    ExcNetAgriInc?:           ExcNetAgriInc;
    ExpIncAgri?:              number;
    GrossAgriRecpt?:          number;
    IncNotChrgblAsPerDTAA?:   IncNotChrgblAsPerDTAA;
    IncNotChrgblToTax:        number;
    InterestInc?:             number;
    NetAgriIncOrOthrIncRule7: number;
    Others:                   number;
    OthersInc?:               ScheduleEIOthersInc;
    PassThrIncNotChrgblTax?:  number;
    TotalExemptInc:           number;
    UnabAgriLossPrev8?:       number;
}

export interface ExcNetAgriInc {
    ExcNetAgriIncDtls?: ExcNetAgriIncDtls[];
}

export interface ExcNetAgriIncDtls {
    /**
     * IRG - Irrigated; RF - Rain-fed
     */
    AgriLandIrrigatedFlag: AgriLandIrrigatedFlag;
    /**
     * O - Owned; H - Held on lease
     */
    AgriLandOwnedFlag: AgriLandOwnedFlag;
    MeasurementOfLand: number;
    NameOfDistrict:    string;
    PinCode:           number;
}

/**
 * IRG - Irrigated; RF - Rain-fed
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum AgriLandIrrigatedFlag {
    Irg = "IRG",
    RF = "RF",
}

/**
 * O - Owned; H - Held on lease
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum AgriLandOwnedFlag {
    H = "H",
    O = "O",
}

export interface IncNotChrgblAsPerDTAA {
    IncNotChrgblAsPerDTAADtls?: IncNotChrgblAsPerDTAADtls[];
}

export interface IncNotChrgblAsPerDTAADtls {
    AmountOfIncome:            number;
    ArticleOfDTAA:             string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gain; OS - Other sources
     */
    HeadOfIncome:   HeadOfIncome;
    NatureOfIncome: string;
    /**
     * Y - Yes; N - No
     */
    TRCFlag: TaxRescertifiedFlag;
}

/**
 * SA - Salary; HP - House Property; CG - Capital Gain; OS - Other sources
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum HeadOfIncome {
    CG = "CG",
    HP = "HP",
    OS = "OS",
    Sa = "SA",
}

export interface ScheduleEIOthersInc {
    OthersIncDtls?: OthersIncDtlEI[];
}

export interface OthersIncDtlEI {
    /**
     * 10(10BC): Sec 10(10BC)-Any amount from the Central/State Govt./local authority by way of
     * compensation on account of any disaster; 10(10D) : Sec 10(10D)- Any sum received under a
     * life insurance policy except mentioned in sub-clause (a) to (d); 10(11) : Sec
     * 10(11)-Statuory Provident Fund received; 10(12) : Sec 10(12)-Recognised Provident Fund
     * received; 10(12C) : Sec 10(12C)-Any payment from the Agniveer Corpus Fund to a person
     * enrolled under the Agnipath Scheme, or to his nominee.; 10(13) : Sec 10(13)-Approved
     * superannuation fund received; 10(16) : Sec 10(16)-Scholarships granted to meet the cost
     * of education; 10(17) : Sec 10(17)-Allownace MP/MLA/MLC; 10(17A) : Sec 10(17A)-Award
     * instituted by Government; 10(18) : Sec 10(18)-Pension received by winner of Param Vir
     * Chakra or Maha Vir Chakra or Vir Chakra or such other gallantry award; DMDP : Defense
     * medical disability pension; 10(19) : Sec 10(19)-Armed Forces Family pension in case of
     * death during operational duty; 10(26) : Sec 10(26)-Any income as referred to in section
     * 10(26); 10(26AAA): Sec 10(26AAA)-Any income as referred to in section 10(26AAA); OTH :
     * Any Other
     */
    NatureDesc:   PurpleNatureDesc;
    OthAmount:    number;
    OthNatOfInc?: string;
}

/**
 * 10(10BC): Sec 10(10BC)-Any amount from the Central/State Govt./local authority by way of
 * compensation on account of any disaster; 10(10D) : Sec 10(10D)- Any sum received under a
 * life insurance policy except mentioned in sub-clause (a) to (d); 10(11) : Sec
 * 10(11)-Statuory Provident Fund received; 10(12) : Sec 10(12)-Recognised Provident Fund
 * received; 10(12C) : Sec 10(12C)-Any payment from the Agniveer Corpus Fund to a person
 * enrolled under the Agnipath Scheme, or to his nominee.; 10(13) : Sec 10(13)-Approved
 * superannuation fund received; 10(16) : Sec 10(16)-Scholarships granted to meet the cost
 * of education; 10(17) : Sec 10(17)-Allownace MP/MLA/MLC; 10(17A) : Sec 10(17A)-Award
 * instituted by Government; 10(18) : Sec 10(18)-Pension received by winner of Param Vir
 * Chakra or Maha Vir Chakra or Vir Chakra or such other gallantry award; DMDP : Defense
 * medical disability pension; 10(19) : Sec 10(19)-Armed Forces Family pension in case of
 * death during operational duty; 10(26) : Sec 10(26)-Any income as referred to in section
 * 10(26); 10(26AAA): Sec 10(26AAA)-Any income as referred to in section 10(26AAA); OTH :
 * Any Other
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PurpleNatureDesc {
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

/**
 * Tax deferred on ESOP : Information related to Tax deferred - relatable to income on
 * perquisites referred in section 17(2)(vi) received from employer, being an eligible
 * start-up referred to in section 80-IAC
 */
export interface ScheduleESOP {
    DPIITRegNo:             string;
    PanofStartUp:           string;
    ScheduleESOP2122_Type?: ScheduleESOP2122Type;
    ScheduleESOP2223_Type?: ScheduleESOP2223Type;
    ScheduleESOP2324_Type?: ScheduleESOP2324Type;
    ScheduleESOP2425_Type?: ScheduleESOP2425Type;
    TotalTaxAttributedAmt:  number;
}

export interface ScheduleESOP2122Type {
    AssessmentYear:           string;
    BalanceTaxCF?:            number;
    ScheduleESOPEventDtls?:   ScheduleESOPEventDtls;
    TaxDeferredBFEarlierAY?:  number;
    TaxPayableCurrentAY?:     number;
    TotalTaxAttributedAmt21?: number;
}

export interface ScheduleESOPEventDtls {
    /**
     * Y-YES; N-NO
     */
    CeasedEmployee?: TaxRescertifiedFlag;
    /**
     * Date in YYYY-MM-DD format
     */
    DateOfCeasing?:             string;
    ScheduleESOPEventDtlsType?: ScheduleESOPEventDtlsType[];
    /**
     * FS -  Fully Sold; PS - Partly Sold; NS - Not sold
     */
    SecurityType?: SecurityType;
}

export interface ScheduleESOPEventDtlsType {
    /**
     * Date in YYYY-MM-DD format
     */
    Date?:             string;
    TaxAttributedAmt?: number;
}

/**
 * FS -  Fully Sold; PS - Partly Sold; NS - Not sold
 */
export enum SecurityType {
    FS = "FS",
    NS = "NS",
    PS = "PS",
}

export interface ScheduleESOP2223Type {
    AssessmentYear:           string;
    BalanceTaxCF?:            number;
    ScheduleESOPEventDtls?:   ScheduleESOPEventDtls;
    TaxDeferredBFEarlierAY?:  number;
    TaxPayableCurrentAY?:     number;
    TotalTaxAttributedAmt22?: number;
}

export interface ScheduleESOP2324Type {
    AssessmentYear:           string;
    BalanceTaxCF?:            number;
    ScheduleESOPEventDtls?:   ScheduleESOPEventDtls;
    TaxDeferredBFEarlierAY?:  number;
    TaxPayableCurrentAY?:     number;
    TotalTaxAttributedAmt23?: number;
}

export interface ScheduleESOP2425Type {
    AssessmentYear: string;
    BalanceTaxCF?:  number;
}

/**
 * Details of Foreign Assets
 */
export interface ScheduleFA {
    DetailsFinancialInterest?:           DetailsFinancialInterest[];
    DetailsForiegnBank?:                 DetailsForiegnBank[];
    DetailsImmovableProperty?:           DetailsImmovableProperty[];
    DetailsOfAccntsHvngSigningAuth?:     DetailsOfAccntsHvngSigningAuth[];
    DetailsOfOthSourcesIncOutsideIndia?: DetailsOfOthSourcesIncOutsideIndia[];
    DetailsOfTrustOutIndiaTrustee?:      DetailsOfTrustOutIndiaTrustee[];
    DetailsOthAssets?:                   DetailsOthAssets[];
    DtlsForeignCashValueInsurance?:      DtlsForeignCashValueInsurance[];
    DtlsForeignCustodialAcc?:            DtlsForeignCustodialAcc[];
    DtlsForeignEquityDebtInterest?:      DtlsForeignEquityDebtInterest[];
}

/**
 * Details Of Financial Interest
 */
export interface DetailsFinancialInterest {
    AddressOfEntity:           string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateHeld:   string;
    IncFromInt: number;
    IncTaxAmt:  number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
     * Income; NI - No Income during the year
     */
    IncTaxSch:       IncTaxSch;
    IncTaxSchNo:     string;
    NameOfEntity:    string;
    NatureOfEntity?: string;
    NatureOfInc:     string;
    NatureOfInt:     NatureOfInt;
    TotalInvestment: number;
    ZipCode:         string;
}

/**
 * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
 * Income; NI - No Income during the year
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum IncTaxSch {
    CG = "CG",
    Ei = "EI",
    HP = "HP",
    NI = "NI",
    OS = "OS",
    Sa = "SA",
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum NatureOfInt {
    BeneficialOwner = "BENEFICIAL_OWNER",
    Benificiary = "BENIFICIARY",
    Direct = "DIRECT",
}

/**
 * Details Of Foreign Bank
 */
export interface DetailsForiegnBank {
    /**
     * Date in YYYY-MM-DD format
     */
    AccOpenDate:               string;
    AddressOfBank:             string;
    Bankname:                  string;
    ClosingBalance:            number;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    ForeignAccountNumber:      string;
    IntrstAccured:             number;
    OwnerStatus:               OwnerStatus;
    PeakBalanceDuringYear:     number;
    ZipCode:                   string;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum OwnerStatus {
    BeneficialOwner = "BENEFICIAL_OWNER",
    Benificiary = "BENIFICIARY",
    Owner = "OWNER",
}

/**
 * Details Of Immovable Property
 */
export interface DetailsImmovableProperty {
    AddressOfProperty?:        string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateOfAcq:      string;
    IncDrvProperty: number;
    IncTaxAmt:      number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
     * Income; NI - No Income during the year
     */
    IncTaxSch:       IncTaxSch;
    IncTaxSchNo:     string;
    NatureOfInc:     string;
    Ownership:       NatureOfInt;
    TotalInvestment: number;
    ZipCode:         string;
}

/**
 * Details of account(s) in which you have signing authority and which has not been included
 * above.
 */
export interface DetailsOfAccntsHvngSigningAuth {
    AddressOfInstitution:      string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    IncAccuredInAcc?:          number;
    /**
     * Y - Yes; N - No
     */
    IncAccuredTaxFlag: TaxRescertifiedFlag;
    IncOfferedAmt?:    number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
     * Income; NI - No Income during the year
     */
    IncOfferedSch?:           IncTaxSch;
    IncOfferedSchNo?:         string;
    InstitutionAccountNumber: string;
    NameMentionedInAccnt:     string;
    NameOfInstitution:        string;
    PeakBalanceOrInvestment:  number;
    ZipCode:                  string;
}

/**
 * Details of any other income derived from any; source outside India
 */
export interface DetailsOfOthSourcesIncOutsideIndia {
    AddressOfPerson:           string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    IncDerived?:               number;
    /**
     * Y - Yes; N - No
     */
    IncDrvTaxFlag:  TaxRescertifiedFlag;
    IncOfferedAmt?: number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
     * Income; NI - No Income during the year
     */
    IncOfferedSch?:   IncTaxSch;
    IncOfferedSchNo?: string;
    NameOfPerson:     string;
    NatureOfInc:      string;
    ZipCode:          string;
}

export interface DetailsOfTrustOutIndiaTrustee {
    AddressOfBeneficiaries:    string;
    AddressOfOtherTrustees:    string;
    AddressOfSettlor:          string;
    AddressOfTrust:            string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateHeld:         string;
    IncDrvFromTrust?: number;
    /**
     * Y - Yes; N - No
     */
    IncDrvTaxFlag:  TaxRescertifiedFlag;
    IncOfferedAmt?: number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
     * Income; NI - No Income during the year
     */
    IncOfferedSch?:      IncTaxSch;
    IncOfferedSchNo?:    string;
    NameOfBeneficiaries: string;
    NameOfOtherTrustees: string;
    NameOfSettlor:       string;
    NameOfTrust:         string;
    ZipCode:             string;
}

/**
 * Details Of Other Asset
 */
export interface DetailsOthAssets {
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateOfAcq:   string;
    IncDrvAsset: number;
    IncTaxAmt:   number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gains; OS - Other Sources; EI - Exempt
     * Income; NI - No Income during the year
     */
    IncTaxSch:       IncTaxSch;
    IncTaxSchNo:     string;
    NatureOfAsset:   string;
    NatureOfInc:     string;
    Ownership:       NatureOfInt;
    TotalInvestment: number;
    ZipCode:         string;
}

/**
 * Details Of Foreign Equity and Debt Interest held
 */
export interface DtlsForeignCashValueInsurance {
    CashValOrSurrenderVal: number;
    /**
     * Date in YYYY-MM-DD format
     */
    ContractDate:              string;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    FinancialInstAddress:      string;
    FinancialInstName:         string;
    TotGrossAmtPaidCredited:   number;
    ZipCode:                   string;
}

/**
 * Details of Foreign Custodial Accounts
 */
export interface DtlsForeignCustodialAcc {
    /**
     * Date in YYYY-MM-DD format
     */
    AccOpenDate:               string;
    AccountNumber:             string;
    ClosingBalance:            number;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    FinancialInstAddress:      string;
    FinancialInstName:         string;
    GrossAmtPaidCredited:      number;
    /**
     * I - Interest; D - Dividend; S - Proceeds from sale or redemption of financial assets; O -
     * Other income; N - No Amount paid/credited
     */
    NatureOfAmount:          NatureOfAmount;
    PeakBalanceDuringPeriod: number;
    Status:                  OwnerStatus;
    ZipCode:                 string;
}

/**
 * I - Interest; D - Dividend; S - Proceeds from sale or redemption of financial assets; O -
 * Other income; N - No Amount paid/credited
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum NatureOfAmount {
    D = "D",
    I = "I",
    N = "N",
    O = "O",
    S = "S",
}

/**
 * Details Of Foreign Equity and Debt Interest held
 */
export interface DtlsForeignEquityDebtInterest {
    AddressOfEntity:           string;
    ClosingBalance:            number;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    InitialValOfInvstmnt:      number;
    /**
     * Date in YYYY-MM-DD format
     */
    InterestAcquiringDate:   string;
    NameOfEntity:            string;
    NatureOfEntity:          string;
    PeakBalanceDuringPeriod: number;
    TotGrossAmtPaidCredited: number;
    TotGrossProceeds:        number;
    ZipCode:                 string;
}

export interface ScheduleFSI {
    ScheduleFSIDtls?: ScheduleFSIDtls[];
}

export interface ScheduleFSIDtls {
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    IncCapGain:                ScheduleFSIIncType;
    IncFromHP:                 ScheduleFSIIncType;
    IncFromSal:                ScheduleFSIIncType;
    IncOthSrc:                 ScheduleFSIIncType;
    TaxIdentificationNo:       string;
    TotalCountryWise:          TotalScheduleFSIIncType;
}

export interface ScheduleFSIIncType {
    DTAAReliefUs90or90A?: string;
    IncFrmOutsideInd:     number;
    TaxPaidOutsideInd:    number;
    TaxPayableinInd:      number;
    TaxReliefinInd:       number;
}

export interface TotalScheduleFSIIncType {
    IncFrmOutsideInd:  number;
    TaxPaidOutsideInd: number;
    TaxPayableinInd:   number;
    TaxReliefinInd:    number;
}

/**
 * Income from house property
 */
export interface ScheduleHP {
    PassThroghIncome?: number;
    PropertyDetails?:  PropertyDetails[];
    /**
     * House Property income
     */
    TotalIncomeChargeableUnHP: number;
}

/**
 * Individual property details
 */
export interface PropertyDetails {
    AddressDetailWithZipCode: AddressDetailWithZipCode;
    AsseseeShareProperty:     number;
    CoOwners?:                CoOwners[];
    HPSNo:                    number;
    /**
     * Property co-owned by other than the taxpayer (if please enter following details)
     */
    PropCoOwnedFlg: AssetOutIndiaFlag;
    /**
     * SE - Self; MI - Minor; SP - Spouse; OT - Others
     */
    PropertyOwner:       PropertyOwner;
    PropertyOwnerOther?: string;
    Rentdetails:         Rentdetails;
    TenantDetails?:      TenantDetails[];
    /**
     * L - Let Out; D - Deemed let out; S - Self Occupied
     */
    ifLetOut: IfLetOut;
}

export interface AddressDetailWithZipCode {
    AddrDetail:           string;
    CityOrTownOrDistrict: string;
    CountryCode:          CountryCode;
    PinCode?:             number;
    StateCode:            StateCode;
    ZipCode?:             string;
}

export interface CoOwners {
    Aadhaar_CoOwner?:      string;
    CoOwnersSNo:           number;
    NameCoOwner:           string;
    PAN_CoOwner?:          string;
    PercentShareProperty?: number;
}

/**
 * SE - Self; MI - Minor; SP - Spouse; OT - Others
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PropertyOwner {
    Mi = "MI",
    Ot = "OT",
    SE = "SE",
    SP = "SP",
}

/**
 * Rent Details
 */
export interface Rentdetails {
    AnnualLetableValue:         number;
    AnnualOfPropOwned:          number;
    ArrearsUnrealizedRentRcvd?: number;
    BalanceALV:                 number;
    IncomeOfHP:                 number;
    /**
     * Interest payable on borrowed capital
     */
    IntOnBorwCap?:          number;
    LocalTaxes?:            number;
    RentNotRealized?:       number;
    ThirtyPercentOfBalance: number;
    /**
     * Interest plus 30% of annual value
     */
    TotalDeduct:           number;
    TotalUnrealizedAndTax: number;
}

export interface TenantDetails {
    AadhaarofTenant?: string;
    NameofTenant:     string;
    PANTANofTenant?:  string;
    PANofTenant?:     string;
    TenantSNo:        number;
}

/**
 * L - Let Out; D - Deemed let out; S - Self Occupied
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum IfLetOut {
    D = "D",
    L = "L",
    S = "S",
}

/**
 * Details of Advance Tax and Self Assessment Tax Payments of Income Tax
 */
export interface ScheduleIT {
    TaxPayment?:      TaxPayment[];
    TotalTaxPayments: number;
}

/**
 * Tax payment detail
 */
export interface TaxPayment {
    Amt:     number;
    BSRCode: string;
    /**
     * Date in YYYY-MM-DD format  on or after 2023-04-01
     */
    DateDep:      string;
    SrlNoOfChaln: number;
}

export interface ScheduleOS {
    /**
     * Dividend income taxable at DTAA rates
     */
    DividendDTAA: DateRangeType;
    /**
     * Dividend Income as per proviso to sec 115A(1)(a)(A) @10%  (Including PTI Income)
     */
    DividendIncUs115A1aA?: DateRangeType;
    /**
     * Dividend Income u/s 115A(1)(a)(i)  @ 20% (Including PTI Income)
     */
    DividendIncUs115A1ai: DateRangeType;
    /**
     * Dividend Income u/s 115AC @ 10%
     */
    DividendIncUs115AC: DateRangeType;
    /**
     * Dividend Income u/s 115ACA (1)(a) @ 10% (Including PTI Income)
     */
    DividendIncUs115ACA: DateRangeType;
    /**
     * Dividend Income (other than units referred to in section 115AB) u/s 115AD(1)(i) @ 20%
     * (Including PTI Income)
     */
    DividendIncUs115AD1i: DateRangeType;
    /**
     * Dividend Income referred in Sl.no.1a(i)
     */
    DividendIncUs115BBDA: DateRangeType;
    /**
     * Income from other sources
     */
    IncChargeable: number;
    /**
     * Income by way of winnings from lotteries, crossword puzzles, races, games, gambling,
     * betting etc. referred to in section 2(24)(ix)
     */
    IncFrmLottery: DateRangeType;
    /**
     * Income by way of winnings from online games u/s 115BBJ
     */
    IncFrmOnGames?:          DateRangeType;
    IncFromOwnHorse?:        IncFromOwnHorse;
    IncOthThanOwnRaceHorse?: IncOthThanOwnRaceHorse;
    /**
     * Income from retirement benefit account maintained in a notified country u/s 89A (Taxable
     * portion after reducing relief u/s 89A)
     */
    NOT89A:                DateRangeType;
    TotOthSrcNoRaceHorse?: number;
}

export interface IncFromOwnHorse {
    AmtNotDeductibleUs58?: number;
    BalanceOwnRaceHorse:   number;
    DeductSec57:           number;
    ProfitChargTaxUs59?:   number;
    Receipts:              number;
}

export interface IncOthThanOwnRaceHorse {
    Aggrtvaluewithoutcons562x:    number;
    AmtBrwdRepaidOnHundiUs69D:    number;
    AmtNotDeductibleUs58?:        number;
    AnyOtherIncome:               number;
    Anyotherpropinadeqcons562x:   number;
    Anyotherpropwithoutcons562x:  number;
    BalanceNoRaceHorse:           number;
    CashCreditsUs68:              number;
    Deductions:                   Deductions;
    Dividend22e?:                 number;
    DividendGross:                number;
    DividendOthThan22e?:          number;
    FamilyPension:                number;
    GrossIncChrgblTaxAtAppRate:   number;
    Immovpropinadeqcons562x:      number;
    Immovpropwithoutcons562x:     number;
    IncChargblSplRateOS?:         IncChargblSplRateOS;
    IncChargeableSpecialRates:    number;
    IncChrgblUs115BBE:            number;
    IncChrgblUs115BBJ?:           number;
    IncomeNotified89AOS:          number;
    IncomeNotified89ATypeOS?:     NOT89AType[];
    IncomeNotifiedOther89AOS?:    number;
    IncomeNotifiedPrYr89AOS?:     number;
    Increliefus89AOS?:            number;
    InterestGross:                number;
    IntrstFrmIncmTaxRefund:       number;
    IntrstFrmOthers:              number;
    IntrstFrmSavingBank:          number;
    IntrstFrmTermDeposit:         number;
    IntrstSec10XIFirstProviso?:   number;
    IntrstSec10XIIFirstProviso?:  number;
    IntrstSec10XIISecondProviso?: number;
    IntrstSec10XISecondProviso?:  number;
    LtryPzzlChrgblUs115BB:        number;
    NatofPassThrghIncome:         number;
    OthersGross:                  number;
    OthersGrossDtls?:             OthersGrossDtl[];
    OthersInc?:                   IncOthThanOwnRaceHorseOthersInc;
    PTIOthersGrossDtls?:          PTIOthersGrossDtl[];
    PassThrIncOSChrgblSplRate:    number;
    ProfitChargTaxUs59?:          number;
    RentFromMachPlantBldgs:       number;
    SumRecdPrYrBusTRU562xii?:     number;
    SumRecdPrYrLifIns562xiii?:    number;
    TaxAccumulatedBalRecPF:       TaxAccumulatedBALRecPF;
    Tot562x:                      number;
    UnDsclsdInvstmntsUs69B:       number;
    UnExplndExpndtrUs69C:         number;
    UnExplndInvstmntsUs69:        number;
    UnExplndMoneyUs69A:           number;
}

export interface Deductions {
    DeductionUs57iia: number;
    Depreciation:     number;
    Expenses:         number;
    IntExp57?:        number;
    TotDeductions:    number;
    UsrIntExp57?:     number;
}

export interface IncChargblSplRateOS {
    NRIOsDTAA?:             NRIincChrUsDTAA;
    TotalAmtTaxUsDTAASchOs: number;
}

export interface NRIincChrUsDTAA {
    NRIDTAADtlsSchOS?: NRIDTAADtlsSchO[];
}

export interface NRIDTAADtlsSchO {
    ApplicableRate?:           number;
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    DTAAamt:                   number;
    DTAAarticle:               string;
    /**
     * 56i:56(2)(i)- Dividends; 56:56(2)-Interest; 562iii : 56(2)(iii)-Rental income from
     * machinery, plants, buildings etc.; 562x : 56(2)(x) - Income under section 56(2)(x);
     * 5A1ai:115A(1)(a)(i)- Dividends interest and income from units purchase in foreign
     * currency; 5A1aA:115A(1)(a)(A)- Dividend in the case of non-resident received from a unit
     * in an International Financial Services Centre; 5A1aii:115A(1)(a)(ii)- Interest received
     * from govt/Indian Concerns received in Foreign Currency; 5A1aiia:115A(1) (a)(iia)
     * -Interest from Infrastructure Debt Fund; 5A1aiiaa:115A(1) (a)(iiaa) -Interest as per Sec.
     * 194LC; 5A1aiiab:115A(1) (a)(iiab) -Interest as per Sec. 194LD; 5A1aiiac: 115A(1)
     * (a)(iiac) -Interest as per Sec. 194LBA; 5A1aiii:115A(1) (a)(iii) -Income received in
     * respect of units of UTI purchased in foreign currency; 5A1bA:115A(1)(b)(A)- Income from
     * royalty or fees for technical services received from Government or Indian concern;
     * 5AD1i:115AD(1)(i) -Income (other than Dividend) received by an FII in respect of
     * securities (other than units as per Sec 115AB); 5AD1iDiv - 115AD(1)(i) - Income (being
     * dividend) received by an FII in respect of securities (other than units referred to in
     * section 115AB); 5AC1ab:115AC(1)(a) - Income by way of interest on bonds purchased in
     * foreign currency - non-resident; 5AC1abD - 115AC(1)(b) - Income by way of Dividend on
     * GDRs purchased in foreign currency - non-resident; 5AD1iP:115AD(1)(i) -Income received by
     * an FII in respect of bonds or government securities as per Sec 194LD; 5BBA:115BBA - Tax
     * on non-residents sportsmen or sports associations; 5BB:115BB (Winnings from lotteries,
     * puzzles, races, games etc.); 5BBJ: 115BBJ - Winnings from online games; 5BBC:115BBC -
     * Anonymous donations; 5BBG:115BBG - Tax on income from transfer of carbon credits.;
     * 5BBF:115BBF - Tax on income from transfer of carbon credits.; 5Ea:115E(a) -Investment
     * income; 5ACA1a:115ACA(1)(a) - Income from GDR purchased in foreign currency -resident;
     * PTI_5AD1i - PTI - Income received by an FII in respect of securities (other than units
     * referred to in section115AB); PTI_5AD1iP - PTI - Income received by an FII in respect of
     * bonds or government securities referred to in section 194LD; PTI_5BBF - PTI-Tax on income
     * from patent; PTI_5BBG - PTI - Tax on income from transfer of carbon credits; PTI_5Ea -
     * PTI - Investment income of a non-resident Indian; PTI_5ACA1a - PTI-Income from GDR
     * purchased in foreign currency in case of a resident employee of an Indian company,
     * engaged in knowledge based industry or service; PTI_5A1ai - PTI - Dividends in the case
     * of non-residents; PTI_5A1aA - PTI- Proviso to 115A(1)(a)(A) -Dividends in the case of
     * non-residents received from a unit in an International Financial  Services Centre;
     * PTI_5A1aii - PTI - Interest received in the case of non-residents; PTI_5A1aiia - PTI -
     * Interest received by non-resident from infrastructure debt fund; PTI_5A1aiiaa -PTI -
     * Income received by non-resident as referred in section 194LC; PTI_5A1aiiab -PTI - Income
     * received by non-resident as referred in section 194LD; PTI_5A1aiiac -PTI - Income
     * received by non-resident as referred in section 194LBA; PTI_5A1aiii - PTI - Income from
     * units purchased in foreign currency in the case of non-residents; PTI_5A1bA - PTI -
     * Income from royalty or fees for technical services received from Government or Indian
     * concern; PTI_5AC1ab - PTI-115AC(1)(a) -Income by way of interest on bonds purchased in
     * foreign currency - non-resident; PTI_5AC1abD - PTI-115AC(1)(b) - Income by way of
     * Dividend on GDRs purchased in foreign currency - non-resident; PTI_5BBA - PTI - Tax on
     * non-resident sportsmen or sports associations or entertainer; 5A1aiiaaP - 115A(1)
     * (a)(iiaa) -Interest as referred in proviso to section 194LC(1); PTI_5A1aiiaaP -
     * PTI-115A(1) (a)(iiaa) - Interest as referred in proviso to section 194LC(1); PTI_5AD1iDiv
     * - PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
     * (other than units referred to in section 115AB)
     */
    ItemNoincl:           NRIDTAADtlsSchOItemNoincl;
    NatureOfIncome:       NatureOfIncome;
    RateAsPerITAct:       number;
    RateAsPerTreaty:      number;
    TaxRescertifiedFlag?: TaxRescertifiedFlag;
}

/**
 * 56i:56(2)(i)- Dividends; 56:56(2)-Interest; 562iii : 56(2)(iii)-Rental income from
 * machinery, plants, buildings etc.; 562x : 56(2)(x) - Income under section 56(2)(x);
 * 5A1ai:115A(1)(a)(i)- Dividends interest and income from units purchase in foreign
 * currency; 5A1aA:115A(1)(a)(A)- Dividend in the case of non-resident received from a unit
 * in an International Financial Services Centre; 5A1aii:115A(1)(a)(ii)- Interest received
 * from govt/Indian Concerns received in Foreign Currency; 5A1aiia:115A(1) (a)(iia)
 * -Interest from Infrastructure Debt Fund; 5A1aiiaa:115A(1) (a)(iiaa) -Interest as per Sec.
 * 194LC; 5A1aiiab:115A(1) (a)(iiab) -Interest as per Sec. 194LD; 5A1aiiac: 115A(1)
 * (a)(iiac) -Interest as per Sec. 194LBA; 5A1aiii:115A(1) (a)(iii) -Income received in
 * respect of units of UTI purchased in foreign currency; 5A1bA:115A(1)(b)(A)- Income from
 * royalty or fees for technical services received from Government or Indian concern;
 * 5AD1i:115AD(1)(i) -Income (other than Dividend) received by an FII in respect of
 * securities (other than units as per Sec 115AB); 5AD1iDiv - 115AD(1)(i) - Income (being
 * dividend) received by an FII in respect of securities (other than units referred to in
 * section 115AB); 5AC1ab:115AC(1)(a) - Income by way of interest on bonds purchased in
 * foreign currency - non-resident; 5AC1abD - 115AC(1)(b) - Income by way of Dividend on
 * GDRs purchased in foreign currency - non-resident; 5AD1iP:115AD(1)(i) -Income received by
 * an FII in respect of bonds or government securities as per Sec 194LD; 5BBA:115BBA - Tax
 * on non-residents sportsmen or sports associations; 5BB:115BB (Winnings from lotteries,
 * puzzles, races, games etc.); 5BBJ: 115BBJ - Winnings from online games; 5BBC:115BBC -
 * Anonymous donations; 5BBG:115BBG - Tax on income from transfer of carbon credits.;
 * 5BBF:115BBF - Tax on income from transfer of carbon credits.; 5Ea:115E(a) -Investment
 * income; 5ACA1a:115ACA(1)(a) - Income from GDR purchased in foreign currency -resident;
 * PTI_5AD1i - PTI - Income received by an FII in respect of securities (other than units
 * referred to in section115AB); PTI_5AD1iP - PTI - Income received by an FII in respect of
 * bonds or government securities referred to in section 194LD; PTI_5BBF - PTI-Tax on income
 * from patent; PTI_5BBG - PTI - Tax on income from transfer of carbon credits; PTI_5Ea -
 * PTI - Investment income of a non-resident Indian; PTI_5ACA1a - PTI-Income from GDR
 * purchased in foreign currency in case of a resident employee of an Indian company,
 * engaged in knowledge based industry or service; PTI_5A1ai - PTI - Dividends in the case
 * of non-residents; PTI_5A1aA - PTI- Proviso to 115A(1)(a)(A) -Dividends in the case of
 * non-residents received from a unit in an International Financial  Services Centre;
 * PTI_5A1aii - PTI - Interest received in the case of non-residents; PTI_5A1aiia - PTI -
 * Interest received by non-resident from infrastructure debt fund; PTI_5A1aiiaa -PTI -
 * Income received by non-resident as referred in section 194LC; PTI_5A1aiiab -PTI - Income
 * received by non-resident as referred in section 194LD; PTI_5A1aiiac -PTI - Income
 * received by non-resident as referred in section 194LBA; PTI_5A1aiii - PTI - Income from
 * units purchased in foreign currency in the case of non-residents; PTI_5A1bA - PTI -
 * Income from royalty or fees for technical services received from Government or Indian
 * concern; PTI_5AC1ab - PTI-115AC(1)(a) -Income by way of interest on bonds purchased in
 * foreign currency - non-resident; PTI_5AC1abD - PTI-115AC(1)(b) - Income by way of
 * Dividend on GDRs purchased in foreign currency - non-resident; PTI_5BBA - PTI - Tax on
 * non-resident sportsmen or sports associations or entertainer; 5A1aiiaaP - 115A(1)
 * (a)(iiaa) -Interest as referred in proviso to section 194LC(1); PTI_5A1aiiaaP -
 * PTI-115A(1) (a)(iiaa) - Interest as referred in proviso to section 194LC(1); PTI_5AD1iDiv
 * - PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
 * (other than units referred to in section 115AB)
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum NRIDTAADtlsSchOItemNoincl {
    PTI5A1AA = "PTI_5A1aA",
    PTI5A1AI = "PTI_5A1ai",
    PTI5A1Aii = "PTI_5A1aii",
    PTI5A1Aiia = "PTI_5A1aiia",
    PTI5A1Aiiaa = "PTI_5A1aiiaa",
    PTI5A1AiiaaP = "PTI_5A1aiiaaP",
    PTI5A1Aiiab = "PTI_5A1aiiab",
    PTI5A1Aiiac = "PTI_5A1aiiac",
    PTI5A1Aiii = "PTI_5A1aiii",
    PTI5A1BA = "PTI_5A1bA",
    PTI5AC1Ab = "PTI_5AC1ab",
    PTI5AC1AbD = "PTI_5AC1abD",
    PTI5ACA1A = "PTI_5ACA1a",
    PTI5AD1I = "PTI_5AD1i",
    PTI5AD1IDiv = "PTI_5AD1iDiv",
    PTI5AD1IP = "PTI_5AD1iP",
    PTI5Ea = "PTI_5Ea",
    Pti5Bba = "PTI_5BBA",
    Pti5Bbf = "PTI_5BBF",
    Pti5Bbg = "PTI_5BBG",
    The56 = "56",
    The562Iii = "562iii",
    The562X = "562x",
    The56I = "56i",
    The5A1AA = "5A1aA",
    The5A1AI = "5A1ai",
    The5A1Aii = "5A1aii",
    The5A1Aiia = "5A1aiia",
    The5A1Aiiaa = "5A1aiiaa",
    The5A1AiiaaP = "5A1aiiaaP",
    The5A1Aiiab = "5A1aiiab",
    The5A1Aiiac = "5A1aiiac",
    The5A1Aiii = "5A1aiii",
    The5A1BA = "5A1bA",
    The5AC1Ab = "5AC1ab",
    The5AC1AbD = "5AC1abD",
    The5ACA1A = "5ACA1a",
    The5AD1I = "5AD1i",
    The5AD1IDiv = "5AD1iDiv",
    The5AD1IP = "5AD1iP",
    The5Bb = "5BB",
    The5Bba = "5BBA",
    The5Bbc = "5BBC",
    The5Bbf = "5BBF",
    The5Bbg = "5BBG",
    The5Bbj = "5BBJ",
    The5Ea = "5Ea",
}

export enum NatureOfIncome {
    The1A = "1a",
    The1B = "1b",
    The1C = "1c",
    The1D = "1d",
    The2AI = "2ai",
    The2Aii = "2aii",
    The2D = "2d",
    The2E = "2e",
}

export interface NOT89AType {
    NOT89AAmount: number;
    /**
     * US - United States; UK - United Kingdom; CA - Canada
     */
    NOT89ACountrycode: NOT89ACountrycode;
}

/**
 * US - United States; UK - United Kingdom; CA - Canada
 */
export enum NOT89ACountrycode {
    CA = "CA",
    Uk = "UK",
    Us = "US",
}

export interface OthersGrossDtl {
    SourceAmount?: number;
    /**
     * 5A1ai - 115A(1)(a)(i)- Dividends interest and income from units purchase in foreign
     * currency; 5A1aA - 115A(1)(a)(A)- Dividend in the case of non-resident received from a
     * unit in an International Financial  Services Centre; 5A1aii - 115A(1)(a)(ii)- Interest
     * received from govt/Indian Concerns received in Foreign Currency; 5A1aiia - 115A(1)
     * (a)(iia) -Interest from Infrastructure Debt Fund; 5A1aiiaa - 115A(1) (a)(iiaa) -Interest
     * as per Sec. 194LC(1); 5A1aiiab - 115A(1) (a)(iiab) -Interest as per Sec. 194LD; 5A1aiiac
     * - 115A(1) (a)(iiac) -Interest as per Sec. 194LBA; 5A1aiii - 115A(1) (a)(iii) -Income
     * received in respect of units of UTI purchased in foreign currency; 5A1bA - 115A(1)(b)(A)
     * & 115A(1)(b)(B)- Income from royalty & technical services; 5AC1ab - 115AC(1)(a) - Income
     * by way of interest on bonds purchased in foreign currency - non-resident; 5AC1abD -
     * 115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency -
     * non-resident; 5ACA1a - 115ACA(1)(a) - Income from GDR purchased in foreign currency
     * -resident; 5AD1i - 115AD(1)(i) -Income (other than Dividend) received by an FII in
     * respect of securities (other than units as per Sec 115AB); 5AD1iP - 115AD(1)(i) -Income
     * received by an FII in respect of bonds or government securities as per Sec 194LD; 5BBA -
     * 115BBA - Tax on non-residents sportsmen or sports associations; 5A1aiiaaP - 115A(1)
     * (a)(iiaa) -Interest as referred in proviso to section 194LC(1); 5BBF - 115BBF - Tax on
     * income from patent; 5BBG - 115BBG - Tax on income from transfer of carbon credits; 5BBC -
     * 115BBC - Anonymous donations; 5Ea - 115E(a) - Investment income; 5AD1iDiv - 115AD(1)(i) -
     * Income (being dividend) received by an FII in respect of securities (other than units
     * referred to in section 115AB)
     */
    SourceDescription: OthersGrossDtlSourceDescription;
}

/**
 * 5A1ai - 115A(1)(a)(i)- Dividends interest and income from units purchase in foreign
 * currency; 5A1aA - 115A(1)(a)(A)- Dividend in the case of non-resident received from a
 * unit in an International Financial  Services Centre; 5A1aii - 115A(1)(a)(ii)- Interest
 * received from govt/Indian Concerns received in Foreign Currency; 5A1aiia - 115A(1)
 * (a)(iia) -Interest from Infrastructure Debt Fund; 5A1aiiaa - 115A(1) (a)(iiaa) -Interest
 * as per Sec. 194LC(1); 5A1aiiab - 115A(1) (a)(iiab) -Interest as per Sec. 194LD; 5A1aiiac
 * - 115A(1) (a)(iiac) -Interest as per Sec. 194LBA; 5A1aiii - 115A(1) (a)(iii) -Income
 * received in respect of units of UTI purchased in foreign currency; 5A1bA - 115A(1)(b)(A)
 * & 115A(1)(b)(B)- Income from royalty & technical services; 5AC1ab - 115AC(1)(a) - Income
 * by way of interest on bonds purchased in foreign currency - non-resident; 5AC1abD -
 * 115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency -
 * non-resident; 5ACA1a - 115ACA(1)(a) - Income from GDR purchased in foreign currency
 * -resident; 5AD1i - 115AD(1)(i) -Income (other than Dividend) received by an FII in
 * respect of securities (other than units as per Sec 115AB); 5AD1iP - 115AD(1)(i) -Income
 * received by an FII in respect of bonds or government securities as per Sec 194LD; 5BBA -
 * 115BBA - Tax on non-residents sportsmen or sports associations; 5A1aiiaaP - 115A(1)
 * (a)(iiaa) -Interest as referred in proviso to section 194LC(1); 5BBF - 115BBF - Tax on
 * income from patent; 5BBG - 115BBG - Tax on income from transfer of carbon credits; 5BBC -
 * 115BBC - Anonymous donations; 5Ea - 115E(a) - Investment income; 5AD1iDiv - 115AD(1)(i) -
 * Income (being dividend) received by an FII in respect of securities (other than units
 * referred to in section 115AB)
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum OthersGrossDtlSourceDescription {
    The5A1AA = "5A1aA",
    The5A1AI = "5A1ai",
    The5A1Aii = "5A1aii",
    The5A1Aiia = "5A1aiia",
    The5A1Aiiaa = "5A1aiiaa",
    The5A1AiiaaP = "5A1aiiaaP",
    The5A1Aiiab = "5A1aiiab",
    The5A1Aiiac = "5A1aiiac",
    The5A1Aiii = "5A1aiii",
    The5A1BA = "5A1bA",
    The5AC1Ab = "5AC1ab",
    The5AC1AbD = "5AC1abD",
    The5ACA1A = "5ACA1a",
    The5AD1I = "5AD1i",
    The5AD1IDiv = "5AD1iDiv",
    The5AD1IP = "5AD1iP",
    The5Bba = "5BBA",
    The5Bbc = "5BBC",
    The5Bbf = "5BBF",
    The5Bbg = "5BBG",
    The5Ea = "5Ea",
}

export interface IncOthThanOwnRaceHorseOthersInc {
    OthersIncDtls?: OthersIncDtlOS[];
}

export interface OthersIncDtlOS {
    OthAmount:   number;
    OthNatOfInc: string;
}

export interface PTIOthersGrossDtl {
    SourceAmount?: number;
    /**
     * PTI_5A1ai - PTI-115A(1)(a)(i)- Dividends interest and income from units purchase in
     * foreign currency; PTI_5A1aA - PTI-115A(1)(a)(A)- PTI-Dividends in the case of
     * non-residents received from a unit in an International Financial  Services Centre;
     * PTI_5A1aii - PTI-115A(1)(a)(ii)- Interest received from govt/Indian Concerns received in
     * Foreign Currency; PTI_5A1aiia - PTI-115A(1) (a)(iia) -Interest from Infrastructure Debt
     * Fund; PTI_5A1aiiaa - PTI-115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1); PTI_5A1aiiab -
     * PTI-115A(1) (a)(iiab) -Interest as per Sec. 194LD; PTI_5A1aiiac - PTI-115A(1) (a)(iiac)
     * -Interest as per Sec. 194LBA; PTI_5A1aiii - PTI-115A(1) (a)(iii) -Income received in
     * respect of units of UTI purchased in foreign currency; PTI_5A1bA - PTI-115A(1)(b)(A) &
     * PTI-115A(1)(b)(B)- Income from royalty & technical services; PTI_5AC1ab - PTI-115AC(1)(a)
     * - Income by way of interest on bonds purchased in foreign currency - non-resident;
     * PTI_5AC1abD - PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign
     * currency - non-resident; PTI_5ACA1a - PTI-115ACA(1)(a) - Income from GDR purchased in
     * foreign currency - resident; PTI_5AD1i - PTI-115AD(1)(i) -Income (other than dividend)
     * received by an FII in respect of securities (other than units as per Sec 115AB);
     * PTI_5AD1iP - PTI-115AD(1)(i) -Income received by an FII in respect of bonds or government
     * securities as per Sec 194LD; PTI_5BBA - PTI-115BBA - Tax on non-residents sportsmen or
     * sports associations; PTI_5BBF - PTI-115BBF - Tax on income from patent; PTI_5BBG -
     * PTI-115BBG - Tax on income from transfer of carbon credits; PTI_5A1aiiaaP - PTI-115A(1)
     * (a)(iiaa) - Interest as referred in proviso to section 194LC(1); PTI_5AD1iDiv -
     * PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
     * (other than units referred to in section 115AB)
     */
    SourceDescription: PTIOthersGrossDtlSourceDescription;
}

/**
 * PTI_5A1ai - PTI-115A(1)(a)(i)- Dividends interest and income from units purchase in
 * foreign currency; PTI_5A1aA - PTI-115A(1)(a)(A)- PTI-Dividends in the case of
 * non-residents received from a unit in an International Financial  Services Centre;
 * PTI_5A1aii - PTI-115A(1)(a)(ii)- Interest received from govt/Indian Concerns received in
 * Foreign Currency; PTI_5A1aiia - PTI-115A(1) (a)(iia) -Interest from Infrastructure Debt
 * Fund; PTI_5A1aiiaa - PTI-115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1); PTI_5A1aiiab -
 * PTI-115A(1) (a)(iiab) -Interest as per Sec. 194LD; PTI_5A1aiiac - PTI-115A(1) (a)(iiac)
 * -Interest as per Sec. 194LBA; PTI_5A1aiii - PTI-115A(1) (a)(iii) -Income received in
 * respect of units of UTI purchased in foreign currency; PTI_5A1bA - PTI-115A(1)(b)(A) &
 * PTI-115A(1)(b)(B)- Income from royalty & technical services; PTI_5AC1ab - PTI-115AC(1)(a)
 * - Income by way of interest on bonds purchased in foreign currency - non-resident;
 * PTI_5AC1abD - PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign
 * currency - non-resident; PTI_5ACA1a - PTI-115ACA(1)(a) - Income from GDR purchased in
 * foreign currency - resident; PTI_5AD1i - PTI-115AD(1)(i) -Income (other than dividend)
 * received by an FII in respect of securities (other than units as per Sec 115AB);
 * PTI_5AD1iP - PTI-115AD(1)(i) -Income received by an FII in respect of bonds or government
 * securities as per Sec 194LD; PTI_5BBA - PTI-115BBA - Tax on non-residents sportsmen or
 * sports associations; PTI_5BBF - PTI-115BBF - Tax on income from patent; PTI_5BBG -
 * PTI-115BBG - Tax on income from transfer of carbon credits; PTI_5A1aiiaaP - PTI-115A(1)
 * (a)(iiaa) - Interest as referred in proviso to section 194LC(1); PTI_5AD1iDiv -
 * PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
 * (other than units referred to in section 115AB)
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum PTIOthersGrossDtlSourceDescription {
    PTI5A1AA = "PTI_5A1aA",
    PTI5A1AI = "PTI_5A1ai",
    PTI5A1Aii = "PTI_5A1aii",
    PTI5A1Aiia = "PTI_5A1aiia",
    PTI5A1Aiiaa = "PTI_5A1aiiaa",
    PTI5A1AiiaaP = "PTI_5A1aiiaaP",
    PTI5A1Aiiab = "PTI_5A1aiiab",
    PTI5A1Aiiac = "PTI_5A1aiiac",
    PTI5A1Aiii = "PTI_5A1aiii",
    PTI5A1BA = "PTI_5A1bA",
    PTI5AC1Ab = "PTI_5AC1ab",
    PTI5AC1AbD = "PTI_5AC1abD",
    PTI5ACA1A = "PTI_5ACA1a",
    PTI5AD1I = "PTI_5AD1i",
    PTI5AD1IDiv = "PTI_5AD1iDiv",
    PTI5AD1IP = "PTI_5AD1iP",
    PTI5Ea = "PTI_5Ea",
    Pti5Bba = "PTI_5BBA",
    Pti5Bbf = "PTI_5BBF",
    Pti5Bbg = "PTI_5BBG",
}

export interface TaxAccumulatedBALRecPF {
    TaxAccmltdBalRecPFDtls?: TaxAccmltdBALRecPFDtl[];
    TotalIncomeBenefit:      number;
    TotalTaxBenefit:         number;
}

export interface TaxAccmltdBALRecPFDtl {
    AssessmentYear: AssessmentYear;
    IncomeBenefit:  number;
    TaxBenefit:     number;
}

/**
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum AssessmentYear {
    The200001 = "2000-01",
    The200102 = "2001-02",
    The200203 = "2002-03",
    The200304 = "2003-04",
    The200405 = "2004-05",
    The200506 = "2005-06",
    The200607 = "2006-07",
    The200708 = "2007-08",
    The200809 = "2008-09",
    The200910 = "2009-10",
    The201011 = "2010-11",
    The201112 = "2011-12",
    The201213 = "2012-13",
    The201314 = "2013-14",
    The201415 = "2014-15",
    The201516 = "2015-16",
    The201617 = "2016-17",
    The201718 = "2017-18",
    The201819 = "2018-19",
    The201920 = "2019-20",
    The202021 = "2020-21",
    The202122 = "2021-22",
    The202223 = "2022-23",
    The202324 = "2023-24",
}

export interface SchedulePTI {
    SchedulePTIDtls?: SchedulePTIDtls[];
}

export interface SchedulePTIDtls {
    BusinessName:    string;
    BusinessPAN:     string;
    CapitalGainsPTI: CapitalGainsPTI;
    IncClmdPTI:      IncClmdPTI;
    IncFromHP:       SchedulePTIType;
    IncOthSrc:       SchedulePTITypeOS23FBB;
    /**
     * A - 115UA; B - 115UB
     */
    InvstmntCvrdUs115UA115UB: string;
    OS_Dividend:              SchedulePTITypeOS23FBB;
    OS_Others:                SchedulePTITypeOS23FBB;
}

export interface CapitalGainsPTI {
    LTCG_Others:  SchedulePTIType;
    LTCG_Sec112A: SchedulePTIType;
    LongTermCG:   SchedulePTIType;
    STCG_Others:  SchedulePTIType;
    STCG_Sec111A: SchedulePTIType;
    ShortTermCG:  SchedulePTIType;
}

export interface SchedulePTIType {
    AmountOfInc:                number;
    CurrYrLossShareByInvstFund: number;
    NetIncomeLoss:              number;
    TDSAmount:                  number;
}

export interface IncClmdPTI {
    Sec23FBB:         SchedulePTITypeOS23FBB;
    SecBIncExmptDtl?: SchedulePTIIncExmtType;
    SecCIncExmptDtl?: SchedulePTIIncExmtType;
    TotalSec23FBB:    SchedulePTITypeOS23FBB;
}

export interface SchedulePTITypeOS23FBB {
    AmountOfInc:   number;
    NetIncomeLoss: number;
    TDSAmount:     number;
}

export interface SchedulePTIIncExmtType {
    SecBCIncExmptDtl: SchedulePTITypeOS23FBB;
    SectionCode:      string;
}

/**
 * Details of Income from salary
 */
export interface ScheduleS {
    AllwncExemptUs10?:         AllwncExemptUs10;
    AllwncExtentExemptUs10:    number;
    DeductionUS16:             number;
    DeductionUnderSection16ia: number;
    EntertainmntalwncUs16ii:   number;
    Increliefus89A?:           number;
    NetSalary:                 number;
    ProfessionalTaxUs16iii:    number;
    Salaries?:                 Salaries[];
    TotIncUnderHeadSalaries:   number;
    TotalGrossSalary:          number;
}

export interface AllwncExemptUs10 {
    AllwncExemptUs10Dtls?: AllwncExemptUs10DtlsType[];
}

export interface AllwncExemptUs10DtlsType {
    /**
     * 10(5) : Sec 10(5)-Leave Travel allowance; 10(6) : Sec 10(6)-Remuneration received as an
     * official, by whatever name called, of an embassy, high commission etc; 10(7) : Sec
     * 10(7)-Allowances or perquisites paid or allowed as such outside India by the Government
     * to a citizen of India for rendering service outside India; 10(10) : Sec
     * 10(10)-Death-cum-retirement gratuity received; 10(10A) : Sec 10(10A)-Commuted value of
     * pension received; 10(10AA): Sec 10(10AA)-Earned leave encashment; 10(10B)(i) - Sec
     * 10(10B)-First proviso - Compensation limit notified by CG in the Official Gazette;
     * 10(10B)(ii) - Sec 10(10B)-Second proviso - Compensation under scheme approved by the
     * Central Government; 10(10C) : Sec 10(10C)-Amount received on voluntary retirement or
     * termination of service; 10(10CC): Sec 10(10CC)-Tax paid by employer on non-monetary
     * perquisite; 10(13A) : Sec 10(13A)-House Rent Allowance; 10(14)(i) : Sec 10(14)-Allowances
     * or benefits not in a nature of perquisite specifically granted and incurred in
     * performance of duties of office or employment; 10(14)(ii) : Sec 10(14)-Allowances or
     * benefits not in a nature of perquisite specifically granted in performance of duties of
     * office or employment; 10(14)(i)(115BAC) - Sec 10(14)(i) -Allowances referred in
     * sub-clauses (a) to (c) of sub-rule (1) in Rule 2BB ; 10(14)(ii)(115BAC) - Sec 10(14)(ii)
     * -Transport allowance granted to certain physically handicapped assessee; EIC - Exempt
     * income received by a judge covered under the payment of salaries to Supreme Court/High
     * Court judges Act /Rules; OTH : Any Other
     */
    SalNatureDesc:   SalNatureDesc;
    SalOthAmount:    number;
    SalOthNatOfInc?: string;
}

/**
 * 10(5) : Sec 10(5)-Leave Travel allowance; 10(6) : Sec 10(6)-Remuneration received as an
 * official, by whatever name called, of an embassy, high commission etc; 10(7) : Sec
 * 10(7)-Allowances or perquisites paid or allowed as such outside India by the Government
 * to a citizen of India for rendering service outside India; 10(10) : Sec
 * 10(10)-Death-cum-retirement gratuity received; 10(10A) : Sec 10(10A)-Commuted value of
 * pension received; 10(10AA): Sec 10(10AA)-Earned leave encashment; 10(10B)(i) - Sec
 * 10(10B)-First proviso - Compensation limit notified by CG in the Official Gazette;
 * 10(10B)(ii) - Sec 10(10B)-Second proviso - Compensation under scheme approved by the
 * Central Government; 10(10C) : Sec 10(10C)-Amount received on voluntary retirement or
 * termination of service; 10(10CC): Sec 10(10CC)-Tax paid by employer on non-monetary
 * perquisite; 10(13A) : Sec 10(13A)-House Rent Allowance; 10(14)(i) : Sec 10(14)-Allowances
 * or benefits not in a nature of perquisite specifically granted and incurred in
 * performance of duties of office or employment; 10(14)(ii) : Sec 10(14)-Allowances or
 * benefits not in a nature of perquisite specifically granted in performance of duties of
 * office or employment; 10(14)(i)(115BAC) - Sec 10(14)(i) -Allowances referred in
 * sub-clauses (a) to (c) of sub-rule (1) in Rule 2BB ; 10(14)(ii)(115BAC) - Sec 10(14)(ii)
 * -Transport allowance granted to certain physically handicapped assessee; EIC - Exempt
 * income received by a judge covered under the payment of salaries to Supreme Court/High
 * Court judges Act /Rules; OTH : Any Other
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum SalNatureDesc {
    Eic = "EIC",
    Oth = "OTH",
    The1010 = "10(10)",
    The1010A = "10(10A)",
    The1010Aa = "10(10AA)",
    The1010BI = "10(10B)(i)",
    The1010BIi = "10(10B)(ii)",
    The1010C = "10(10C)",
    The1010Cc = "10(10CC)",
    The1013A = "10(13A)",
    The1014I = "10(14)(i)",
    The1014I115BAC = "10(14)(i)(115BAC)",
    The1014Ii = "10(14)(ii)",
    The1014Ii115BAC = "10(14)(ii)(115BAC)",
    The105 = "10(5)",
    The106 = "10(6)",
    The107 = "10(7)",
}

/**
 * Salaries
 */
export interface Salaries {
    AddressDetail: AddressDetail;
    /**
     * Name of the employer
     */
    NameOfEmployer: string;
    /**
     * CGOV:Central Government; SGOV:State Government; PSU:Public Sector Unit; PE:Pensioners -
     * Central Government, PESG:Pensioners - State Government, PEPS:Pensioners - Public sector
     * undertaking, PEO:Pensioners - Others; OTH:Others
     */
    NatureOfEmployment: NatureOfEmployment;
    Salarys:            Salarys;
    TANofEmployer?:     string;
}

export interface AddressDetail {
    AddrDetail:           string;
    CityOrTownOrDistrict: string;
    PinCode?:             number;
    StateCode:            StateCode;
    ZipCode?:             string;
}

/**
 * CGOV:Central Government; SGOV:State Government; PSU:Public Sector Unit; PE:Pensioners -
 * Central Government, PESG:Pensioners - State Government, PEPS:Pensioners - Public sector
 * undertaking, PEO:Pensioners - Others; OTH:Others
 */
export enum NatureOfEmployment {
    Cgov = "CGOV",
    Oth = "OTH",
    PE = "PE",
    PSU = "PSU",
    Peo = "PEO",
    Peps = "PEPS",
    Pesg = "PESG",
    Sgov = "SGOV",
}

export interface Salarys {
    GrossSalary:                   number;
    IncomeNotified89A:             number;
    IncomeNotified89AType?:        NOT89AType[];
    IncomeNotifiedOther89A:        number;
    IncomeNotifiedPrYr89A?:        number;
    NatureOfPerquisites?:          NatureOfPerquisites;
    NatureOfProfitInLieuOfSalary?: NatureOfProfitInLieuOfSalary;
    NatureOfSalary?:               NatureOfSalary;
    ProfitsinLieuOfSalary:         number;
    Salary:                        number;
    ValueOfPerquisites:            number;
}

export interface NatureOfPerquisites {
    OthersIncDtls?: NatureOfPerquisitesType[];
}

export interface NatureOfPerquisitesType {
    /**
     * 1 - Accommodation; 2 - Cars / Other Automotive; 3 - Sweeper, gardener, watchman or
     * personal attendant; 4 - Gas, electricity, water; 5 - Interest free or concessional loans;
     * 6 - Holiday expenses; 7 - Free or concessional travel; 8 - Free meals; 9 - Free
     * education; 10 - Gifts, vouchers, etc.; 11 - Credit card expenses; 12 - Club expenses; 13
     * - Use of movable assets by employees; 14 - Transfer of assets to employee; 15 - Value of
     * any other benefit/amenity/service/privilege; 16 - Stock options allotted or transferred
     * by employer being an eligible start-up referred to in section 80-IAC-Tax to be deferred;
     * 17 - Stock options (non-qualified options) other than ESOP in col 16 above.; 18 -
     * Contribution by employer to fund and scheme taxable under section 17(2)(vii); 19 - Annual
     * accretion by way of interest, dividend etc. to the balance at the credit of fund and
     * scheme referred to in section 17(2)(vii) and taxable under section 17(2)(viia); 21 -
     * Stock options allotted or transferred by employer being an eligible start-up referred to
     * in section 80-IAC-Tax not to be deferred; OTH - Other benefits or amenities
     */
    NatureDesc:   FluffyNatureDesc;
    OthAmount:    number;
    OthNatOfInc?: string;
}

/**
 * 1 - Accommodation; 2 - Cars / Other Automotive; 3 - Sweeper, gardener, watchman or
 * personal attendant; 4 - Gas, electricity, water; 5 - Interest free or concessional loans;
 * 6 - Holiday expenses; 7 - Free or concessional travel; 8 - Free meals; 9 - Free
 * education; 10 - Gifts, vouchers, etc.; 11 - Credit card expenses; 12 - Club expenses; 13
 * - Use of movable assets by employees; 14 - Transfer of assets to employee; 15 - Value of
 * any other benefit/amenity/service/privilege; 16 - Stock options allotted or transferred
 * by employer being an eligible start-up referred to in section 80-IAC-Tax to be deferred;
 * 17 - Stock options (non-qualified options) other than ESOP in col 16 above.; 18 -
 * Contribution by employer to fund and scheme taxable under section 17(2)(vii); 19 - Annual
 * accretion by way of interest, dividend etc. to the balance at the credit of fund and
 * scheme referred to in section 17(2)(vii) and taxable under section 17(2)(viia); 21 -
 * Stock options allotted or transferred by employer being an eligible start-up referred to
 * in section 80-IAC-Tax not to be deferred; OTH - Other benefits or amenities
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum FluffyNatureDesc {
    Oth = "OTH",
    The1 = "1",
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
    The2 = "2",
    The21 = "21",
    The3 = "3",
    The4 = "4",
    The5 = "5",
    The6 = "6",
    The7 = "7",
    The8 = "8",
    The9 = "9",
}

export interface NatureOfProfitInLieuOfSalary {
    OthersIncDtls?: NatureOfProfitInLieuOfSalaryType[];
}

export interface NatureOfProfitInLieuOfSalaryType {
    /**
     * 1 - Compensation due/received by an assessee from his employer or former employer in
     * connection with the termination of his employment or modification thereto; 2 - Any
     * payment due/received by an assessee from his employer or a former employer or from a
     * provident or other fund, sum received under Keyman Insurance Policy including Bonus
     * thereto; 3 - Any amount due/received by assessee from any person before joining or after
     * cessation of employment with that person; OTH - Any Other
     */
    NatureDesc:   TentacledNatureDesc;
    OthAmount:    number;
    OthNatOfInc?: string;
}

/**
 * 1 - Compensation due/received by an assessee from his employer or former employer in
 * connection with the termination of his employment or modification thereto; 2 - Any
 * payment due/received by an assessee from his employer or a former employer or from a
 * provident or other fund, sum received under Keyman Insurance Policy including Bonus
 * thereto; 3 - Any amount due/received by assessee from any person before joining or after
 * cessation of employment with that person; OTH - Any Other
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum TentacledNatureDesc {
    Oth = "OTH",
    The1 = "1",
    The2 = "2",
    The3 = "3",
}

export interface NatureOfSalary {
    OthersIncDtls?: NatureOfSalaryDtlsType[];
}

export interface NatureOfSalaryDtlsType {
    /**
     * 1 - Basic Salary; 2 - Dearness Allowance; 3 - Conveyance Allowance; 4 - House Rent
     * Allowance; 5 - Leave Travel Allowance; 6 - Children Education Allowance; 7 - Other
     * Allowance; 8 - The contribution made by the Employer towards pension scheme as referred
     * u/s 80CCD; 9 - Amount deemed to be income under rule 11 of Fourth Schedule; 10 - Amount
     * deemed to be income under rule 6 of Fourth Schedule; 11 - Annuity or pension; 12 -
     * Commuted Pension; 13 - Gratuity; 14 - Fees/ commission; 15 - Advance of salary; 16 -
     * Leave Encashment; 17 - Contribution made by the central government towards Agnipath
     * scheme as referred under section 80CCH; OTH - Others
     */
    NatureDesc:   StickyNatureDesc;
    OthAmount:    number;
    OthNatOfInc?: string;
}

/**
 * 1 - Basic Salary; 2 - Dearness Allowance; 3 - Conveyance Allowance; 4 - House Rent
 * Allowance; 5 - Leave Travel Allowance; 6 - Children Education Allowance; 7 - Other
 * Allowance; 8 - The contribution made by the Employer towards pension scheme as referred
 * u/s 80CCD; 9 - Amount deemed to be income under rule 11 of Fourth Schedule; 10 - Amount
 * deemed to be income under rule 6 of Fourth Schedule; 11 - Annuity or pension; 12 -
 * Commuted Pension; 13 - Gratuity; 14 - Fees/ commission; 15 - Advance of salary; 16 -
 * Leave Encashment; 17 - Contribution made by the central government towards Agnipath
 * scheme as referred under section 80CCH; OTH - Others
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum StickyNatureDesc {
    Oth = "OTH",
    The1 = "1",
    The10 = "10",
    The11 = "11",
    The12 = "12",
    The13 = "13",
    The14 = "14",
    The15 = "15",
    The16 = "16",
    The17 = "17",
    The2 = "2",
    The3 = "3",
    The4 = "4",
    The5 = "5",
    The6 = "6",
    The7 = "7",
    The8 = "8",
    The9 = "9",
}

/**
 * Income chargeable to Income Tax at special rates
 */
export interface ScheduleSI {
    SplCodeRateTax?:  SplCodeRateTax[];
    TotSplRateInc:    number;
    TotSplRateIncTax: number;
}

export interface SplCodeRateTax {
    /**
     * 1:111 - Tax on accumulated balance of recognised PF; 1A:111A (STCG on shares where STT
     * paid); 21:112 Long term capital gains (with indexing); 22:112 proviso Long term capital
     * gains (without indexing); 21ciii:112(1)(c)(iii)(Long term capital gains on transfer of
     * unlisted securities in the case of non-residents); 2A:112A-LTCG on equity shares/units of
     * equity oriented fund/units of business trust on which STT is paid; 5A1ai:115A(1)(a)(i)-
     * Dividends interest and income from units purchase in foreign currency;
     * 5A1aA:115A(1)(a)(A)- Dividend in the case of non-resident received from a unit in an
     * International Financial  Services Centre; 5A1aii:115A(1)(a)(ii)- Interest received from
     * govt/Indian Concerns recived in Foreign Currency; 5A1aiia:115A(1) (a)(iia) -Interest from
     * Infrastructure Debt Fund; 5A1aiiaa:115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1);
     * 5A1aiiaaP:115A(1) (a)(iiaa) -Income received by non-resident as referred in proviso to
     * section 194LC(1); 5A1aiiab:115A(1) (a)(iiab) -Interest as per Sec. 194LD; 5A1aiiac:
     * 115A(1)(a)(iiac) -Interest as per Sec. 194LBA;  5A1aiii:115A(1) (a)(iii) - Income
     * received in respect of units of UTI purchased in Foreign Currency; 5A1bA:115A(1)(b)(A) &
     * 115A(1)(b)(B)- Income from royalty & technical services; 5AC1ab:115AC(1)(a) - Income by
     * way of interest on bonds purchased in foreign currency - non-resident; 5AC1abD -
     * 115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency -
     * non-resident; 5AC1c:115AC(1)(c) -LTCG arising from the transfer of bonds or GDR purchased
     * in foreign currency - non-resident; 5ACA1a:115ACA(1)(a) - Income from GDR purchased in
     * foreign currency -resident; 5ACA1b:115ACA(1)(b) - LTCG arising from the transfer of GDR
     * purchased in foreign currency -resident; 5AD1i:115AD(1)(i) -Income (other than Dividend)
     * received by an FII in respect of securities (other than units as per Sec 115AB); 5AD1iDiv
     * - 115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
     * (other than units referred to in section 115AB); 5AD1iP:115AD(1)(i) -Income received by
     * an FII in respect of bonds or government securities as per Sec 194LD ; 5ADii:115AD(1)(ii)
     * -STCG (other than on equity share or equity oriented mutual fund referred to in section
     * 111A) by an FII; 5AD1biip:115AD(1)(b)(ii)- Short term capital gains referred to in
     * section 111A; 5ADiii:115AD(1)(iii)-Long term capital gains by an FII; 5ADiiiP:Proviso to
     * 115AD(iii); 5BB:115BB (Winnings from lotteries, crosswords puzzles, races including horse
     * races, card games and other games of any sort or gambling or betting of any form or
     * nature whatsoever);5BBJ: 115BBJ - Winnings from online games; 5BBA:115BBA - Tax on
     * non-residents sportsmen or sports associations; 5BBC:115BBC - Anonymous donations;
     * 5BBE:115BBE - Tax on income referred to in sections 68 or 69 or 69A or 69B or 69C or 69D;
     * 5BBF:115BBF -Tax on income from patent; 5BBG - 115BBG -Tax on income from transfer of
     * carbon credits; 5BBH - 115BBH - VDA; 5Ea:115E(a) - Investment income; 5Eacg:115E(a)-LTCG
     * on any asset other than a specified asset-non resident Indian; 5Eb:115E(b) - Income by
     * way of long term capital gains; DTAASTCG:STCGDTAARate - STCG Chargeable at special rates
     * in India as per DTAA; DTAALTCG:LTCGDTAARate - LTCG Chargeable at special rates in India
     * as per DTAA; DTAAOS:OSDTAARate - Other source income chargeable under DTAA rates;
     * PTI_STCG15P - Pass Through Income in the nature of Short Term Capital Gain chargeable @
     * 15% Under Section 111A; PTI_STCG30P - Pass Through Income in the nature of Short Term
     * Capital Gain chargeable @ 30%; PTI_LTCG10P112A - Pass Through Income in the nature of
     * Long Term Capital Gain chargeable @ 10% u/s 112A; PTI_LTCG10P - Pass Through Income in
     * the nature of Long Term Capital Gain chargeable @ 10%; PTI_LTCG20P - Pass Through Income
     * in the nature of Long Term Capital Gain chargeable @ 20%; PTI_5A1ai - PTI-115A(1)(a)(i)-
     * Dividends interest and income from units purchase in foreign currency; PTI_5A1aA -
     * PTI-115A(1)(a)(A)- PTI-Dividend in the case of non-residents received from a unit in an
     * International Financial  Services Centre; PTI_5A1aii - PTI-115A(1)(a)(ii)- Interest
     * received from govt/Indian Concerns received in Foreign Currency; PTI_5A1aiia -
     * PTI-115A(1) (a)(iia) -Interest from Infrastructure Debt Fund; PTI_5A1aiiaa - PTI-115A(1)
     * (a)(iiaa) -Interest as per Sec. 194LC(1); PTI_5A1aiiaaP - PTI-115A(1)(a)(iiaa) -Income
     * received by non-resident as referred in proviso to section 194LC(1); PTI_5A1aiiab -
     * PTI-115A(1) (a)(iiab) -Interest as per Sec. 194LD; PTI_5A1aiiac - PTI-115A(1) (a)(iiac)
     * -Interest as per Sec. 194LBA; PTI_5A1aiii - PTI-115A(1) (a)(iii) -Income received in
     * respect of units of UTI purchased in foreign currency; PTI_5A1bA - PTI-115A(1)(b)(A) &
     * PTI-115A(1)(b)(B)- Income from royalty & technical services; PTI_5AC1ab - PTI-115AC(1)(a)
     * - Income by way of interest on bonds purchased in foreign currency - non-resident;
     * PTI_5AC1abD - PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign
     * currency - non-resident; PTI_5ACA1a - PTI-115ACA(1)(a) - Income from GDR purchased in
     * foreign currency - resident; PTI_5AD1i - PTI-115AD(1)(i) -Income(other than Dividend)
     * received by an FII in respect of securities (other than units as per Sec 115AB);
     * PTI_5AD1iDiv - PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of
     * securities (other than units referred to in section 115AB); PTI_5AD1iP - PTI-115AD(1)(i)
     * -Income received by an FII in respect of bonds or government securities as per Sec 194LD;
     * PTI_5BBA - PTI-115BBA - Tax on non-residents sportsmen or sports associations; PTI_5BBG -
     * PTI-115BBG - Tax on income from transfer of carbon credits; PTI_5Ea - PTI-115E(a) -
     * Investment income
     */
    SecCode:        SECCode;
    SplRateInc:     number;
    SplRateIncTax:  number;
    SplRatePercent: number;
}

/**
 * 1:111 - Tax on accumulated balance of recognised PF; 1A:111A (STCG on shares where STT
 * paid); 21:112 Long term capital gains (with indexing); 22:112 proviso Long term capital
 * gains (without indexing); 21ciii:112(1)(c)(iii)(Long term capital gains on transfer of
 * unlisted securities in the case of non-residents); 2A:112A-LTCG on equity shares/units of
 * equity oriented fund/units of business trust on which STT is paid; 5A1ai:115A(1)(a)(i)-
 * Dividends interest and income from units purchase in foreign currency;
 * 5A1aA:115A(1)(a)(A)- Dividend in the case of non-resident received from a unit in an
 * International Financial  Services Centre; 5A1aii:115A(1)(a)(ii)- Interest received from
 * govt/Indian Concerns recived in Foreign Currency; 5A1aiia:115A(1) (a)(iia) -Interest from
 * Infrastructure Debt Fund; 5A1aiiaa:115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1);
 * 5A1aiiaaP:115A(1) (a)(iiaa) -Income received by non-resident as referred in proviso to
 * section 194LC(1); 5A1aiiab:115A(1) (a)(iiab) -Interest as per Sec. 194LD; 5A1aiiac:
 * 115A(1)(a)(iiac) -Interest as per Sec. 194LBA;  5A1aiii:115A(1) (a)(iii) - Income
 * received in respect of units of UTI purchased in Foreign Currency; 5A1bA:115A(1)(b)(A) &
 * 115A(1)(b)(B)- Income from royalty & technical services; 5AC1ab:115AC(1)(a) - Income by
 * way of interest on bonds purchased in foreign currency - non-resident; 5AC1abD -
 * 115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency -
 * non-resident; 5AC1c:115AC(1)(c) -LTCG arising from the transfer of bonds or GDR purchased
 * in foreign currency - non-resident; 5ACA1a:115ACA(1)(a) - Income from GDR purchased in
 * foreign currency -resident; 5ACA1b:115ACA(1)(b) - LTCG arising from the transfer of GDR
 * purchased in foreign currency -resident; 5AD1i:115AD(1)(i) -Income (other than Dividend)
 * received by an FII in respect of securities (other than units as per Sec 115AB); 5AD1iDiv
 * - 115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
 * (other than units referred to in section 115AB); 5AD1iP:115AD(1)(i) -Income received by
 * an FII in respect of bonds or government securities as per Sec 194LD ; 5ADii:115AD(1)(ii)
 * -STCG (other than on equity share or equity oriented mutual fund referred to in section
 * 111A) by an FII; 5AD1biip:115AD(1)(b)(ii)- Short term capital gains referred to in
 * section 111A; 5ADiii:115AD(1)(iii)-Long term capital gains by an FII; 5ADiiiP:Proviso to
 * 115AD(iii); 5BB:115BB (Winnings from lotteries, crosswords puzzles, races including horse
 * races, card games and other games of any sort or gambling or betting of any form or
 * nature whatsoever);5BBJ: 115BBJ - Winnings from online games; 5BBA:115BBA - Tax on
 * non-residents sportsmen or sports associations; 5BBC:115BBC - Anonymous donations;
 * 5BBE:115BBE - Tax on income referred to in sections 68 or 69 or 69A or 69B or 69C or 69D;
 * 5BBF:115BBF -Tax on income from patent; 5BBG - 115BBG -Tax on income from transfer of
 * carbon credits; 5BBH - 115BBH - VDA; 5Ea:115E(a) - Investment income; 5Eacg:115E(a)-LTCG
 * on any asset other than a specified asset-non resident Indian; 5Eb:115E(b) - Income by
 * way of long term capital gains; DTAASTCG:STCGDTAARate - STCG Chargeable at special rates
 * in India as per DTAA; DTAALTCG:LTCGDTAARate - LTCG Chargeable at special rates in India
 * as per DTAA; DTAAOS:OSDTAARate - Other source income chargeable under DTAA rates;
 * PTI_STCG15P - Pass Through Income in the nature of Short Term Capital Gain chargeable @
 * 15% Under Section 111A; PTI_STCG30P - Pass Through Income in the nature of Short Term
 * Capital Gain chargeable @ 30%; PTI_LTCG10P112A - Pass Through Income in the nature of
 * Long Term Capital Gain chargeable @ 10% u/s 112A; PTI_LTCG10P - Pass Through Income in
 * the nature of Long Term Capital Gain chargeable @ 10%; PTI_LTCG20P - Pass Through Income
 * in the nature of Long Term Capital Gain chargeable @ 20%; PTI_5A1ai - PTI-115A(1)(a)(i)-
 * Dividends interest and income from units purchase in foreign currency; PTI_5A1aA -
 * PTI-115A(1)(a)(A)- PTI-Dividend in the case of non-residents received from a unit in an
 * International Financial  Services Centre; PTI_5A1aii - PTI-115A(1)(a)(ii)- Interest
 * received from govt/Indian Concerns received in Foreign Currency; PTI_5A1aiia -
 * PTI-115A(1) (a)(iia) -Interest from Infrastructure Debt Fund; PTI_5A1aiiaa - PTI-115A(1)
 * (a)(iiaa) -Interest as per Sec. 194LC(1); PTI_5A1aiiaaP - PTI-115A(1)(a)(iiaa) -Income
 * received by non-resident as referred in proviso to section 194LC(1); PTI_5A1aiiab -
 * PTI-115A(1) (a)(iiab) -Interest as per Sec. 194LD; PTI_5A1aiiac - PTI-115A(1) (a)(iiac)
 * -Interest as per Sec. 194LBA; PTI_5A1aiii - PTI-115A(1) (a)(iii) -Income received in
 * respect of units of UTI purchased in foreign currency; PTI_5A1bA - PTI-115A(1)(b)(A) &
 * PTI-115A(1)(b)(B)- Income from royalty & technical services; PTI_5AC1ab - PTI-115AC(1)(a)
 * - Income by way of interest on bonds purchased in foreign currency - non-resident;
 * PTI_5AC1abD - PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign
 * currency - non-resident; PTI_5ACA1a - PTI-115ACA(1)(a) - Income from GDR purchased in
 * foreign currency - resident; PTI_5AD1i - PTI-115AD(1)(i) -Income(other than Dividend)
 * received by an FII in respect of securities (other than units as per Sec 115AB);
 * PTI_5AD1iDiv - PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of
 * securities (other than units referred to in section 115AB); PTI_5AD1iP - PTI-115AD(1)(i)
 * -Income received by an FII in respect of bonds or government securities as per Sec 194LD;
 * PTI_5BBA - PTI-115BBA - Tax on non-residents sportsmen or sports associations; PTI_5BBG -
 * PTI-115BBG - Tax on income from transfer of carbon credits; PTI_5Ea - PTI-115E(a) -
 * Investment income
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum SECCode {
    Dtaaltcg = "DTAALTCG",
    Dtaaos = "DTAAOS",
    Dtaastcg = "DTAASTCG",
    PTI5A1AA = "PTI_5A1aA",
    PTI5A1AI = "PTI_5A1ai",
    PTI5A1Aii = "PTI_5A1aii",
    PTI5A1Aiia = "PTI_5A1aiia",
    PTI5A1Aiiaa = "PTI_5A1aiiaa",
    PTI5A1AiiaaP = "PTI_5A1aiiaaP",
    PTI5A1Aiiab = "PTI_5A1aiiab",
    PTI5A1Aiiac = "PTI_5A1aiiac",
    PTI5A1Aiii = "PTI_5A1aiii",
    PTI5A1BA = "PTI_5A1bA",
    PTI5AC1Ab = "PTI_5AC1ab",
    PTI5AC1AbD = "PTI_5AC1abD",
    PTI5ACA1A = "PTI_5ACA1a",
    PTI5AD1I = "PTI_5AD1i",
    PTI5AD1IDiv = "PTI_5AD1iDiv",
    PTI5AD1IP = "PTI_5AD1iP",
    PTI5Ea = "PTI_5Ea",
    Pti5Bba = "PTI_5BBA",
    Pti5Bbf = "PTI_5BBF",
    Pti5Bbg = "PTI_5BBG",
    PtiLtcg10P = "PTI_LTCG10P",
    PtiLtcg10P112A = "PTI_LTCG10P112A",
    PtiLtcg20P = "PTI_LTCG20P",
    PtiStcg15P = "PTI_STCG15P",
    PtiStcg30P = "PTI_STCG30P",
    The1 = "1",
    The1A = "1A",
    The21 = "21",
    The21Ciii = "21ciii",
    The22 = "22",
    The2A = "2A",
    The5A1AA = "5A1aA",
    The5A1AI = "5A1ai",
    The5A1Aii = "5A1aii",
    The5A1Aiia = "5A1aiia",
    The5A1Aiiaa = "5A1aiiaa",
    The5A1AiiaaP = "5A1aiiaaP",
    The5A1Aiiab = "5A1aiiab",
    The5A1Aiiac = "5A1aiiac",
    The5A1Aiii = "5A1aiii",
    The5A1BA = "5A1bA",
    The5AC1Ab = "5AC1ab",
    The5AC1AbD = "5AC1abD",
    The5AC1C = "5AC1c",
    The5ACA1A = "5ACA1a",
    The5ACA1B = "5ACA1b",
    The5AD1Biip = "5AD1biip",
    The5AD1I = "5AD1i",
    The5AD1IDiv = "5AD1iDiv",
    The5AD1IP = "5AD1iP",
    The5ADii = "5ADii",
    The5ADiii = "5ADiii",
    The5ADiiiP = "5ADiiiP",
    The5Bb = "5BB",
    The5Bba = "5BBA",
    The5Bbc = "5BBC",
    The5Bbe = "5BBE",
    The5Bbf = "5BBF",
    The5Bbg = "5BBG",
    The5Bbh = "5BBH",
    The5Bbj = "5BBJ",
    The5Ea = "5Ea",
    The5Eacg = "5Eacg",
    The5Eb = "5Eb",
}

/**
 * Income of specified persons (Spouse,minor child etc) includable in income of the assessee
 */
export interface ScheduleSPI {
    SpecifiedPerson?: SpecifiedPerson[];
}

export interface SpecifiedPerson {
    AaadhaarOfSpecPerson?: string;
    AmtIncluded:           number;
    /**
     * SA - Salary; HP - House Property; CG - Capital Gain; OS - Other sources; EI - Exempt
     * Income
     */
    HeadIncIncluded:     HeadIncIncluded;
    PANofSpecPerson?:    string;
    ReltnShip:           string;
    SpecifiedPersonName: string;
}

/**
 * SA - Salary; HP - House Property; CG - Capital Gain; OS - Other sources; EI - Exempt
 * Income
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum HeadIncIncluded {
    CG = "CG",
    Ei = "EI",
    HP = "HP",
    OS = "OS",
    Sa = "SA",
}

export interface ScheduleTCS {
    TCS?:        Tc[];
    TotalSchTCS: number;
}

export interface Tc {
    AmtCarriedFwd?:                 number;
    BroughtFwdTDSAmt?:              number;
    DeductedYr?:                    number;
    EmployerOrDeductorOrCollectTAN: string;
    PANOfSpouseOrOthrPrsn?:         string;
    TCSClaimedThisYearDtls?:        TCSClaimedThisYearDtls;
    /**
     * 1 - Self ; 2 - Spouse or Other Person
     */
    TCSCreditOwner: NatureOfDisability;
    TCSCurrFYDtls?: TCSCurrFYDtls;
}

export interface TCSClaimedThisYearDtls {
    PANOfSpouseOrOthrPrsn?:      string;
    TCSAmtCollOwnHand?:          number;
    TCSAmtCollSpouseOrOthrHand?: number;
}

export interface TCSCurrFYDtls {
    TCSAmtCollOwnHand?:          number;
    TCSAmtCollSpouseOrOthrHand?: number;
}

export interface ScheduleTDS1 {
    TDSonSalary?:       TDSonSalary[];
    TotalTDSonSalaries: number;
}

export interface TDSonSalary {
    EmployerOrDeductorOrCollectDetl: EmployerOrDeductorOrCollectDetl;
    IncChrgSal:                      number;
    TotalTDSSal:                     number;
}

/**
 * Dedcutor or Collector Details
 */
export interface EmployerOrDeductorOrCollectDetl {
    EmployerOrDeductorOrCollecterName: string;
    TAN:                               string;
}

export interface ScheduleTDS2 {
    TDSOthThanSalaryDtls?: TDSOthThanSalaryDtls[];
    TotalTDSonOthThanSals: number;
}

export interface TDSOthThanSalaryDtls {
    AadhaarOfOtherPerson?: string;
    AmtCarriedFwd:         number;
    BroughtFwdTDSAmt?:     number;
    DeductedYr?:           number;
    GrossAmount?:          number;
    /**
     * HP - Income from House Property; CG - Income from Capital Gains; OS - Income from Other
     * Sources; EI - Exempt Income; NA - Not Applicable
     */
    HeadOfIncome?:     TDSOthThanSalaryDtlHeadOfIncome;
    PANofOtherPerson?: string;
    TANOfDeductor:     string;
    /**
     * S - Self; O - Other Person
     */
    TDSCreditName:       TDSCreditName;
    TaxDeductCreditDtls: TaxDeductCreditDtls;
}

/**
 * HP - Income from House Property; CG - Income from Capital Gains; OS - Income from Other
 * Sources; EI - Exempt Income; NA - Not Applicable
 */
export enum TDSOthThanSalaryDtlHeadOfIncome {
    CG = "CG",
    Ei = "EI",
    HP = "HP",
    Na = "NA",
    OS = "OS",
}

/**
 * S - Self; O - Other Person
 */
export enum TDSCreditName {
    O = "O",
    S = "S",
}

export interface TaxDeductCreditDtls {
    SpouseOthPrsnAadhaar?:       string;
    TaxClaimedIncome?:           number;
    TaxClaimedOwnHands:          number;
    TaxClaimedSpouseOthPrsnPAN?: string;
    TaxClaimedTDS?:              number;
    TaxDeductedIncome?:          number;
    TaxDeductedOwnHands?:        number;
    TaxDeductedTDS?:             number;
}

export interface ScheduleTDS3 {
    TDS3onOthThanSalDtls?: TDS3OnOthThanSalDtls[];
    TotalTDS3OnOthThanSal: number;
}

export interface TDS3OnOthThanSalDtls {
    AadhaarOfBuyerTenant?: string;
    AadhaarOfOtherPerson?: string;
    AmtCarriedFwd:         number;
    BroughtFwdTDSAmt?:     number;
    DeductedYr?:           number;
    GrossAmount?:          number;
    /**
     * HP - Income from House Property; CG - Income from Capital Gains; OS - Income from Other
     * Sources; EI - Exempt Income
     */
    HeadOfIncome?:     TDS3OnOthThanSalDtlHeadOfIncome;
    PANOfBuyerTenant:  string;
    PANofOtherPerson?: string;
    /**
     * S - Self; O - Other Person
     */
    TDSCreditName:       TDSCreditName;
    TaxDeductCreditDtls: TaxDeductCreditDtls;
}

/**
 * HP - Income from House Property; CG - Income from Capital Gains; OS - Income from Other
 * Sources; EI - Exempt Income
 */
export enum TDS3OnOthThanSalDtlHeadOfIncome {
    CG = "CG",
    Ei = "EI",
    HP = "HP",
    OS = "OS",
}

export interface ScheduleTR1 {
    AmtTaxRefunded?: number;
    /**
     * Assessment year in which tax relief allowed in India
     */
    AssmtYrTaxRelief?:            string;
    ScheduleTR?:                  ScheduleTR[];
    TaxPaidOutsideIndFlg?:        AssetOutIndiaFlag;
    TaxReliefOutsideIndiaDTAA:    number;
    TaxReliefOutsideIndiaNotDTAA: number;
    TotalTaxPaidOutsideIndia:     number;
    TotalTaxReliefOutsideIndia:   number;
}

export interface ScheduleTR {
    CountryCodeExcludingIndia: CountryCodeExcludingIndia;
    CountryName:               string;
    /**
     * 90 - 90; 90A - 90A; 91 - 91
     */
    ReliefClaimedUsSection?: ReliefClaimedUsSection;
    TaxIdentificationNo:     string;
    TaxPaidOutsideIndia:     number;
    TaxReliefOutsideIndia:   number;
}

/**
 * 90 - 90; 90A - 90A; 91 - 91
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum ReliefClaimedUsSection {
    The90 = "90",
    The90A = "90A",
    The91 = "91",
}

export interface ScheduleVDA {
    ScheduleVDADtls: ScheduleVDADtl[];
    TotIncCapGain:   number;
}

export interface ScheduleVDADtl {
    AcquisitionCost: number;
    ConsidReceived:  number;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofAcquisition: string;
    /**
     * Date in YYYY-MM-DD format
     */
    DateofTransfer: string;
    /**
     * CG : Capital Gain
     */
    HeadUndIncTaxed: HeadUndIncTaxed;
    IncomeFromVDA:   number;
}

/**
 * CG : Capital Gain
 *
 * For Individuals and HUFs not having income from profits and gains of business or
 * profession
 *
 * if above field is selected as yes, provide SEBI Registration Number.
 *
 * Enter Last or Sur name for Individual or HUF name here
 *
 * IN[0-9A-Z]{10} - On or Before 31st January 2018; INNOTREQUIRD - After 31st January 2018
 *
 * [w]* - On or Before 31st January 2018; CONSOLIDATED - After 31st January 2018
 *
 * Y - Yes; N - No; P - Not claiming for Parents
 *
 * Y - Yes; N - No; S - Not claiming for Self/ Family
 *
 * Please enter ARN (Donation reference Number)
 *
 * Do you want to edit the auto-populated details?
 *
 * A - 115UA; B - 115UB
 *
 * Name of the employer
 *
 * Assessment year in which tax relief allowed in India
 */
export enum HeadUndIncTaxed {
    CG = "CG",
}

export interface ScheduleVIA {
    DeductUndChapVIA:    DeductUndChapVIA;
    UsrDeductUndChapVIA: USRDeductUndChapVIA;
}

/**
 * Chapter VI-A Deductions from Gross Total Income
 */
export interface DeductUndChapVIA {
    AnyOthSec80CCH?: number;
    Section80C?:     number;
    Section80CCC?:   number;
    Section80CCD1B?: number;
    /**
     * For Employee/SelfEmployed
     */
    Section80CCDEmployeeOrSE?: number;
    Section80CCDEmployer?:     number;
    Section80D:                number;
    Section80DD?:              number;
    Section80DDB?:             number;
    Section80E?:               number;
    Section80EE?:              number;
    Section80EEA?:             number;
    Section80EEB?:             number;
    Section80G:                number;
    Section80GG?:              number;
    Section80GGA:              number;
    Section80GGC?:             number;
    Section80QQB?:             number;
    Section80RRB?:             number;
    Section80TTA?:             number;
    Section80TTB?:             number;
    Section80U?:               number;
    TotalChapVIADeductions:    number;
}

/**
 * Chapter VI-A Deductions from Gross Total Income
 */
export interface USRDeductUndChapVIA {
    AnyOthSec80CCH?: number;
    Section80C?:     number;
    Section80CCC?:   number;
    Section80CCD1B?: number;
    /**
     * For Employee/SelfEmployed
     */
    Section80CCDEmployeeOrSE?: number;
    Section80CCDEmployer?:     number;
    Section80D?:               number;
    Section80DD?:              number;
    Section80DDB?:             number;
    /**
     * 1 : Self or dependent; 2 : Self or Dependent (Senior Citizen)
     */
    Section80DDBUsrType?:    NatureOfDisability;
    Section80E?:             number;
    Section80EE?:            number;
    Section80EEA?:           number;
    Section80EEB?:           number;
    Section80G?:             number;
    Section80GG?:            number;
    Section80GGA?:           number;
    Section80GGC?:           number;
    Section80QQB?:           number;
    Section80RRB?:           number;
    Section80TTA?:           number;
    Section80TTB?:           number;
    Section80U?:             number;
    TotalChapVIADeductions?: number;
}

/**
 * TRP details
 */
export interface TaxReturnPreparer {
    IdentificationNoOfTRP: string;
    NameOfTRP:             string;
    ReImbFrmGov:           number;
}

/**
 * Verification declaration details
 */
export interface Verification {
    /**
     * S : Self; R : Representative; K : Karta; A : Authorised Signatory
     */
    Capacity: Capacity;
    /**
     * Date in YYYY-MM-DD format
     */
    Date?:       string;
    Declaration: Declaration;
    Place?:      string;
}

/**
 * S : Self; R : Representative; K : Karta; A : Authorised Signatory
 */
export enum Capacity {
    A = "A",
    K = "K",
    R = "R",
    S = "S",
}

export interface Declaration {
    AssesseeVerName: string;
    AssesseeVerPAN:  string;
    FatherName:      string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toItr(json: string): Itr {
        return cast(JSON.parse(json), r("Itr"));
    }

    public static itrToJson(value: Itr): string {
        return JSON.stringify(uncast(value, r("Itr")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Itr": o([
        { json: "ITR", js: "ITR", typ: u(undefined, r("ITRClass")) },
    ], false),
    "ITRClass": o([
        { json: "ITR2", js: "ITR2", typ: r("Itr2") },
    ], false),
    "Itr2": o([
        { json: "CreationInfo", js: "CreationInfo", typ: r("CreationInfo") },
        { json: "Form_ITR2", js: "Form_ITR2", typ: r("FormITR2") },
        { json: "PartA_GEN1", js: "PartA_GEN1", typ: r("PartAGEN1") },
        { json: "PartB-TI", js: "PartB-TI", typ: r("PartBTI") },
        { json: "PartB_TTI", js: "PartB_TTI", typ: r("PartBTTI") },
        { json: "Schedule112A", js: "Schedule112A", typ: u(undefined, r("Schedule112A")) },
        { json: "Schedule115AD", js: "Schedule115AD", typ: u(undefined, r("Schedule115AD")) },
        { json: "Schedule5A2014", js: "Schedule5A2014", typ: u(undefined, r("Schedule5A2014")) },
        { json: "Schedule80D", js: "Schedule80D", typ: u(undefined, r("Schedule80D")) },
        { json: "Schedule80DD", js: "Schedule80DD", typ: u(undefined, r("Schedule80DD")) },
        { json: "Schedule80G", js: "Schedule80G", typ: u(undefined, r("Schedule80G")) },
        { json: "Schedule80GGA", js: "Schedule80GGA", typ: u(undefined, r("Schedule80GGA")) },
        { json: "Schedule80GGC", js: "Schedule80GGC", typ: u(undefined, r("Schedule80GGC")) },
        { json: "Schedule80U", js: "Schedule80U", typ: u(undefined, r("Schedule80U")) },
        { json: "ScheduleAL", js: "ScheduleAL", typ: u(undefined, r("ScheduleAL")) },
        { json: "ScheduleAMT", js: "ScheduleAMT", typ: u(undefined, r("ScheduleAMT")) },
        { json: "ScheduleAMTC", js: "ScheduleAMTC", typ: u(undefined, r("ScheduleAMTC")) },
        { json: "ScheduleBFLA", js: "ScheduleBFLA", typ: r("ScheduleBFLA") },
        { json: "ScheduleCFL", js: "ScheduleCFL", typ: u(undefined, r("ScheduleCFL")) },
        { json: "ScheduleCGFor23", js: "ScheduleCGFor23", typ: u(undefined, r("ScheduleCGFor23")) },
        { json: "ScheduleCYLA", js: "ScheduleCYLA", typ: r("ScheduleCYLA") },
        { json: "ScheduleEI", js: "ScheduleEI", typ: u(undefined, r("ScheduleEI")) },
        { json: "ScheduleESOP", js: "ScheduleESOP", typ: u(undefined, r("ScheduleESOP")) },
        { json: "ScheduleFA", js: "ScheduleFA", typ: u(undefined, r("ScheduleFA")) },
        { json: "ScheduleFSI", js: "ScheduleFSI", typ: u(undefined, r("ScheduleFSI")) },
        { json: "ScheduleHP", js: "ScheduleHP", typ: u(undefined, r("ScheduleHP")) },
        { json: "ScheduleIT", js: "ScheduleIT", typ: u(undefined, r("ScheduleIT")) },
        { json: "ScheduleOS", js: "ScheduleOS", typ: u(undefined, r("ScheduleOS")) },
        { json: "SchedulePTI", js: "SchedulePTI", typ: u(undefined, r("SchedulePTI")) },
        { json: "ScheduleS", js: "ScheduleS", typ: u(undefined, r("ScheduleS")) },
        { json: "ScheduleSI", js: "ScheduleSI", typ: u(undefined, r("ScheduleSI")) },
        { json: "ScheduleSPI", js: "ScheduleSPI", typ: u(undefined, r("ScheduleSPI")) },
        { json: "ScheduleTCS", js: "ScheduleTCS", typ: u(undefined, r("ScheduleTCS")) },
        { json: "ScheduleTDS1", js: "ScheduleTDS1", typ: u(undefined, r("ScheduleTDS1")) },
        { json: "ScheduleTDS2", js: "ScheduleTDS2", typ: u(undefined, r("ScheduleTDS2")) },
        { json: "ScheduleTDS3", js: "ScheduleTDS3", typ: u(undefined, r("ScheduleTDS3")) },
        { json: "ScheduleTR1", js: "ScheduleTR1", typ: u(undefined, r("ScheduleTR1")) },
        { json: "ScheduleVDA", js: "ScheduleVDA", typ: u(undefined, r("ScheduleVDA")) },
        { json: "ScheduleVIA", js: "ScheduleVIA", typ: u(undefined, r("ScheduleVIA")) },
        { json: "TaxReturnPreparer", js: "TaxReturnPreparer", typ: u(undefined, r("TaxReturnPreparer")) },
        { json: "Verification", js: "Verification", typ: r("Verification") },
    ], false),
    "CreationInfo": o([
        { json: "Digest", js: "Digest", typ: "" },
        { json: "IntermediaryCity", js: "IntermediaryCity", typ: "" },
        { json: "JSONCreatedBy", js: "JSONCreatedBy", typ: "" },
        { json: "JSONCreationDate", js: "JSONCreationDate", typ: "" },
        { json: "SWCreatedBy", js: "SWCreatedBy", typ: "" },
        { json: "SWVersionNo", js: "SWVersionNo", typ: "" },
    ], false),
    "FormITR2": o([
        { json: "AssessmentYear", js: "AssessmentYear", typ: "" },
        { json: "Description", js: "Description", typ: "" },
        { json: "FormName", js: "FormName", typ: "" },
        { json: "FormVer", js: "FormVer", typ: "" },
        { json: "SchemaVer", js: "SchemaVer", typ: "" },
    ], false),
    "PartAGEN1": o([
        { json: "FilingStatus", js: "FilingStatus", typ: r("FilingStatus") },
        { json: "PersonalInfo", js: "PersonalInfo", typ: r("PersonalInfo") },
    ], false),
    "FilingStatus": o([
        { json: "AmtSeventhProvisio139i", js: "AmtSeventhProvisio139i", typ: u(undefined, 0) },
        { json: "AmtSeventhProvisio139ii", js: "AmtSeventhProvisio139ii", typ: u(undefined, 0) },
        { json: "AmtSeventhProvisio139iii", js: "AmtSeventhProvisio139iii", typ: u(undefined, 0) },
        { json: "AsseseeRepFlg", js: "AsseseeRepFlg", typ: u(undefined, r("TaxRescertifiedFlag")) },
        { json: "AssesseeRep", js: "AssesseeRep", typ: u(undefined, r("AssesseeRep")) },
        { json: "BenefitUs115HFlg", js: "BenefitUs115HFlg", typ: u(undefined, r("TaxRescertifiedFlag")) },
        { json: "CompDirectorPrvYr", js: "CompDirectorPrvYr", typ: u(undefined, r("CompDirectorPrvYr")) },
        { json: "CompDirectorPrvYrFlg", js: "CompDirectorPrvYrFlg", typ: u(undefined, r("TaxRescertifiedFlag")) },
        { json: "ConditionsResStatus", js: "ConditionsResStatus", typ: u(undefined, r("ConditionsResStatus")) },
        { json: "DepAmtAggAmtExcd1CrPrYrFlg", js: "DepAmtAggAmtExcd1CrPrYrFlg", typ: u(undefined, "") },
        { json: "FiiFpiFlag", js: "FiiFpiFlag", typ: r("TaxRescertifiedFlag") },
        { json: "HeldUnlistedEqShrPrYr", js: "HeldUnlistedEqShrPrYr", typ: u(undefined, r("HeldUnlistedEqShrPRYr")) },
        { json: "HeldUnlistedEqShrPrYrFlg", js: "HeldUnlistedEqShrPrYrFlg", typ: r("TaxRescertifiedFlag") },
        { json: "IncrExpAggAmt1LkElctrctyPrYrFlg", js: "IncrExpAggAmt1LkElctrctyPrYrFlg", typ: u(undefined, "") },
        { json: "IncrExpAggAmt2LkTrvFrgnCntryFlg", js: "IncrExpAggAmt2LkTrvFrgnCntryFlg", typ: u(undefined, "") },
        { json: "ItrFilingDueDate", js: "ItrFilingDueDate", typ: "" },
        { json: "JurisdictionResPrevYr", js: "JurisdictionResPrevYr", typ: u(undefined, r("JurisdictionResPrevYr")) },
        { json: "LEIDtls", js: "LEIDtls", typ: u(undefined, r("LEIDtls")) },
        { json: "NoticeDate", js: "NoticeDate", typ: u(undefined, "") },
        { json: "NoticeNo", js: "NoticeNo", typ: u(undefined, "") },
        { json: "OptOutNewTaxRegime", js: "OptOutNewTaxRegime", typ: "" },
        { json: "OrigRetFiledDate", js: "OrigRetFiledDate", typ: u(undefined, "") },
        { json: "PortugeseCC5A", js: "PortugeseCC5A", typ: u(undefined, r("TaxRescertifiedFlag")) },
        { json: "ReceiptNo", js: "ReceiptNo", typ: u(undefined, "") },
        { json: "ResidentialStatus", js: "ResidentialStatus", typ: r("ResidentialStatus") },
        { json: "ReturnFileSec", js: "ReturnFileSec", typ: 0 },
        { json: "SebiRegnNo", js: "SebiRegnNo", typ: u(undefined, "") },
        { json: "SeventhProvisio139", js: "SeventhProvisio139", typ: "" },
        { json: "TotalPrStayIndia4PrecYr", js: "TotalPrStayIndia4PrecYr", typ: u(undefined, 0) },
        { json: "TotalPrStayIndiaPrevYr", js: "TotalPrStayIndiaPrevYr", typ: u(undefined, 0) },
        { json: "clauseiv7provisio139i", js: "clauseiv7provisio139i", typ: u(undefined, "") },
        { json: "clauseiv7provisio139iDtls", js: "clauseiv7provisio139iDtls", typ: u(undefined, a(r("Clauseiv7Provisio139IType"))) },
    ], false),
    "AssesseeRep": o([
        { json: "RepAadhaar", js: "RepAadhaar", typ: u(undefined, "") },
        { json: "RepAddress", js: "RepAddress", typ: "" },
        { json: "RepCapacity", js: "RepCapacity", typ: r("RepCapacity") },
        { json: "RepName", js: "RepName", typ: "" },
        { json: "RepPAN", js: "RepPAN", typ: "" },
    ], false),
    "CompDirectorPrvYr": o([
        { json: "CompDirectorPrvYrDtls", js: "CompDirectorPrvYrDtls", typ: u(undefined, a(r("CompDirectorPrvYrDtls"))) },
    ], false),
    "CompDirectorPrvYrDtls": o([
        { json: "CompanyType", js: "CompanyType", typ: r("CompanyType") },
        { json: "DIN", js: "DIN", typ: u(undefined, "") },
        { json: "NameOfCompany", js: "NameOfCompany", typ: "" },
        { json: "PAN", js: "PAN", typ: u(undefined, "") },
        { json: "SharesTypes", js: "SharesTypes", typ: r("SharesTypes") },
    ], false),
    "HeldUnlistedEqShrPRYr": o([
        { json: "HeldUnlistedEqShrPrYrDtls", js: "HeldUnlistedEqShrPrYrDtls", typ: u(undefined, a(r("HeldUnlistedEqShrPRYrDtls"))) },
    ], false),
    "HeldUnlistedEqShrPRYrDtls": o([
        { json: "ClsngBalCostOfAcquisition", js: "ClsngBalCostOfAcquisition", typ: 3.14 },
        { json: "ClsngBalNumberOfShares", js: "ClsngBalNumberOfShares", typ: 0 },
        { json: "CompanyType", js: "CompanyType", typ: r("CompanyType") },
        { json: "DateOfSubscrPurchase", js: "DateOfSubscrPurchase", typ: u(undefined, "") },
        { json: "FaceValuePerShare", js: "FaceValuePerShare", typ: u(undefined, 3.14) },
        { json: "IssuePricePerShare", js: "IssuePricePerShare", typ: u(undefined, 0) },
        { json: "NameOfCompany", js: "NameOfCompany", typ: "" },
        { json: "OpngBalCostOfAcquisition", js: "OpngBalCostOfAcquisition", typ: 3.14 },
        { json: "OpngBalNumberOfShares", js: "OpngBalNumberOfShares", typ: 0 },
        { json: "PAN", js: "PAN", typ: u(undefined, "") },
        { json: "PurchasePricePerShare", js: "PurchasePricePerShare", typ: u(undefined, 3.14) },
        { json: "ShrAcqDurYrNumberOfShares", js: "ShrAcqDurYrNumberOfShares", typ: u(undefined, 0) },
        { json: "ShrTrnfNumberOfShares", js: "ShrTrnfNumberOfShares", typ: u(undefined, 0) },
        { json: "ShrTrnfSaleConsideration", js: "ShrTrnfSaleConsideration", typ: u(undefined, 3.14) },
    ], false),
    "JurisdictionResPrevYr": o([
        { json: "JurisdictionResPrevYrDtls", js: "JurisdictionResPrevYrDtls", typ: u(undefined, a(r("JurisdictionResPrevYrDtls"))) },
    ], false),
    "JurisdictionResPrevYrDtls": o([
        { json: "JurisdictionResidence", js: "JurisdictionResidence", typ: r("JurisdictionResidence") },
        { json: "TIN", js: "TIN", typ: "" },
    ], false),
    "LEIDtls": o([
        { json: "LEINumber", js: "LEINumber", typ: u(undefined, "") },
        { json: "ValidUptoDate", js: "ValidUptoDate", typ: u(undefined, "") },
    ], false),
    "Clauseiv7Provisio139IType": o([
        { json: "clauseiv7provisio139iAmount", js: "clauseiv7provisio139iAmount", typ: 0 },
        { json: "clauseiv7provisio139iNature", js: "clauseiv7provisio139iNature", typ: r("NatureOfDisability") },
    ], false),
    "PersonalInfo": o([
        { json: "AadhaarCardNo", js: "AadhaarCardNo", typ: u(undefined, "") },
        { json: "AadhaarEnrolmentId", js: "AadhaarEnrolmentId", typ: u(undefined, "") },
        { json: "Address", js: "Address", typ: r("Address") },
        { json: "AssesseeName", js: "AssesseeName", typ: r("AssesseeName") },
        { json: "DOB", js: "DOB", typ: "" },
        { json: "PAN", js: "PAN", typ: "" },
        { json: "Status", js: "Status", typ: r("Status") },
    ], false),
    "Address": o([
        { json: "CityOrTownOrDistrict", js: "CityOrTownOrDistrict", typ: "" },
        { json: "CountryCode", js: "CountryCode", typ: r("CountryCode") },
        { json: "CountryCodeMobile", js: "CountryCodeMobile", typ: 0 },
        { json: "CountryCodeMobileNoSec", js: "CountryCodeMobileNoSec", typ: u(undefined, 0) },
        { json: "EmailAddress", js: "EmailAddress", typ: "" },
        { json: "EmailAddressSec", js: "EmailAddressSec", typ: u(undefined, "") },
        { json: "LocalityOrArea", js: "LocalityOrArea", typ: "" },
        { json: "MobileNo", js: "MobileNo", typ: 0 },
        { json: "MobileNoSec", js: "MobileNoSec", typ: u(undefined, 0) },
        { json: "Phone", js: "Phone", typ: u(undefined, r("Phone")) },
        { json: "PinCode", js: "PinCode", typ: u(undefined, 0) },
        { json: "ResidenceName", js: "ResidenceName", typ: u(undefined, "") },
        { json: "ResidenceNo", js: "ResidenceNo", typ: "" },
        { json: "RoadOrStreet", js: "RoadOrStreet", typ: u(undefined, "") },
        { json: "StateCode", js: "StateCode", typ: r("StateCode") },
        { json: "ZipCode", js: "ZipCode", typ: u(undefined, "") },
    ], false),
    "Phone": o([
        { json: "PhoneNo", js: "PhoneNo", typ: "" },
        { json: "STDcode", js: "STDcode", typ: 0 },
    ], false),
    "AssesseeName": o([
        { json: "FirstName", js: "FirstName", typ: u(undefined, "") },
        { json: "MiddleName", js: "MiddleName", typ: u(undefined, "") },
        { json: "SurNameOrOrgName", js: "SurNameOrOrgName", typ: "" },
    ], false),
    "PartBTI": o([
        { json: "AggregateIncome", js: "AggregateIncome", typ: 0 },
        { json: "BalanceAfterSetoffLosses", js: "BalanceAfterSetoffLosses", typ: 0 },
        { json: "BroughtFwdLossesSetoff", js: "BroughtFwdLossesSetoff", typ: 0 },
        { json: "CapGain", js: "CapGain", typ: r("CapGain") },
        { json: "CurrentYearLoss", js: "CurrentYearLoss", typ: 0 },
        { json: "DeductionsUnderScheduleVIA", js: "DeductionsUnderScheduleVIA", typ: 0 },
        { json: "DeemedIncomeUs115JC", js: "DeemedIncomeUs115JC", typ: 0 },
        { json: "GrossTotalIncome", js: "GrossTotalIncome", typ: 0 },
        { json: "IncChargeTaxSplRate111A112", js: "IncChargeTaxSplRate111A112", typ: 0 },
        { json: "IncChargeableTaxSplRates", js: "IncChargeableTaxSplRates", typ: 0 },
        { json: "IncFromOS", js: "IncFromOS", typ: r("IncFromOS") },
        { json: "IncomeFromHP", js: "IncomeFromHP", typ: 0 },
        { json: "LossesOfCurrentYearCarriedFwd", js: "LossesOfCurrentYearCarriedFwd", typ: 0 },
        { json: "NetAgricultureIncomeOrOtherIncomeForRate", js: "NetAgricultureIncomeOrOtherIncomeForRate", typ: 0 },
        { json: "Salaries", js: "Salaries", typ: 0 },
        { json: "TotalIncome", js: "TotalIncome", typ: 0 },
        { json: "TotalTI", js: "TotalTI", typ: 0 },
    ], false),
    "CapGain": o([
        { json: "CapGains30Per115BBH", js: "CapGains30Per115BBH", typ: 0 },
        { json: "LongTerm", js: "LongTerm", typ: r("LongTerm") },
        { json: "ShortTerm", js: "ShortTerm", typ: r("ShortTerm") },
        { json: "ShortTermLongTermTotal", js: "ShortTermLongTermTotal", typ: 0 },
        { json: "TotalCapGains", js: "TotalCapGains", typ: 0 },
    ], false),
    "LongTerm": o([
        { json: "LongTerm10Per", js: "LongTerm10Per", typ: 0 },
        { json: "LongTerm20Per", js: "LongTerm20Per", typ: 0 },
        { json: "LongTermSplRateDTAA", js: "LongTermSplRateDTAA", typ: 0 },
        { json: "TotalLongTerm", js: "TotalLongTerm", typ: 0 },
    ], false),
    "ShortTerm": o([
        { json: "ShortTerm15Per", js: "ShortTerm15Per", typ: 0 },
        { json: "ShortTerm30Per", js: "ShortTerm30Per", typ: 0 },
        { json: "ShortTermAppRate", js: "ShortTermAppRate", typ: 0 },
        { json: "ShortTermSplRateDTAA", js: "ShortTermSplRateDTAA", typ: 0 },
        { json: "TotalShortTerm", js: "TotalShortTerm", typ: 0 },
    ], false),
    "IncFromOS": o([
        { json: "FromOwnRaceHorse", js: "FromOwnRaceHorse", typ: 0 },
        { json: "IncChargblSplRate", js: "IncChargblSplRate", typ: 0 },
        { json: "OtherSrcThanOwnRaceHorse", js: "OtherSrcThanOwnRaceHorse", typ: 0 },
        { json: "TotIncFromOS", js: "TotIncFromOS", typ: 0 },
    ], false),
    "PartBTTI": o([
        { json: "AssetOutIndiaFlag", js: "AssetOutIndiaFlag", typ: r("AssetOutIndiaFlag") },
        { json: "ComputationOfTaxLiability", js: "ComputationOfTaxLiability", typ: r("ComputationOfTaxLiability") },
        { json: "HealthEduCess", js: "HealthEduCess", typ: 0 },
        { json: "Refund", js: "Refund", typ: r("Refund") },
        { json: "Surcharge", js: "Surcharge", typ: 0 },
        { json: "TaxPaid", js: "TaxPaid", typ: r("TaxPaid") },
        { json: "TaxPayDeemedTotIncUs115JC", js: "TaxPayDeemedTotIncUs115JC", typ: 0 },
        { json: "TotalTaxPayablDeemedTotInc", js: "TotalTaxPayablDeemedTotInc", typ: 0 },
    ], false),
    "ComputationOfTaxLiability": o([
        { json: "AggregateTaxInterestLiability", js: "AggregateTaxInterestLiability", typ: 0 },
        { json: "CreditUS115JD", js: "CreditUS115JD", typ: 0 },
        { json: "EducationCess", js: "EducationCess", typ: 0 },
        { json: "GrossTaxLiability", js: "GrossTaxLiability", typ: 0 },
        { json: "GrossTaxPay", js: "GrossTaxPay", typ: u(undefined, r("GrossTaxPay")) },
        { json: "GrossTaxPayable", js: "GrossTaxPayable", typ: 0 },
        { json: "IntrstPay", js: "IntrstPay", typ: r("IntrstPay") },
        { json: "NetTaxLiability", js: "NetTaxLiability", typ: 0 },
        { json: "Rebate87A", js: "Rebate87A", typ: 0 },
        { json: "Surcharge25ofSI", js: "Surcharge25ofSI", typ: 0 },
        { json: "Surcharge25ofSIBeforeMarginal", js: "Surcharge25ofSIBeforeMarginal", typ: 0 },
        { json: "SurchargeOnAboveCrore", js: "SurchargeOnAboveCrore", typ: 0 },
        { json: "SurchargeOnAboveCroreBeforeMarginal", js: "SurchargeOnAboveCroreBeforeMarginal", typ: 0 },
        { json: "TaxPayAfterCreditUs115JD", js: "TaxPayAfterCreditUs115JD", typ: 0 },
        { json: "TaxPayableOnRebate", js: "TaxPayableOnRebate", typ: 0 },
        { json: "TaxPayableOnTI", js: "TaxPayableOnTI", typ: r("TaxPayableOnTI") },
        { json: "TaxRelief", js: "TaxRelief", typ: u(undefined, r("TaxRelief")) },
        { json: "TotalSurcharge", js: "TotalSurcharge", typ: 0 },
    ], false),
    "GrossTaxPay": o([
        { json: "TaxDeferred17", js: "TaxDeferred17", typ: 0 },
        { json: "TaxDeferredPayableCY", js: "TaxDeferredPayableCY", typ: 0 },
        { json: "TaxInc17", js: "TaxInc17", typ: 0 },
    ], false),
    "IntrstPay": o([
        { json: "IntrstPayUs234A", js: "IntrstPayUs234A", typ: 0 },
        { json: "IntrstPayUs234B", js: "IntrstPayUs234B", typ: 0 },
        { json: "IntrstPayUs234C", js: "IntrstPayUs234C", typ: 0 },
        { json: "LateFilingFee234F", js: "LateFilingFee234F", typ: 0 },
        { json: "TotalIntrstPay", js: "TotalIntrstPay", typ: 0 },
    ], false),
    "TaxPayableOnTI": o([
        { json: "RebateOnAgriInc", js: "RebateOnAgriInc", typ: 0 },
        { json: "TaxAtNormalRatesOnAggrInc", js: "TaxAtNormalRatesOnAggrInc", typ: 0 },
        { json: "TaxAtSpecialRates", js: "TaxAtSpecialRates", typ: 0 },
        { json: "TaxPayableOnTotInc", js: "TaxPayableOnTotInc", typ: 0 },
    ], false),
    "TaxRelief": o([
        { json: "Section89", js: "Section89", typ: u(undefined, 0) },
        { json: "Section90", js: "Section90", typ: u(undefined, 0) },
        { json: "Section91", js: "Section91", typ: u(undefined, 0) },
        { json: "TotTaxRelief", js: "TotTaxRelief", typ: 0 },
    ], false),
    "Refund": o([
        { json: "BankAccountDtls", js: "BankAccountDtls", typ: r("BankAccountDtls") },
        { json: "RefundDue", js: "RefundDue", typ: 0 },
    ], false),
    "BankAccountDtls": o([
        { json: "AddtnlBankDetails", js: "AddtnlBankDetails", typ: u(undefined, a(r("BankDetailType"))) },
        { json: "BankDtlsFlag", js: "BankDtlsFlag", typ: r("TaxRescertifiedFlag") },
        { json: "ForeignBankDetails", js: "ForeignBankDetails", typ: u(undefined, a(r("ForeignBankDtls"))) },
    ], false),
    "BankDetailType": o([
        { json: "AccountType", js: "AccountType", typ: r("AccountType") },
        { json: "BankAccountNo", js: "BankAccountNo", typ: "" },
        { json: "BankName", js: "BankName", typ: "" },
        { json: "IFSCCode", js: "IFSCCode", typ: "" },
    ], false),
    "ForeignBankDtls": o([
        { json: "BankName", js: "BankName", typ: "" },
        { json: "CountryCode", js: "CountryCode", typ: r("CountryCode") },
        { json: "IBAN", js: "IBAN", typ: "" },
        { json: "SWIFTCode", js: "SWIFTCode", typ: "" },
    ], false),
    "TaxPaid": o([
        { json: "BalTaxPayable", js: "BalTaxPayable", typ: u(undefined, 0) },
        { json: "TaxesPaid", js: "TaxesPaid", typ: r("TaxesPaid") },
    ], false),
    "TaxesPaid": o([
        { json: "AdvanceTax", js: "AdvanceTax", typ: 0 },
        { json: "SelfAssessmentTax", js: "SelfAssessmentTax", typ: 0 },
        { json: "TCS", js: "TCS", typ: 0 },
        { json: "TDS", js: "TDS", typ: 0 },
        { json: "TotalTaxesPaid", js: "TotalTaxesPaid", typ: 0 },
    ], false),
    "Schedule112A": o([
        { json: "AcquisitionCost112A", js: "AcquisitionCost112A", typ: 0 },
        { json: "Balance112A", js: "Balance112A", typ: 0 },
        { json: "CostAcqWithoutIndx112A", js: "CostAcqWithoutIndx112A", typ: 0 },
        { json: "Deductions112A", js: "Deductions112A", typ: 0 },
        { json: "ExpExclCnctTransfer112A", js: "ExpExclCnctTransfer112A", typ: 0 },
        { json: "FairMktValueCapAst112A", js: "FairMktValueCapAst112A", typ: 0 },
        { json: "LTCGBeforelowerB1B2112A", js: "LTCGBeforelowerB1B2112A", typ: 0 },
        { json: "SaleValue112A", js: "SaleValue112A", typ: 0 },
        { json: "Schedule112ADtls", js: "Schedule112ADtls", typ: u(undefined, a(r("Schedule112A115ADType"))) },
    ], false),
    "Schedule112A115ADType": o([
        { json: "AcquisitionCost", js: "AcquisitionCost", typ: 3.14 },
        { json: "Balance", js: "Balance", typ: 0 },
        { json: "CostAcqWithoutIndx", js: "CostAcqWithoutIndx", typ: 0 },
        { json: "ExpExclCnctTransfer", js: "ExpExclCnctTransfer", typ: 3.14 },
        { json: "FairMktValuePerShareunit", js: "FairMktValuePerShareunit", typ: 3.14 },
        { json: "ISINCode", js: "ISINCode", typ: "" },
        { json: "LTCGBeforelowerB1B2", js: "LTCGBeforelowerB1B2", typ: 0 },
        { json: "NumSharesUnits", js: "NumSharesUnits", typ: u(undefined, 3.14) },
        { json: "SalePricePerShareUnit", js: "SalePricePerShareUnit", typ: u(undefined, 3.14) },
        { json: "ShareOnOrBefore", js: "ShareOnOrBefore", typ: r("ShareOnOrBefore") },
        { json: "ShareUnitName", js: "ShareUnitName", typ: "" },
        { json: "TotFairMktValueCapAst", js: "TotFairMktValueCapAst", typ: 0 },
        { json: "TotSaleValue", js: "TotSaleValue", typ: 0 },
        { json: "TotalDeductions", js: "TotalDeductions", typ: 0 },
    ], false),
    "Schedule115AD": o([
        { json: "AcquisitionCost115AD", js: "AcquisitionCost115AD", typ: 0 },
        { json: "Balance115AD", js: "Balance115AD", typ: 0 },
        { json: "CostAcqWithoutIndx115AD", js: "CostAcqWithoutIndx115AD", typ: 0 },
        { json: "Deductions115AD", js: "Deductions115AD", typ: 0 },
        { json: "ExpExclCnctTransfer115AD", js: "ExpExclCnctTransfer115AD", typ: 0 },
        { json: "FairMktValueCapAst115AD", js: "FairMktValueCapAst115AD", typ: 0 },
        { json: "LTCGBeforelowerB1B2115AD", js: "LTCGBeforelowerB1B2115AD", typ: 0 },
        { json: "SaleValue115AD", js: "SaleValue115AD", typ: 0 },
        { json: "Schedule115ADDtls", js: "Schedule115ADDtls", typ: u(undefined, a(r("Schedule112A115ADType"))) },
    ], false),
    "Schedule5A2014": o([
        { json: "AadhaarOfSpouse", js: "AadhaarOfSpouse", typ: u(undefined, "") },
        { json: "CapGainHeadIncome", js: "CapGainHeadIncome", typ: r("Sch5AIncType") },
        { json: "HPHeadIncome", js: "HPHeadIncome", typ: r("Sch5AIncType") },
        { json: "NameOfSpouse", js: "NameOfSpouse", typ: "" },
        { json: "OtherSourcesHeadIncome", js: "OtherSourcesHeadIncome", typ: r("Sch5AIncType") },
        { json: "PANOfSpouse", js: "PANOfSpouse", typ: "" },
        { json: "TotalHeadIncome", js: "TotalHeadIncome", typ: r("Sch5AIncType") },
    ], false),
    "Sch5AIncType": o([
        { json: "AmtApprndOfSpouse", js: "AmtApprndOfSpouse", typ: 0 },
        { json: "AmtTDSDeducted", js: "AmtTDSDeducted", typ: 0 },
        { json: "IncRecvdUndHead", js: "IncRecvdUndHead", typ: 0 },
        { json: "TDSApprndOfSpouse", js: "TDSApprndOfSpouse", typ: 0 },
    ], false),
    "Schedule80D": o([
        { json: "Sec80DSelfFamSrCtznHealth", js: "Sec80DSelfFamSrCtznHealth", typ: u(undefined, r("Sec80DSelfFamSrCtznHealth")) },
    ], false),
    "Sec80DSelfFamSrCtznHealth": o([
        { json: "EligibleAmountOfDedn", js: "EligibleAmountOfDedn", typ: 0 },
        { json: "HealthInsPremSlfFam", js: "HealthInsPremSlfFam", typ: u(undefined, 0) },
        { json: "HlthInsPremParents", js: "HlthInsPremParents", typ: u(undefined, 0) },
        { json: "HlthInsPremParentsSrCtzn", js: "HlthInsPremParentsSrCtzn", typ: u(undefined, 0) },
        { json: "HlthInsPremSlfFamSrCtzn", js: "HlthInsPremSlfFamSrCtzn", typ: u(undefined, 0) },
        { json: "MedicalExpParentsSrCtzn", js: "MedicalExpParentsSrCtzn", typ: u(undefined, 0) },
        { json: "MedicalExpSlfFamSrCtzn", js: "MedicalExpSlfFamSrCtzn", typ: u(undefined, 0) },
        { json: "Parents", js: "Parents", typ: 0 },
        { json: "ParentsSeniorCitizen", js: "ParentsSeniorCitizen", typ: 0 },
        { json: "ParentsSeniorCitizenFlag", js: "ParentsSeniorCitizenFlag", typ: u(undefined, "") },
        { json: "PrevHlthChckUpParents", js: "PrevHlthChckUpParents", typ: u(undefined, 0) },
        { json: "PrevHlthChckUpParentsSrCtzn", js: "PrevHlthChckUpParentsSrCtzn", typ: u(undefined, 0) },
        { json: "PrevHlthChckUpSlfFam", js: "PrevHlthChckUpSlfFam", typ: u(undefined, 0) },
        { json: "PrevHlthChckUpSlfFamSrCtzn", js: "PrevHlthChckUpSlfFamSrCtzn", typ: u(undefined, 0) },
        { json: "SelfAndFamily", js: "SelfAndFamily", typ: 0 },
        { json: "SelfAndFamilySeniorCitizen", js: "SelfAndFamilySeniorCitizen", typ: 0 },
        { json: "SeniorCitizenFlag", js: "SeniorCitizenFlag", typ: u(undefined, "") },
    ], false),
    "Schedule80DD": o([
        { json: "DeductionAmount", js: "DeductionAmount", typ: 0 },
        { json: "DependentAadhaar", js: "DependentAadhaar", typ: u(undefined, "") },
        { json: "DependentPan", js: "DependentPan", typ: u(undefined, "") },
        { json: "DependentType", js: "DependentType", typ: r("DependentType") },
        { json: "Form10IAAckNum", js: "Form10IAAckNum", typ: u(undefined, "") },
        { json: "Form10IAFilingDate", js: "Form10IAFilingDate", typ: u(undefined, "") },
        { json: "NatureOfDisability", js: "NatureOfDisability", typ: r("NatureOfDisability") },
        { json: "UDIDNum", js: "UDIDNum", typ: u(undefined, "") },
    ], false),
    "Schedule80G": o([
        { json: "Don100Percent", js: "Don100Percent", typ: u(undefined, r("Don100Percent")) },
        { json: "Don100PercentApprReqd", js: "Don100PercentApprReqd", typ: u(undefined, r("Don100PercentApprReqd")) },
        { json: "Don50PercentApprReqd", js: "Don50PercentApprReqd", typ: u(undefined, r("Don50PercentApprReqd")) },
        { json: "Don50PercentNoApprReqd", js: "Don50PercentNoApprReqd", typ: u(undefined, r("Don50PercentNoApprReqd")) },
        { json: "TotalDonationsUs80G", js: "TotalDonationsUs80G", typ: 0 },
        { json: "TotalDonationsUs80GCash", js: "TotalDonationsUs80GCash", typ: 0 },
        { json: "TotalDonationsUs80GOtherMode", js: "TotalDonationsUs80GOtherMode", typ: 0 },
        { json: "TotalEligibleDonationsUs80G", js: "TotalEligibleDonationsUs80G", typ: 0 },
    ], false),
    "Don100Percent": o([
        { json: "DoneeWithPan", js: "DoneeWithPan", typ: u(undefined, a(r("DoneeWithPan"))) },
        { json: "TotDon100Percent", js: "TotDon100Percent", typ: 0 },
        { json: "TotDon100PercentCash", js: "TotDon100PercentCash", typ: 0 },
        { json: "TotDon100PercentOtherMode", js: "TotDon100PercentOtherMode", typ: 0 },
        { json: "TotEligibleDon100Percent", js: "TotEligibleDon100Percent", typ: 0 },
    ], false),
    "DoneeWithPan": o([
        { json: "AddressDetail", js: "AddressDetail", typ: r("AddressDetail80G") },
        { json: "ArnNbr", js: "ArnNbr", typ: u(undefined, "") },
        { json: "DonationAmt", js: "DonationAmt", typ: 0 },
        { json: "DonationAmtCash", js: "DonationAmtCash", typ: 0 },
        { json: "DonationAmtOtherMode", js: "DonationAmtOtherMode", typ: 0 },
        { json: "DoneePAN", js: "DoneePAN", typ: "" },
        { json: "DoneeWithPanName", js: "DoneeWithPanName", typ: "" },
        { json: "EligibleDonationAmt", js: "EligibleDonationAmt", typ: 0 },
    ], false),
    "AddressDetail80G": o([
        { json: "AddrDetail", js: "AddrDetail", typ: "" },
        { json: "CityOrTownOrDistrict", js: "CityOrTownOrDistrict", typ: "" },
        { json: "PinCode", js: "PinCode", typ: 0 },
        { json: "StateCode", js: "StateCode", typ: r("PurpleStateCode") },
    ], false),
    "Don100PercentApprReqd": o([
        { json: "DoneeWithPan", js: "DoneeWithPan", typ: u(undefined, a(r("DoneeWithPan"))) },
        { json: "TotDon100PercentApprReqd", js: "TotDon100PercentApprReqd", typ: 0 },
        { json: "TotDon100PercentApprReqdCash", js: "TotDon100PercentApprReqdCash", typ: 0 },
        { json: "TotDon100PercentApprReqdOtherMode", js: "TotDon100PercentApprReqdOtherMode", typ: 0 },
        { json: "TotEligibleDon100PercentApprReqd", js: "TotEligibleDon100PercentApprReqd", typ: 0 },
    ], false),
    "Don50PercentApprReqd": o([
        { json: "DoneeWithPan", js: "DoneeWithPan", typ: u(undefined, a(r("DoneeWithPan"))) },
        { json: "TotDon50PercentApprReqd", js: "TotDon50PercentApprReqd", typ: 0 },
        { json: "TotDon50PercentApprReqdCash", js: "TotDon50PercentApprReqdCash", typ: 0 },
        { json: "TotDon50PercentApprReqdOtherMode", js: "TotDon50PercentApprReqdOtherMode", typ: 0 },
        { json: "TotEligibleDon50PercentApprReqd", js: "TotEligibleDon50PercentApprReqd", typ: 0 },
    ], false),
    "Don50PercentNoApprReqd": o([
        { json: "DoneeWithPan", js: "DoneeWithPan", typ: u(undefined, a(r("DoneeWithPan"))) },
        { json: "TotDon50PercentNoApprReqd", js: "TotDon50PercentNoApprReqd", typ: 0 },
        { json: "TotDon50PercentNoApprReqdCash", js: "TotDon50PercentNoApprReqdCash", typ: 0 },
        { json: "TotDon50PercentNoApprReqdOtherMode", js: "TotDon50PercentNoApprReqdOtherMode", typ: 0 },
        { json: "TotEligibleDon50Percent", js: "TotEligibleDon50Percent", typ: 0 },
    ], false),
    "Schedule80GGA": o([
        { json: "DonationDtlsSciRsrchRuralDev", js: "DonationDtlsSciRsrchRuralDev", typ: u(undefined, a(r("DonationDtlsSciRsrchRuralDev"))) },
        { json: "TotalDonationAmtCash80GGA", js: "TotalDonationAmtCash80GGA", typ: 0 },
        { json: "TotalDonationAmtOtherMode80GGA", js: "TotalDonationAmtOtherMode80GGA", typ: 0 },
        { json: "TotalDonationsUs80GGA", js: "TotalDonationsUs80GGA", typ: 0 },
        { json: "TotalEligibleDonationAmt80GGA", js: "TotalEligibleDonationAmt80GGA", typ: 0 },
    ], false),
    "DonationDtlsSciRsrchRuralDev": o([
        { json: "AddressDetail", js: "AddressDetail", typ: r("AddressDetail80G") },
        { json: "DonationAmt", js: "DonationAmt", typ: 0 },
        { json: "DonationAmtCash", js: "DonationAmtCash", typ: 0 },
        { json: "DonationAmtOtherMode", js: "DonationAmtOtherMode", typ: 0 },
        { json: "DoneePAN", js: "DoneePAN", typ: "" },
        { json: "EligibleDonationAmt", js: "EligibleDonationAmt", typ: 0 },
        { json: "NameOfDonee", js: "NameOfDonee", typ: "" },
        { json: "RelevantClauseUndrDedClaimed", js: "RelevantClauseUndrDedClaimed", typ: r("RelevantClauseUndrDedClaimed") },
    ], false),
    "Schedule80GGC": o([
        { json: "Schedule80GGCDetails", js: "Schedule80GGCDetails", typ: u(undefined, a(r("Schedule80GGCDetail"))) },
        { json: "TotalDonationAmtCash80GGC", js: "TotalDonationAmtCash80GGC", typ: 0 },
        { json: "TotalDonationAmtOtherMode80GGC", js: "TotalDonationAmtOtherMode80GGC", typ: 0 },
        { json: "TotalDonationsUs80GGC", js: "TotalDonationsUs80GGC", typ: 0 },
        { json: "TotalEligibleDonationAmt80GGC", js: "TotalEligibleDonationAmt80GGC", typ: 0 },
    ], false),
    "Schedule80GGCDetail": o([
        { json: "DonationAmt", js: "DonationAmt", typ: 0 },
        { json: "DonationAmtCash", js: "DonationAmtCash", typ: 0 },
        { json: "DonationAmtOtherMode", js: "DonationAmtOtherMode", typ: 0 },
        { json: "DonationDate", js: "DonationDate", typ: "" },
        { json: "EligibleDonationAmt", js: "EligibleDonationAmt", typ: 0 },
        { json: "IFSCCode", js: "IFSCCode", typ: u(undefined, "") },
        { json: "TransactionRefNum", js: "TransactionRefNum", typ: u(undefined, "") },
    ], false),
    "Schedule80U": o([
        { json: "DeductionAmount", js: "DeductionAmount", typ: 0 },
        { json: "Form10IAAckNum", js: "Form10IAAckNum", typ: u(undefined, "") },
        { json: "Form10IAFilingDate", js: "Form10IAFilingDate", typ: u(undefined, "") },
        { json: "NatureOfDisability", js: "NatureOfDisability", typ: r("NatureOfDisability") },
        { json: "UDIDNum", js: "UDIDNum", typ: u(undefined, "") },
    ], false),
    "ScheduleAL": o([
        { json: "ImmovableDetails", js: "ImmovableDetails", typ: u(undefined, a(r("ImmovableDetails"))) },
        { json: "LiabilityInRelatAssets", js: "LiabilityInRelatAssets", typ: 0 },
        { json: "MovableAsset", js: "MovableAsset", typ: r("MovableAsset") },
    ], false),
    "ImmovableDetails": o([
        { json: "AddressAL", js: "AddressAL", typ: r("AddressAL") },
        { json: "Amount", js: "Amount", typ: 0 },
        { json: "Description", js: "Description", typ: "" },
    ], false),
    "AddressAL": o([
        { json: "CityOrTownOrDistrict", js: "CityOrTownOrDistrict", typ: "" },
        { json: "CountryCode", js: "CountryCode", typ: r("CountryCode") },
        { json: "LocalityOrArea", js: "LocalityOrArea", typ: "" },
        { json: "PinCode", js: "PinCode", typ: u(undefined, 0) },
        { json: "ResidenceName", js: "ResidenceName", typ: u(undefined, "") },
        { json: "ResidenceNo", js: "ResidenceNo", typ: "" },
        { json: "RoadOrStreet", js: "RoadOrStreet", typ: u(undefined, "") },
        { json: "StateCode", js: "StateCode", typ: r("StateCode") },
        { json: "ZipCode", js: "ZipCode", typ: u(undefined, "") },
    ], false),
    "MovableAsset": o([
        { json: "ArchCollDrawPaintSulpArt", js: "ArchCollDrawPaintSulpArt", typ: 0 },
        { json: "CashInHand", js: "CashInHand", typ: 0 },
        { json: "DepositsInBank", js: "DepositsInBank", typ: 0 },
        { json: "InsurancePolicies", js: "InsurancePolicies", typ: 0 },
        { json: "JewelleryBullionEtc", js: "JewelleryBullionEtc", typ: 0 },
        { json: "LoansAndAdvancesGiven", js: "LoansAndAdvancesGiven", typ: 0 },
        { json: "SharesAndSecurities", js: "SharesAndSecurities", typ: 0 },
        { json: "VehiclYachtsBoatsAircrafts", js: "VehiclYachtsBoatsAircrafts", typ: 0 },
    ], false),
    "ScheduleAMT": o([
        { json: "AdjustedUnderSec115JC", js: "AdjustedUnderSec115JC", typ: 0 },
        { json: "DeductionClaimUndrAnySec", js: "DeductionClaimUndrAnySec", typ: 0 },
        { json: "TaxPayableUnderSec115JC", js: "TaxPayableUnderSec115JC", typ: 0 },
        { json: "TotalIncItemPartBTI", js: "TotalIncItemPartBTI", typ: 0 },
    ], false),
    "ScheduleAMTC": o([
        { json: "AmtLiabilityAvailable", js: "AmtLiabilityAvailable", typ: 0 },
        { json: "AmtTaxCreditAvailable", js: "AmtTaxCreditAvailable", typ: 0 },
        { json: "CurrAssYr", js: "CurrAssYr", typ: u(undefined, r("CurrAssYr")) },
        { json: "CurrYrAmtCreditFwd", js: "CurrYrAmtCreditFwd", typ: 0 },
        { json: "CurrYrCreditCarryFwd", js: "CurrYrCreditCarryFwd", typ: 0 },
        { json: "ScheduleAMTCDtls", js: "ScheduleAMTCDtls", typ: u(undefined, a(r("ScheduleAMTCDtls"))) },
        { json: "TaxOthProvisions", js: "TaxOthProvisions", typ: 0 },
        { json: "TaxSection115JC", js: "TaxSection115JC", typ: 0 },
        { json: "TaxSection115JD", js: "TaxSection115JD", typ: 0 },
        { json: "TotAMTGross", js: "TotAMTGross", typ: 0 },
        { json: "TotAmtCreditUtilisedCY", js: "TotAmtCreditUtilisedCY", typ: u(undefined, 0) },
        { json: "TotBalAMTCreditCF", js: "TotBalAMTCreditCF", typ: 0 },
        { json: "TotBalBF", js: "TotBalBF", typ: 0 },
        { json: "TotSetOffEys", js: "TotSetOffEys", typ: 0 },
    ], false),
    "ScheduleAMTCDtls": o([
        { json: "AmtCreditBalBroughtFwd", js: "AmtCreditBalBroughtFwd", typ: 0 },
        { json: "AmtCreditSetOfEy", js: "AmtCreditSetOfEy", typ: 0 },
        { json: "AmtCreditUtilized", js: "AmtCreditUtilized", typ: 0 },
        { json: "AssYr", js: "AssYr", typ: r("AssYr") },
        { json: "BalAmtCreditCarryFwd", js: "BalAmtCreditCarryFwd", typ: 0 },
        { json: "Gross", js: "Gross", typ: 0 },
    ], false),
    "ScheduleBFLA": o([
        { json: "BFLAEditFlag", js: "BFLAEditFlag", typ: u(undefined, "") },
        { json: "HP", js: "HP", typ: u(undefined, r("ScheduleBFLAHP")) },
        { json: "IncomeOfCurrYrAftCYLABFLA", js: "IncomeOfCurrYrAftCYLABFLA", typ: 0 },
        { json: "LTCG10Per", js: "LTCG10Per", typ: r("ScheduleBFLALTCG10Per") },
        { json: "LTCG20Per", js: "LTCG20Per", typ: r("ScheduleBFLALTCG20Per") },
        { json: "LTCGDTAARate", js: "LTCGDTAARate", typ: r("ScheduleBFLALTCGDTAARate") },
        { json: "OthSrcExclRaceHorse", js: "OthSrcExclRaceHorse", typ: u(undefined, r("ScheduleBFLAOthSrcExclRaceHorse")) },
        { json: "OthSrcRaceHorse", js: "OthSrcRaceHorse", typ: u(undefined, r("ScheduleBFLAOthSrcRaceHorse")) },
        { json: "STCG15Per", js: "STCG15Per", typ: r("ScheduleBFLASTCG15Per") },
        { json: "STCG30Per", js: "STCG30Per", typ: r("ScheduleBFLASTCG30Per") },
        { json: "STCGAppRate", js: "STCGAppRate", typ: r("ScheduleBFLASTCGAppRate") },
        { json: "STCGDTAARate", js: "STCGDTAARate", typ: r("ScheduleBFLASTCGDTAARate") },
        { json: "Salary", js: "Salary", typ: r("ScheduleBFLASalary") },
        { json: "TotalBFLossSetOff", js: "TotalBFLossSetOff", typ: r("TotalBFLossSetOff") },
    ], false),
    "ScheduleBFLAHP": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "IncBFLA": o([
        { json: "BFlossPrevYrUndSameHeadSetoff", js: "BFlossPrevYrUndSameHeadSetoff", typ: 0 },
        { json: "IncOfCurYrAfterSetOffBFLosses", js: "IncOfCurYrAfterSetOffBFLosses", typ: 0 },
        { json: "IncOfCurYrUndHeadFromCYLA", js: "IncOfCurYrUndHeadFromCYLA", typ: 0 },
    ], false),
    "ScheduleBFLALTCG10Per": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLALTCG20Per": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLALTCGDTAARate": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLAOthSrcExclRaceHorse": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("SalaryOthSrcIncBFLA") },
    ], false),
    "SalaryOthSrcIncBFLA": o([
        { json: "IncOfCurYrAfterSetOffBFLosses", js: "IncOfCurYrAfterSetOffBFLosses", typ: 0 },
        { json: "IncOfCurYrUndHeadFromCYLA", js: "IncOfCurYrUndHeadFromCYLA", typ: 0 },
    ], false),
    "ScheduleBFLAOthSrcRaceHorse": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLASTCG15Per": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLASTCG30Per": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLASTCGAppRate": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLASTCGDTAARate": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("IncBFLA") },
    ], false),
    "ScheduleBFLASalary": o([
        { json: "IncBFLA", js: "IncBFLA", typ: r("SalaryOthSrcIncBFLA") },
    ], false),
    "TotalBFLossSetOff": o([
        { json: "TotBFLossSetoff", js: "TotBFLossSetoff", typ: 0 },
    ], false),
    "ScheduleCFL": o([
        { json: "AdjTotBFLossInBFLA", js: "AdjTotBFLossInBFLA", typ: u(undefined, r("AdjTotBFLossInBFLA")) },
        { json: "CurrentAYloss", js: "CurrentAYloss", typ: u(undefined, r("CurrentAYloss")) },
        { json: "LossCFFromPrev2ndYearFromAY", js: "LossCFFromPrev2ndYearFromAY", typ: u(undefined, r("LossCFFromPrev2NdYearFromAY")) },
        { json: "LossCFFromPrev3rdYearFromAY", js: "LossCFFromPrev3rdYearFromAY", typ: u(undefined, r("LossCFFromPrev3RDYearFromAY")) },
        { json: "LossCFFromPrev4thYearFromAY", js: "LossCFFromPrev4thYearFromAY", typ: u(undefined, r("LossCFFromPrev4ThYearFromAY")) },
        { json: "LossCFFromPrev5thYearFromAY", js: "LossCFFromPrev5thYearFromAY", typ: u(undefined, r("LossCFFromPrev5ThYearFromAY")) },
        { json: "LossCFFromPrev6thYearFromAY", js: "LossCFFromPrev6thYearFromAY", typ: u(undefined, r("LossCFFromPrev6ThYearFromAY")) },
        { json: "LossCFFromPrev7thYearFromAY", js: "LossCFFromPrev7thYearFromAY", typ: u(undefined, r("LossCFFromPrev7ThYearFromAY")) },
        { json: "LossCFFromPrev8thYearFromAY", js: "LossCFFromPrev8thYearFromAY", typ: u(undefined, r("LossCFFromPrev8ThYearFromAY")) },
        { json: "LossCFFromPrevYrToAY", js: "LossCFFromPrevYrToAY", typ: u(undefined, r("LossCFFromPrevYrToAY")) },
        { json: "TotalLossCFSummary", js: "TotalLossCFSummary", typ: r("TotalLossCFSummary") },
        { json: "TotalOfBFLossesEarlierYrs", js: "TotalOfBFLossesEarlierYrs", typ: r("TotalOfBFLossesEarlierYrs") },
    ], false),
    "AdjTotBFLossInBFLA": o([
        { json: "LossSummaryDetail", js: "LossSummaryDetail", typ: r("LossSummaryDetail") },
    ], false),
    "LossSummaryDetail": o([
        { json: "OthSrcLossRaceHorseCF", js: "OthSrcLossRaceHorseCF", typ: u(undefined, 0) },
        { json: "TotalHPPTILossCF", js: "TotalHPPTILossCF", typ: 0 },
        { json: "TotalLTCGPTILossCF", js: "TotalLTCGPTILossCF", typ: 0 },
        { json: "TotalSTCGPTILossCF", js: "TotalSTCGPTILossCF", typ: 0 },
    ], false),
    "CurrentAYloss": o([
        { json: "LossSummaryDetail", js: "LossSummaryDetail", typ: r("LossSummaryDetail") },
    ], false),
    "LossCFFromPrev2NdYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdLossDetail") },
    ], false),
    "CarryFwdLossDetail": o([
        { json: "DateOfFiling", js: "DateOfFiling", typ: "" },
        { json: "OthSrcLossRaceHorseCF", js: "OthSrcLossRaceHorseCF", typ: u(undefined, 0) },
        { json: "TotalHPPTILossCF", js: "TotalHPPTILossCF", typ: 0 },
        { json: "TotalLTCGPTILossCF", js: "TotalLTCGPTILossCF", typ: 0 },
        { json: "TotalSTCGPTILossCF", js: "TotalSTCGPTILossCF", typ: 0 },
    ], false),
    "LossCFFromPrev3RDYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdLossDetail") },
    ], false),
    "LossCFFromPrev4ThYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdLossDetail") },
    ], false),
    "LossCFFromPrev5ThYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdWithoutLossDetail") },
    ], false),
    "CarryFwdWithoutLossDetail": o([
        { json: "DateOfFiling", js: "DateOfFiling", typ: "" },
        { json: "TotalHPPTILossCF", js: "TotalHPPTILossCF", typ: u(undefined, 0) },
        { json: "TotalLTCGPTILossCF", js: "TotalLTCGPTILossCF", typ: u(undefined, 0) },
        { json: "TotalSTCGPTILossCF", js: "TotalSTCGPTILossCF", typ: u(undefined, 0) },
    ], false),
    "LossCFFromPrev6ThYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdWithoutLossDetail") },
    ], false),
    "LossCFFromPrev7ThYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdWithoutLossDetail") },
    ], false),
    "LossCFFromPrev8ThYearFromAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdWithoutLossDetail") },
    ], false),
    "LossCFFromPrevYrToAY": o([
        { json: "CarryFwdLossDetail", js: "CarryFwdLossDetail", typ: r("CarryFwdLossDetail") },
    ], false),
    "TotalLossCFSummary": o([
        { json: "LossSummaryDetail", js: "LossSummaryDetail", typ: r("LossSummaryDetail") },
    ], false),
    "TotalOfBFLossesEarlierYrs": o([
        { json: "LossSummaryDetail", js: "LossSummaryDetail", typ: r("LossSummaryDetail") },
    ], false),
    "ScheduleCGFor23": o([
        { json: "AccruOrRecOfCG", js: "AccruOrRecOfCG", typ: r("AccruOrRecOfCG") },
        { json: "CurrYrLosses", js: "CurrYrLosses", typ: r("CurrYrLosses") },
        { json: "DeducClaimInfo", js: "DeducClaimInfo", typ: u(undefined, r("DeducClaimInfo")) },
        { json: "IncmFromVDATrnsf", js: "IncmFromVDATrnsf", typ: 0 },
        { json: "LongTermCapGain23", js: "LongTermCapGain23", typ: r("LongTermCapGain23") },
        { json: "ShortTermCapGainFor23", js: "ShortTermCapGainFor23", typ: r("ShortTermCapGainFor23") },
        { json: "SumOfCGIncm", js: "SumOfCGIncm", typ: 0 },
        { json: "TotScheduleCGFor23", js: "TotScheduleCGFor23", typ: 0 },
    ], false),
    "AccruOrRecOfCG": o([
        { json: "LongTermUnder10Per", js: "LongTermUnder10Per", typ: r("DateRangeType") },
        { json: "LongTermUnder20Per", js: "LongTermUnder20Per", typ: r("DateRangeType") },
        { json: "LongTermUnderDTAARate", js: "LongTermUnderDTAARate", typ: r("DateRangeType") },
        { json: "ShortTermUnder15Per", js: "ShortTermUnder15Per", typ: r("DateRangeType") },
        { json: "ShortTermUnder30Per", js: "ShortTermUnder30Per", typ: r("DateRangeType") },
        { json: "ShortTermUnderAppRate", js: "ShortTermUnderAppRate", typ: r("DateRangeType") },
        { json: "ShortTermUnderDTAARate", js: "ShortTermUnderDTAARate", typ: r("DateRangeType") },
        { json: "VDATrnsfGainsUnder30Per", js: "VDATrnsfGainsUnder30Per", typ: u(undefined, r("DateRangeType")) },
    ], false),
    "DateRangeType": o([
        { json: "DateRange", js: "DateRange", typ: r("DateRange") },
    ], false),
    "DateRange": o([
        { json: "Up16Of12To15Of3", js: "Up16Of12To15Of3", typ: 0 },
        { json: "Up16Of3To31Of3", js: "Up16Of3To31Of3", typ: 0 },
        { json: "Up16Of9To15Of12", js: "Up16Of9To15Of12", typ: 0 },
        { json: "Upto15Of6", js: "Upto15Of6", typ: 0 },
        { json: "Upto15Of9", js: "Upto15Of9", typ: 0 },
    ], false),
    "CurrYrLosses": o([
        { json: "InLossSetOff", js: "InLossSetOff", typ: r("InLossSetOff") },
        { json: "InLtcg10Per", js: "InLtcg10Per", typ: r("InLtcg10Per") },
        { json: "InLtcg20Per", js: "InLtcg20Per", typ: r("InLtcg20Per") },
        { json: "InLtcgDTAARate", js: "InLtcgDTAARate", typ: r("InLtcgDTAARate") },
        { json: "InStcg15Per", js: "InStcg15Per", typ: r("InStcg15Per") },
        { json: "InStcg30Per", js: "InStcg30Per", typ: r("InStcg30Per") },
        { json: "InStcgAppRate", js: "InStcgAppRate", typ: r("InStcgAppRate") },
        { json: "InStcgDTAARate", js: "InStcgDTAARate", typ: r("InStcgDTAARate") },
        { json: "LossRemainSetOff", js: "LossRemainSetOff", typ: r("LossRemainSetOff") },
        { json: "TotLossSetOff", js: "TotLossSetOff", typ: r("TotLossSetOff") },
    ], false),
    "InLossSetOff": o([
        { json: "LtclSetOff10Per", js: "LtclSetOff10Per", typ: 0 },
        { json: "LtclSetOff20Per", js: "LtclSetOff20Per", typ: 0 },
        { json: "LtclSetOffDTAARate", js: "LtclSetOffDTAARate", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InLtcg10Per": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "LtclSetOff20Per", js: "LtclSetOff20Per", typ: 0 },
        { json: "LtclSetOffDTAARate", js: "LtclSetOffDTAARate", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InLtcg20Per": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "LtclSetOff10Per", js: "LtclSetOff10Per", typ: 0 },
        { json: "LtclSetOffDTAARate", js: "LtclSetOffDTAARate", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InLtcgDTAARate": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "LtclSetOff10Per", js: "LtclSetOff10Per", typ: 0 },
        { json: "LtclSetOff20Per", js: "LtclSetOff20Per", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InStcg15Per": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InStcg30Per": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InStcgAppRate": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "InStcgDTAARate": o([
        { json: "CurrYearIncome", js: "CurrYearIncome", typ: 0 },
        { json: "CurrYrCapGain", js: "CurrYrCapGain", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
    ], false),
    "LossRemainSetOff": o([
        { json: "LtclSetOff10Per", js: "LtclSetOff10Per", typ: 0 },
        { json: "LtclSetOff20Per", js: "LtclSetOff20Per", typ: 0 },
        { json: "LtclSetOffDTAARate", js: "LtclSetOffDTAARate", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "TotLossSetOff": o([
        { json: "LtclSetOff10Per", js: "LtclSetOff10Per", typ: 0 },
        { json: "LtclSetOff20Per", js: "LtclSetOff20Per", typ: 0 },
        { json: "LtclSetOffDTAARate", js: "LtclSetOffDTAARate", typ: 0 },
        { json: "StclSetoff15Per", js: "StclSetoff15Per", typ: 0 },
        { json: "StclSetoff30Per", js: "StclSetoff30Per", typ: 0 },
        { json: "StclSetoffAppRate", js: "StclSetoffAppRate", typ: 0 },
        { json: "StclSetoffDTAARate", js: "StclSetoffDTAARate", typ: 0 },
    ], false),
    "DeducClaimInfo": o([
        { json: "DeducClaimDtlsUs115F", js: "DeducClaimDtlsUs115F", typ: u(undefined, a(r("DeducClaimDtls115F"))) },
        { json: "DeducClaimDtlsUs54", js: "DeducClaimDtlsUs54", typ: u(undefined, a(r("DeducClaimDtls54N54F"))) },
        { json: "DeducClaimDtlsUs54B", js: "DeducClaimDtlsUs54B", typ: u(undefined, a(r("DeducClaimDtls54B"))) },
        { json: "DeducClaimDtlsUs54EC", js: "DeducClaimDtlsUs54EC", typ: u(undefined, a(r("DeducClaimDtls54ECn115F"))) },
        { json: "DeducClaimDtlsUs54F", js: "DeducClaimDtlsUs54F", typ: u(undefined, a(r("DeducClaimDtls54N54F"))) },
        { json: "TotDeductClaim", js: "TotDeductClaim", typ: 0 },
    ], false),
    "DeducClaimDtls115F": o([
        { json: "AmtDeducted", js: "AmtDeducted", typ: 0 },
        { json: "AmtInvested", js: "AmtInvested", typ: 0 },
        { json: "DateofInvestment", js: "DateofInvestment", typ: "" },
        { json: "DateofTransfer", js: "DateofTransfer", typ: "" },
    ], false),
    "DeducClaimDtls54N54F": o([
        { json: "AccountNo", js: "AccountNo", typ: u(undefined, "") },
        { json: "AmtDeducted", js: "AmtDeducted", typ: 0 },
        { json: "AmtDeposited", js: "AmtDeposited", typ: u(undefined, 0) },
        { json: "CostofNewResHouse", js: "CostofNewResHouse", typ: u(undefined, 0) },
        { json: "DateofPurchase", js: "DateofPurchase", typ: u(undefined, "") },
        { json: "DateofTransfer", js: "DateofTransfer", typ: "" },
        { json: "DepositDate", js: "DepositDate", typ: u(undefined, "") },
        { json: "IFSC", js: "IFSC", typ: u(undefined, "") },
    ], false),
    "DeducClaimDtls54B": o([
        { json: "AccountNo", js: "AccountNo", typ: u(undefined, "") },
        { json: "AmtDeducted", js: "AmtDeducted", typ: 0 },
        { json: "AmtDeposited", js: "AmtDeposited", typ: u(undefined, 0) },
        { json: "CostofNewAgriLand", js: "CostofNewAgriLand", typ: u(undefined, 0) },
        { json: "DateofPurchase", js: "DateofPurchase", typ: u(undefined, "") },
        { json: "DateofTransfer", js: "DateofTransfer", typ: "" },
        { json: "DepositDate", js: "DepositDate", typ: u(undefined, "") },
        { json: "IFSC", js: "IFSC", typ: u(undefined, "") },
    ], false),
    "DeducClaimDtls54ECn115F": o([
        { json: "AmtDeducted", js: "AmtDeducted", typ: 0 },
        { json: "AmtInvested", js: "AmtInvested", typ: u(undefined, 0) },
        { json: "DateofInvestment", js: "DateofInvestment", typ: u(undefined, "") },
        { json: "DateofTransfer", js: "DateofTransfer", typ: "" },
    ], false),
    "LongTermCapGain23": o([
        { json: "AmtDeemedLtcg", js: "AmtDeemedLtcg", typ: u(undefined, 0) },
        { json: "NRICgDTAA", js: "NRICgDTAA", typ: u(undefined, r("NRITaxUsDTAALtcgType")) },
        { json: "NRIOnSec112and115", js: "NRIOnSec112and115", typ: u(undefined, r("NRIOnSec112And115")) },
        { json: "NRIProvisoSec48", js: "NRIProvisoSec48", typ: u(undefined, r("NRIProvisoSec48")) },
        { json: "NRISaleOfEquityShareUs112A", js: "NRISaleOfEquityShareUs112A", typ: r("EquityShareUs112A") },
        { json: "NRISaleofForeignAsset", js: "NRISaleofForeignAsset", typ: r("NRISaleofForeignAsset") },
        { json: "PassThrIncNatureLTCG", js: "PassThrIncNatureLTCG", typ: 0 },
        { json: "PassThrIncNatureLTCG10Per", js: "PassThrIncNatureLTCG10Per", typ: u(undefined, 0) },
        { json: "PassThrIncNatureLTCG20Per", js: "PassThrIncNatureLTCG20Per", typ: u(undefined, 0) },
        { json: "PassThrIncNatureLTCGUs112A", js: "PassThrIncNatureLTCGUs112A", typ: 0 },
        { json: "Proviso112Applicable", js: "Proviso112Applicable", typ: u(undefined, a(r("Proviso112Applicable"))) },
        { json: "SaleOfEquityShareUs112A", js: "SaleOfEquityShareUs112A", typ: r("EquityShareUs112A") },
        { json: "SaleofAssetNA", js: "SaleofAssetNA", typ: r("EquityOrUnitSec54Type") },
        { json: "SaleofBondsDebntr", js: "SaleofBondsDebntr", typ: r("EquityOrUnitSec54TypeDebn112") },
        { json: "SaleofLandBuild", js: "SaleofLandBuild", typ: u(undefined, r("LongTermCapGain23SaleofLandBuild")) },
        { json: "TotalAmtDeemedLtcg", js: "TotalAmtDeemedLtcg", typ: 0 },
        { json: "TotalAmtNotTaxUsDTAALtcg", js: "TotalAmtNotTaxUsDTAALtcg", typ: 0 },
        { json: "TotalAmtTaxUsDTAALtcg", js: "TotalAmtTaxUsDTAALtcg", typ: 0 },
        { json: "TotalLTCG", js: "TotalLTCG", typ: 0 },
        { json: "UnutilizedCg", js: "UnutilizedCg", typ: u(undefined, r("UnutilizedCGPrvYrLtcg")) },
        { json: "UnutilizedLtcgFlag", js: "UnutilizedLtcgFlag", typ: u(undefined, r("UnutilizedLtcgFlag")) },
    ], false),
    "NRITaxUsDTAALtcgType": o([
        { json: "NRIDTAADtls", js: "NRIDTAADtls", typ: u(undefined, a(r("PurpleNRIDTAADtl"))) },
    ], false),
    "PurpleNRIDTAADtl": o([
        { json: "ApplicableRate", js: "ApplicableRate", typ: u(undefined, 3.14) },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DTAAamt", js: "DTAAamt", typ: 0 },
        { json: "DTAAarticle", js: "DTAAarticle", typ: "" },
        { json: "ItemNoincl", js: "ItemNoincl", typ: r("PurpleItemNoincl") },
        { json: "RateAsPerITAct", js: "RateAsPerITAct", typ: 3.14 },
        { json: "RateAsPerTreaty", js: "RateAsPerTreaty", typ: 3.14 },
        { json: "SecITAct", js: "SecITAct", typ: "" },
        { json: "TaxRescertifiedFlag", js: "TaxRescertifiedFlag", typ: u(undefined, r("TaxRescertifiedFlag")) },
    ], false),
    "NRIOnSec112And115": o([
        { json: "NRIOnSec112and115Dtls", js: "NRIOnSec112and115Dtls", typ: u(undefined, a(r("NRIOnSec112And115Dtl"))) },
    ], false),
    "NRIOnSec112And115Dtl": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "CapgainonAssets", js: "CapgainonAssets", typ: 0 },
        { json: "DeductSec48", js: "DeductSec48", typ: r("DeductSec48") },
        { json: "DeductionUs54F", js: "DeductionUs54F", typ: 0 },
        { json: "FairMrktValueUnqshr", js: "FairMrktValueUnqshr", typ: 0 },
        { json: "FullConsideration", js: "FullConsideration", typ: 0 },
        { json: "FullValueConsdOthUnqshr", js: "FullValueConsdOthUnqshr", typ: 0 },
        { json: "FullValueConsdRecvUnqshr", js: "FullValueConsdRecvUnqshr", typ: 0 },
        { json: "FullValueConsdSec50CA", js: "FullValueConsdSec50CA", typ: 0 },
        { json: "SectionCode", js: "SectionCode", typ: r("SectionCode") },
    ], false),
    "DeductSec48": o([
        { json: "AquisitCost", js: "AquisitCost", typ: 0 },
        { json: "ExpOnTrans", js: "ExpOnTrans", typ: 0 },
        { json: "ImproveCost", js: "ImproveCost", typ: 0 },
        { json: "TotalDedn", js: "TotalDedn", typ: 0 },
    ], false),
    "NRIProvisoSec48": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "DeductionUs54F", js: "DeductionUs54F", typ: 0 },
        { json: "LTCGWithoutBenefit", js: "LTCGWithoutBenefit", typ: 0 },
    ], false),
    "EquityShareUs112A": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "CapgainonAssets", js: "CapgainonAssets", typ: 0 },
        { json: "DeductionUs54F", js: "DeductionUs54F", typ: 0 },
    ], false),
    "NRISaleofForeignAsset": o([
        { json: "BalOtherthanSpecAsset", js: "BalOtherthanSpecAsset", typ: 0 },
        { json: "BalonSpeciAsset", js: "BalonSpeciAsset", typ: 0 },
        { json: "DednOtherSpecAssetus115", js: "DednOtherSpecAssetus115", typ: 0 },
        { json: "DednSpecAssetus115", js: "DednSpecAssetus115", typ: 0 },
        { json: "SaleOtherSpecAsset", js: "SaleOtherSpecAsset", typ: 0 },
        { json: "SaleonSpecAsset", js: "SaleonSpecAsset", typ: 0 },
    ], false),
    "Proviso112Applicable": o([
        { json: "Proviso112Applicabledtls", js: "Proviso112Applicabledtls", typ: r("EquityOrUnitSec54TypeDebn112") },
        { json: "Proviso112SectionCode", js: "Proviso112SectionCode", typ: r("Proviso112SectionCode") },
    ], false),
    "EquityOrUnitSec54TypeDebn112": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "CapgainonAssets", js: "CapgainonAssets", typ: 0 },
        { json: "DeductSec48", js: "DeductSec48", typ: r("DeductSec48") },
        { json: "DeductionUs54F", js: "DeductionUs54F", typ: 0 },
        { json: "FullConsideration", js: "FullConsideration", typ: 0 },
    ], false),
    "EquityOrUnitSec54Type": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "CapgainonAssets", js: "CapgainonAssets", typ: 0 },
        { json: "DeductSec48", js: "DeductSec48", typ: r("DeductSec48") },
        { json: "DeductionUs54F", js: "DeductionUs54F", typ: 0 },
        { json: "FairMrktValueUnqshr", js: "FairMrktValueUnqshr", typ: 0 },
        { json: "FullConsideration", js: "FullConsideration", typ: 0 },
        { json: "FullValueConsdOthUnqshr", js: "FullValueConsdOthUnqshr", typ: 0 },
        { json: "FullValueConsdRecvUnqshr", js: "FullValueConsdRecvUnqshr", typ: 0 },
        { json: "FullValueConsdSec50CA", js: "FullValueConsdSec50CA", typ: 0 },
    ], false),
    "LongTermCapGain23SaleofLandBuild": o([
        { json: "SaleofLandBuildDtls", js: "SaleofLandBuildDtls", typ: u(undefined, a(r("PurpleSaleofLandBuildDtl"))) },
    ], false),
    "PurpleSaleofLandBuildDtl": o([
        { json: "AquisitCost", js: "AquisitCost", typ: 0 },
        { json: "AquisitCostIndex", js: "AquisitCostIndex", typ: 0 },
        { json: "Balance", js: "Balance", typ: 0 },
        { json: "CostOfImprovements", js: "CostOfImprovements", typ: u(undefined, r("CostOfImprovements")) },
        { json: "DateofPurchase", js: "DateofPurchase", typ: u(undefined, "") },
        { json: "DateofSale", js: "DateofSale", typ: u(undefined, "") },
        { json: "ExemptionOrDednUs54", js: "ExemptionOrDednUs54", typ: r("ExemptionOrDednUs54SaleLandType") },
        { json: "ExpOnTrans", js: "ExpOnTrans", typ: 0 },
        { json: "FullConsideration", js: "FullConsideration", typ: u(undefined, 0) },
        { json: "FullConsideration50C", js: "FullConsideration50C", typ: 0 },
        { json: "ImproveCost", js: "ImproveCost", typ: 0 },
        { json: "LTCGonImmvblPrprty", js: "LTCGonImmvblPrprty", typ: 0 },
        { json: "PropertyValuation", js: "PropertyValuation", typ: u(undefined, 0) },
        { json: "TotalDedn", js: "TotalDedn", typ: 0 },
        { json: "TrnsfImmblPrprty", js: "TrnsfImmblPrprty", typ: u(undefined, r("PurpleTrnsfImmblPrprty")) },
    ], false),
    "CostOfImprovements": o([
        { json: "CostOfImprovementsDtls", js: "CostOfImprovementsDtls", typ: u(undefined, a(r("CostOfImprovementsType"))) },
    ], false),
    "CostOfImprovementsType": o([
        { json: "CostOfImpIndex", js: "CostOfImpIndex", typ: 0 },
        { json: "ImproveCost", js: "ImproveCost", typ: 0 },
        { json: "ImproveDate", js: "ImproveDate", typ: r("ImproveDate") },
        { json: "slno", js: "slno", typ: 0 },
    ], false),
    "ExemptionOrDednUs54SaleLandType": o([
        { json: "ExemptionGrandTotal", js: "ExemptionGrandTotal", typ: 0 },
        { json: "ExemptionOrDednUs54Dtls", js: "ExemptionOrDednUs54Dtls", typ: u(undefined, a(r("ExemptionOrDednUs54Dtl"))) },
    ], false),
    "ExemptionOrDednUs54Dtl": o([
        { json: "ExemptionAmount", js: "ExemptionAmount", typ: 0 },
        { json: "ExemptionSecCode", js: "ExemptionSecCode", typ: r("ExemptionSECCode") },
    ], false),
    "PurpleTrnsfImmblPrprty": o([
        { json: "TrnsfImmblPrprtyDtls", js: "TrnsfImmblPrprtyDtls", typ: u(undefined, a(r("TrnsfImmblPrprtyDtls"))) },
    ], false),
    "TrnsfImmblPrprtyDtls": o([
        { json: "AaadhaarOfBuyer", js: "AaadhaarOfBuyer", typ: u(undefined, "") },
        { json: "AddressOfProperty", js: "AddressOfProperty", typ: "" },
        { json: "Amount", js: "Amount", typ: 0 },
        { json: "CountryCode", js: "CountryCode", typ: r("CountryCode") },
        { json: "NameOfBuyer", js: "NameOfBuyer", typ: "" },
        { json: "PANofBuyer", js: "PANofBuyer", typ: u(undefined, "") },
        { json: "PercentageShare", js: "PercentageShare", typ: 3.14 },
        { json: "PinCode", js: "PinCode", typ: u(undefined, 0) },
        { json: "StateCode", js: "StateCode", typ: r("StateCode") },
        { json: "ZipCode", js: "ZipCode", typ: u(undefined, "") },
    ], false),
    "UnutilizedCGPrvYrLtcg": o([
        { json: "UnutilizedCgPrvYrDtls", js: "UnutilizedCgPrvYrDtls", typ: u(undefined, a(r("PurpleUnutilizedCGPrvYrDtl"))) },
    ], false),
    "PurpleUnutilizedCGPrvYrDtl": o([
        { json: "AmtUnutilized", js: "AmtUnutilized", typ: 0 },
        { json: "AmtUtilized", js: "AmtUtilized", typ: u(undefined, 0) },
        { json: "PrvYrInWhichAsstTrnsfrd", js: "PrvYrInWhichAsstTrnsfrd", typ: r("PurplePrvYrInWhichAsstTrnsfrd") },
        { json: "SectionClmd", js: "SectionClmd", typ: r("PurpleSectionClmd") },
        { json: "YrInWhichAssetAcq", js: "YrInWhichAssetAcq", typ: u(undefined, r("YrInWhichAssetAcq")) },
    ], false),
    "ShortTermCapGainFor23": o([
        { json: "AmtDeemedStcg", js: "AmtDeemedStcg", typ: u(undefined, 0) },
        { json: "EquityMFonSTT", js: "EquityMFonSTT", typ: u(undefined, a(r("EquityMFonSTT"))) },
        { json: "NRICgDTAA", js: "NRICgDTAA", typ: u(undefined, r("NRITaxUsDTAAStcgType")) },
        { json: "NRISecur115AD", js: "NRISecur115AD", typ: r("EquityOrUnitSec94Type") },
        { json: "NRITransacSec48Dtl", js: "NRITransacSec48Dtl", typ: r("NRITransacSec48Dtl") },
        { json: "PassThrIncNatureSTCG", js: "PassThrIncNatureSTCG", typ: 0 },
        { json: "PassThrIncNatureSTCG15Per", js: "PassThrIncNatureSTCG15Per", typ: u(undefined, 0) },
        { json: "PassThrIncNatureSTCG30Per", js: "PassThrIncNatureSTCG30Per", typ: u(undefined, 0) },
        { json: "PassThrIncNatureSTCGAppRate", js: "PassThrIncNatureSTCGAppRate", typ: u(undefined, 0) },
        { json: "SaleOnOtherAssets", js: "SaleOnOtherAssets", typ: r("EquityOrUnitSec94Type") },
        { json: "SaleofLandBuild", js: "SaleofLandBuild", typ: u(undefined, r("ShortTermCapGainFor23SaleofLandBuild")) },
        { json: "TotalAmtDeemedStcg", js: "TotalAmtDeemedStcg", typ: 0 },
        { json: "TotalAmtNotTaxUsDTAAStcg", js: "TotalAmtNotTaxUsDTAAStcg", typ: 0 },
        { json: "TotalAmtTaxUsDTAAStcg", js: "TotalAmtTaxUsDTAAStcg", typ: 0 },
        { json: "TotalSTCG", js: "TotalSTCG", typ: 0 },
        { json: "UnutilizedCg", js: "UnutilizedCg", typ: u(undefined, r("UnutilizedCGPrvYrStcg")) },
        { json: "UnutilizedStcgFlag", js: "UnutilizedStcgFlag", typ: u(undefined, r("UnutilizedLtcgFlag")) },
    ], false),
    "EquityMFonSTT": o([
        { json: "EquityMFonSTTDtls", js: "EquityMFonSTTDtls", typ: r("EquityOrUnitSec94TypeMFonSTT") },
        { json: "MFSectionCode", js: "MFSectionCode", typ: r("MFSectionCode") },
    ], false),
    "EquityOrUnitSec94TypeMFonSTT": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "CapgainonAssets", js: "CapgainonAssets", typ: 0 },
        { json: "DeductSec48", js: "DeductSec48", typ: r("DeductSec48") },
        { json: "FullConsideration", js: "FullConsideration", typ: 0 },
        { json: "LossSec94of7Or94of8", js: "LossSec94of7Or94of8", typ: 0 },
    ], false),
    "NRITaxUsDTAAStcgType": o([
        { json: "NRIDTAADtls", js: "NRIDTAADtls", typ: u(undefined, a(r("FluffyNRIDTAADtl"))) },
    ], false),
    "FluffyNRIDTAADtl": o([
        { json: "ApplicableRate", js: "ApplicableRate", typ: u(undefined, 3.14) },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DTAAamt", js: "DTAAamt", typ: 0 },
        { json: "DTAAarticle", js: "DTAAarticle", typ: "" },
        { json: "ItemNoincl", js: "ItemNoincl", typ: r("FluffyItemNoincl") },
        { json: "RateAsPerITAct", js: "RateAsPerITAct", typ: 3.14 },
        { json: "RateAsPerTreaty", js: "RateAsPerTreaty", typ: 3.14 },
        { json: "SecITAct", js: "SecITAct", typ: "" },
        { json: "TaxRescertifiedFlag", js: "TaxRescertifiedFlag", typ: u(undefined, r("TaxRescertifiedFlag")) },
    ], false),
    "EquityOrUnitSec94Type": o([
        { json: "BalanceCG", js: "BalanceCG", typ: 0 },
        { json: "CapgainonAssets", js: "CapgainonAssets", typ: 0 },
        { json: "DeductSec48", js: "DeductSec48", typ: r("DeductSec48") },
        { json: "FairMrktValueUnqshr", js: "FairMrktValueUnqshr", typ: 0 },
        { json: "FullConsideration", js: "FullConsideration", typ: 0 },
        { json: "FullValueConsdOthUnqshr", js: "FullValueConsdOthUnqshr", typ: 0 },
        { json: "FullValueConsdRecvUnqshr", js: "FullValueConsdRecvUnqshr", typ: 0 },
        { json: "FullValueConsdSec50CA", js: "FullValueConsdSec50CA", typ: 0 },
        { json: "LossSec94of7Or94of8", js: "LossSec94of7Or94of8", typ: 0 },
    ], false),
    "NRITransacSec48Dtl": o([
        { json: "NRItaxSTTNotPaid", js: "NRItaxSTTNotPaid", typ: 0 },
        { json: "NRItaxSTTPaid", js: "NRItaxSTTPaid", typ: 0 },
    ], false),
    "ShortTermCapGainFor23SaleofLandBuild": o([
        { json: "SaleofLandBuildDtls", js: "SaleofLandBuildDtls", typ: u(undefined, a(r("FluffySaleofLandBuildDtl"))) },
    ], false),
    "FluffySaleofLandBuildDtl": o([
        { json: "AquisitCost", js: "AquisitCost", typ: 0 },
        { json: "Balance", js: "Balance", typ: 0 },
        { json: "DateofPurchase", js: "DateofPurchase", typ: u(undefined, "") },
        { json: "DateofSale", js: "DateofSale", typ: u(undefined, "") },
        { json: "DeductionUs54B", js: "DeductionUs54B", typ: 0 },
        { json: "ExpOnTrans", js: "ExpOnTrans", typ: 0 },
        { json: "FullConsideration", js: "FullConsideration", typ: u(undefined, 0) },
        { json: "FullConsideration50C", js: "FullConsideration50C", typ: 0 },
        { json: "ImproveCost", js: "ImproveCost", typ: 0 },
        { json: "PropertyValuation", js: "PropertyValuation", typ: u(undefined, 0) },
        { json: "STCGonImmvblPrprty", js: "STCGonImmvblPrprty", typ: 0 },
        { json: "TotalDedn", js: "TotalDedn", typ: 0 },
        { json: "TrnsfImmblPrprty", js: "TrnsfImmblPrprty", typ: u(undefined, r("FluffyTrnsfImmblPrprty")) },
    ], false),
    "FluffyTrnsfImmblPrprty": o([
        { json: "TrnsfImmblPrprtyDtls", js: "TrnsfImmblPrprtyDtls", typ: u(undefined, a(r("TrnsfImmblPrprtyDtls"))) },
    ], false),
    "UnutilizedCGPrvYrStcg": o([
        { json: "UnutilizedCgPrvYrDtls", js: "UnutilizedCgPrvYrDtls", typ: u(undefined, a(r("FluffyUnutilizedCGPrvYrDtl"))) },
    ], false),
    "FluffyUnutilizedCGPrvYrDtl": o([
        { json: "AmtUnutilized", js: "AmtUnutilized", typ: 0 },
        { json: "AmtUtilized", js: "AmtUtilized", typ: u(undefined, 0) },
        { json: "PrvYrInWhichAsstTrnsfrd", js: "PrvYrInWhichAsstTrnsfrd", typ: r("FluffyPrvYrInWhichAsstTrnsfrd") },
        { json: "SectionClmd", js: "SectionClmd", typ: r("FluffySectionClmd") },
        { json: "YrInWhichAssetAcq", js: "YrInWhichAssetAcq", typ: u(undefined, r("YrInWhichAssetAcq")) },
    ], false),
    "ScheduleCYLA": o([
        { json: "CYLAEditFlag", js: "CYLAEditFlag", typ: u(undefined, "") },
        { json: "HP", js: "HP", typ: u(undefined, r("ScheduleCYLAHP")) },
        { json: "LTCG10Per", js: "LTCG10Per", typ: r("ScheduleCYLALTCG10Per") },
        { json: "LTCG20Per", js: "LTCG20Per", typ: r("ScheduleCYLALTCG20Per") },
        { json: "LTCGDTAARate", js: "LTCGDTAARate", typ: r("ScheduleCYLALTCGDTAARate") },
        { json: "LossRemAftSetOff", js: "LossRemAftSetOff", typ: r("LossRemAftSetOff") },
        { json: "OthSrcExclRaceHorse", js: "OthSrcExclRaceHorse", typ: u(undefined, r("ScheduleCYLAOthSrcExclRaceHorse")) },
        { json: "OthSrcRaceHorse", js: "OthSrcRaceHorse", typ: u(undefined, r("ScheduleCYLAOthSrcRaceHorse")) },
        { json: "STCG15Per", js: "STCG15Per", typ: r("ScheduleCYLASTCG15Per") },
        { json: "STCG30Per", js: "STCG30Per", typ: r("ScheduleCYLASTCG30Per") },
        { json: "STCGAppRate", js: "STCGAppRate", typ: r("ScheduleCYLASTCGAppRate") },
        { json: "STCGDTAARate", js: "STCGDTAARate", typ: r("ScheduleCYLASTCGDTAARate") },
        { json: "Salary", js: "Salary", typ: u(undefined, r("ScheduleCYLASalary")) },
        { json: "TotalCurYr", js: "TotalCurYr", typ: r("TotalCurYr") },
        { json: "TotalLossSetOff", js: "TotalLossSetOff", typ: r("TotalLossSetOff") },
    ], false),
    "ScheduleCYLAHP": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("HPIncCYLA") },
    ], false),
    "HPIncCYLA": o([
        { json: "IncOfCurYrAfterSetOff", js: "IncOfCurYrAfterSetOff", typ: 0 },
        { json: "IncOfCurYrUnderThatHead", js: "IncOfCurYrUnderThatHead", typ: 0 },
        { json: "OthSrcLossNoRaceHorseSetoff", js: "OthSrcLossNoRaceHorseSetoff", typ: u(undefined, 0) },
    ], false),
    "ScheduleCYLALTCG10Per": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "IncCYLA": o([
        { json: "HPlossCurYrSetoff", js: "HPlossCurYrSetoff", typ: u(undefined, 0) },
        { json: "IncOfCurYrAfterSetOff", js: "IncOfCurYrAfterSetOff", typ: 0 },
        { json: "IncOfCurYrUnderThatHead", js: "IncOfCurYrUnderThatHead", typ: 0 },
        { json: "OthSrcLossNoRaceHorseSetoff", js: "OthSrcLossNoRaceHorseSetoff", typ: u(undefined, 0) },
    ], false),
    "ScheduleCYLALTCG20Per": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "ScheduleCYLALTCGDTAARate": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "LossRemAftSetOff": o([
        { json: "BalHPlossCurYrAftSetoff", js: "BalHPlossCurYrAftSetoff", typ: 0 },
        { json: "BalOthSrcLossNoRaceHorseAftSetoff", js: "BalOthSrcLossNoRaceHorseAftSetoff", typ: 0 },
    ], false),
    "ScheduleCYLAOthSrcExclRaceHorse": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("OthSrcExclRaceHorseIncCYLA") },
    ], false),
    "OthSrcExclRaceHorseIncCYLA": o([
        { json: "HPlossCurYrSetoff", js: "HPlossCurYrSetoff", typ: u(undefined, 0) },
        { json: "IncOfCurYrAfterSetOff", js: "IncOfCurYrAfterSetOff", typ: 0 },
        { json: "IncOfCurYrUnderThatHead", js: "IncOfCurYrUnderThatHead", typ: 0 },
    ], false),
    "ScheduleCYLAOthSrcRaceHorse": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "ScheduleCYLASTCG15Per": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "ScheduleCYLASTCG30Per": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "ScheduleCYLASTCGAppRate": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "ScheduleCYLASTCGDTAARate": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "ScheduleCYLASalary": o([
        { json: "IncCYLA", js: "IncCYLA", typ: r("IncCYLA") },
    ], false),
    "TotalCurYr": o([
        { json: "TotHPlossCurYr", js: "TotHPlossCurYr", typ: 0 },
        { json: "TotOthSrcLossNoRaceHorse", js: "TotOthSrcLossNoRaceHorse", typ: 0 },
    ], false),
    "TotalLossSetOff": o([
        { json: "TotHPlossCurYrSetoff", js: "TotHPlossCurYrSetoff", typ: 0 },
        { json: "TotOthSrcLossNoRaceHorseSetoff", js: "TotOthSrcLossNoRaceHorseSetoff", typ: 0 },
    ], false),
    "ScheduleEI": o([
        { json: "ExcNetAgriInc", js: "ExcNetAgriInc", typ: u(undefined, r("ExcNetAgriInc")) },
        { json: "ExpIncAgri", js: "ExpIncAgri", typ: u(undefined, 0) },
        { json: "GrossAgriRecpt", js: "GrossAgriRecpt", typ: u(undefined, 0) },
        { json: "IncNotChrgblAsPerDTAA", js: "IncNotChrgblAsPerDTAA", typ: u(undefined, r("IncNotChrgblAsPerDTAA")) },
        { json: "IncNotChrgblToTax", js: "IncNotChrgblToTax", typ: 0 },
        { json: "InterestInc", js: "InterestInc", typ: u(undefined, 0) },
        { json: "NetAgriIncOrOthrIncRule7", js: "NetAgriIncOrOthrIncRule7", typ: 0 },
        { json: "Others", js: "Others", typ: 0 },
        { json: "OthersInc", js: "OthersInc", typ: u(undefined, r("ScheduleEIOthersInc")) },
        { json: "PassThrIncNotChrgblTax", js: "PassThrIncNotChrgblTax", typ: u(undefined, 0) },
        { json: "TotalExemptInc", js: "TotalExemptInc", typ: 0 },
        { json: "UnabAgriLossPrev8", js: "UnabAgriLossPrev8", typ: u(undefined, 0) },
    ], false),
    "ExcNetAgriInc": o([
        { json: "ExcNetAgriIncDtls", js: "ExcNetAgriIncDtls", typ: u(undefined, a(r("ExcNetAgriIncDtls"))) },
    ], false),
    "ExcNetAgriIncDtls": o([
        { json: "AgriLandIrrigatedFlag", js: "AgriLandIrrigatedFlag", typ: r("AgriLandIrrigatedFlag") },
        { json: "AgriLandOwnedFlag", js: "AgriLandOwnedFlag", typ: r("AgriLandOwnedFlag") },
        { json: "MeasurementOfLand", js: "MeasurementOfLand", typ: 3.14 },
        { json: "NameOfDistrict", js: "NameOfDistrict", typ: "" },
        { json: "PinCode", js: "PinCode", typ: 0 },
    ], false),
    "IncNotChrgblAsPerDTAA": o([
        { json: "IncNotChrgblAsPerDTAADtls", js: "IncNotChrgblAsPerDTAADtls", typ: u(undefined, a(r("IncNotChrgblAsPerDTAADtls"))) },
    ], false),
    "IncNotChrgblAsPerDTAADtls": o([
        { json: "AmountOfIncome", js: "AmountOfIncome", typ: 0 },
        { json: "ArticleOfDTAA", js: "ArticleOfDTAA", typ: "" },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "HeadOfIncome", js: "HeadOfIncome", typ: r("HeadOfIncome") },
        { json: "NatureOfIncome", js: "NatureOfIncome", typ: "" },
        { json: "TRCFlag", js: "TRCFlag", typ: r("TaxRescertifiedFlag") },
    ], false),
    "ScheduleEIOthersInc": o([
        { json: "OthersIncDtls", js: "OthersIncDtls", typ: u(undefined, a(r("OthersIncDtlEI"))) },
    ], false),
    "OthersIncDtlEI": o([
        { json: "NatureDesc", js: "NatureDesc", typ: r("PurpleNatureDesc") },
        { json: "OthAmount", js: "OthAmount", typ: 0 },
        { json: "OthNatOfInc", js: "OthNatOfInc", typ: u(undefined, "") },
    ], false),
    "ScheduleESOP": o([
        { json: "DPIITRegNo", js: "DPIITRegNo", typ: "" },
        { json: "PanofStartUp", js: "PanofStartUp", typ: "" },
        { json: "ScheduleESOP2122_Type", js: "ScheduleESOP2122_Type", typ: u(undefined, r("ScheduleESOP2122Type")) },
        { json: "ScheduleESOP2223_Type", js: "ScheduleESOP2223_Type", typ: u(undefined, r("ScheduleESOP2223Type")) },
        { json: "ScheduleESOP2324_Type", js: "ScheduleESOP2324_Type", typ: u(undefined, r("ScheduleESOP2324Type")) },
        { json: "ScheduleESOP2425_Type", js: "ScheduleESOP2425_Type", typ: u(undefined, r("ScheduleESOP2425Type")) },
        { json: "TotalTaxAttributedAmt", js: "TotalTaxAttributedAmt", typ: 0 },
    ], false),
    "ScheduleESOP2122Type": o([
        { json: "AssessmentYear", js: "AssessmentYear", typ: "" },
        { json: "BalanceTaxCF", js: "BalanceTaxCF", typ: u(undefined, 0) },
        { json: "ScheduleESOPEventDtls", js: "ScheduleESOPEventDtls", typ: u(undefined, r("ScheduleESOPEventDtls")) },
        { json: "TaxDeferredBFEarlierAY", js: "TaxDeferredBFEarlierAY", typ: u(undefined, 0) },
        { json: "TaxPayableCurrentAY", js: "TaxPayableCurrentAY", typ: u(undefined, 0) },
        { json: "TotalTaxAttributedAmt21", js: "TotalTaxAttributedAmt21", typ: u(undefined, 0) },
    ], false),
    "ScheduleESOPEventDtls": o([
        { json: "CeasedEmployee", js: "CeasedEmployee", typ: u(undefined, r("TaxRescertifiedFlag")) },
        { json: "DateOfCeasing", js: "DateOfCeasing", typ: u(undefined, "") },
        { json: "ScheduleESOPEventDtlsType", js: "ScheduleESOPEventDtlsType", typ: u(undefined, a(r("ScheduleESOPEventDtlsType"))) },
        { json: "SecurityType", js: "SecurityType", typ: u(undefined, r("SecurityType")) },
    ], false),
    "ScheduleESOPEventDtlsType": o([
        { json: "Date", js: "Date", typ: u(undefined, "") },
        { json: "TaxAttributedAmt", js: "TaxAttributedAmt", typ: u(undefined, 0) },
    ], false),
    "ScheduleESOP2223Type": o([
        { json: "AssessmentYear", js: "AssessmentYear", typ: "" },
        { json: "BalanceTaxCF", js: "BalanceTaxCF", typ: u(undefined, 0) },
        { json: "ScheduleESOPEventDtls", js: "ScheduleESOPEventDtls", typ: u(undefined, r("ScheduleESOPEventDtls")) },
        { json: "TaxDeferredBFEarlierAY", js: "TaxDeferredBFEarlierAY", typ: u(undefined, 0) },
        { json: "TaxPayableCurrentAY", js: "TaxPayableCurrentAY", typ: u(undefined, 0) },
        { json: "TotalTaxAttributedAmt22", js: "TotalTaxAttributedAmt22", typ: u(undefined, 0) },
    ], false),
    "ScheduleESOP2324Type": o([
        { json: "AssessmentYear", js: "AssessmentYear", typ: "" },
        { json: "BalanceTaxCF", js: "BalanceTaxCF", typ: u(undefined, 0) },
        { json: "ScheduleESOPEventDtls", js: "ScheduleESOPEventDtls", typ: u(undefined, r("ScheduleESOPEventDtls")) },
        { json: "TaxDeferredBFEarlierAY", js: "TaxDeferredBFEarlierAY", typ: u(undefined, 0) },
        { json: "TaxPayableCurrentAY", js: "TaxPayableCurrentAY", typ: u(undefined, 0) },
        { json: "TotalTaxAttributedAmt23", js: "TotalTaxAttributedAmt23", typ: u(undefined, 0) },
    ], false),
    "ScheduleESOP2425Type": o([
        { json: "AssessmentYear", js: "AssessmentYear", typ: "" },
        { json: "BalanceTaxCF", js: "BalanceTaxCF", typ: u(undefined, 0) },
    ], false),
    "ScheduleFA": o([
        { json: "DetailsFinancialInterest", js: "DetailsFinancialInterest", typ: u(undefined, a(r("DetailsFinancialInterest"))) },
        { json: "DetailsForiegnBank", js: "DetailsForiegnBank", typ: u(undefined, a(r("DetailsForiegnBank"))) },
        { json: "DetailsImmovableProperty", js: "DetailsImmovableProperty", typ: u(undefined, a(r("DetailsImmovableProperty"))) },
        { json: "DetailsOfAccntsHvngSigningAuth", js: "DetailsOfAccntsHvngSigningAuth", typ: u(undefined, a(r("DetailsOfAccntsHvngSigningAuth"))) },
        { json: "DetailsOfOthSourcesIncOutsideIndia", js: "DetailsOfOthSourcesIncOutsideIndia", typ: u(undefined, a(r("DetailsOfOthSourcesIncOutsideIndia"))) },
        { json: "DetailsOfTrustOutIndiaTrustee", js: "DetailsOfTrustOutIndiaTrustee", typ: u(undefined, a(r("DetailsOfTrustOutIndiaTrustee"))) },
        { json: "DetailsOthAssets", js: "DetailsOthAssets", typ: u(undefined, a(r("DetailsOthAssets"))) },
        { json: "DtlsForeignCashValueInsurance", js: "DtlsForeignCashValueInsurance", typ: u(undefined, a(r("DtlsForeignCashValueInsurance"))) },
        { json: "DtlsForeignCustodialAcc", js: "DtlsForeignCustodialAcc", typ: u(undefined, a(r("DtlsForeignCustodialAcc"))) },
        { json: "DtlsForeignEquityDebtInterest", js: "DtlsForeignEquityDebtInterest", typ: u(undefined, a(r("DtlsForeignEquityDebtInterest"))) },
    ], false),
    "DetailsFinancialInterest": o([
        { json: "AddressOfEntity", js: "AddressOfEntity", typ: "" },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DateHeld", js: "DateHeld", typ: "" },
        { json: "IncFromInt", js: "IncFromInt", typ: 0 },
        { json: "IncTaxAmt", js: "IncTaxAmt", typ: 0 },
        { json: "IncTaxSch", js: "IncTaxSch", typ: r("IncTaxSch") },
        { json: "IncTaxSchNo", js: "IncTaxSchNo", typ: "" },
        { json: "NameOfEntity", js: "NameOfEntity", typ: "" },
        { json: "NatureOfEntity", js: "NatureOfEntity", typ: u(undefined, "") },
        { json: "NatureOfInc", js: "NatureOfInc", typ: "" },
        { json: "NatureOfInt", js: "NatureOfInt", typ: r("NatureOfInt") },
        { json: "TotalInvestment", js: "TotalInvestment", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DetailsForiegnBank": o([
        { json: "AccOpenDate", js: "AccOpenDate", typ: "" },
        { json: "AddressOfBank", js: "AddressOfBank", typ: "" },
        { json: "Bankname", js: "Bankname", typ: "" },
        { json: "ClosingBalance", js: "ClosingBalance", typ: 0 },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "ForeignAccountNumber", js: "ForeignAccountNumber", typ: "" },
        { json: "IntrstAccured", js: "IntrstAccured", typ: 0 },
        { json: "OwnerStatus", js: "OwnerStatus", typ: r("OwnerStatus") },
        { json: "PeakBalanceDuringYear", js: "PeakBalanceDuringYear", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DetailsImmovableProperty": o([
        { json: "AddressOfProperty", js: "AddressOfProperty", typ: u(undefined, "") },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DateOfAcq", js: "DateOfAcq", typ: "" },
        { json: "IncDrvProperty", js: "IncDrvProperty", typ: 0 },
        { json: "IncTaxAmt", js: "IncTaxAmt", typ: 0 },
        { json: "IncTaxSch", js: "IncTaxSch", typ: r("IncTaxSch") },
        { json: "IncTaxSchNo", js: "IncTaxSchNo", typ: "" },
        { json: "NatureOfInc", js: "NatureOfInc", typ: "" },
        { json: "Ownership", js: "Ownership", typ: r("NatureOfInt") },
        { json: "TotalInvestment", js: "TotalInvestment", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DetailsOfAccntsHvngSigningAuth": o([
        { json: "AddressOfInstitution", js: "AddressOfInstitution", typ: "" },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "IncAccuredInAcc", js: "IncAccuredInAcc", typ: u(undefined, 0) },
        { json: "IncAccuredTaxFlag", js: "IncAccuredTaxFlag", typ: r("TaxRescertifiedFlag") },
        { json: "IncOfferedAmt", js: "IncOfferedAmt", typ: u(undefined, 0) },
        { json: "IncOfferedSch", js: "IncOfferedSch", typ: u(undefined, r("IncTaxSch")) },
        { json: "IncOfferedSchNo", js: "IncOfferedSchNo", typ: u(undefined, "") },
        { json: "InstitutionAccountNumber", js: "InstitutionAccountNumber", typ: "" },
        { json: "NameMentionedInAccnt", js: "NameMentionedInAccnt", typ: "" },
        { json: "NameOfInstitution", js: "NameOfInstitution", typ: "" },
        { json: "PeakBalanceOrInvestment", js: "PeakBalanceOrInvestment", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DetailsOfOthSourcesIncOutsideIndia": o([
        { json: "AddressOfPerson", js: "AddressOfPerson", typ: "" },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "IncDerived", js: "IncDerived", typ: u(undefined, 0) },
        { json: "IncDrvTaxFlag", js: "IncDrvTaxFlag", typ: r("TaxRescertifiedFlag") },
        { json: "IncOfferedAmt", js: "IncOfferedAmt", typ: u(undefined, 0) },
        { json: "IncOfferedSch", js: "IncOfferedSch", typ: u(undefined, r("IncTaxSch")) },
        { json: "IncOfferedSchNo", js: "IncOfferedSchNo", typ: u(undefined, "") },
        { json: "NameOfPerson", js: "NameOfPerson", typ: "" },
        { json: "NatureOfInc", js: "NatureOfInc", typ: "" },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DetailsOfTrustOutIndiaTrustee": o([
        { json: "AddressOfBeneficiaries", js: "AddressOfBeneficiaries", typ: "" },
        { json: "AddressOfOtherTrustees", js: "AddressOfOtherTrustees", typ: "" },
        { json: "AddressOfSettlor", js: "AddressOfSettlor", typ: "" },
        { json: "AddressOfTrust", js: "AddressOfTrust", typ: "" },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DateHeld", js: "DateHeld", typ: "" },
        { json: "IncDrvFromTrust", js: "IncDrvFromTrust", typ: u(undefined, 0) },
        { json: "IncDrvTaxFlag", js: "IncDrvTaxFlag", typ: r("TaxRescertifiedFlag") },
        { json: "IncOfferedAmt", js: "IncOfferedAmt", typ: u(undefined, 0) },
        { json: "IncOfferedSch", js: "IncOfferedSch", typ: u(undefined, r("IncTaxSch")) },
        { json: "IncOfferedSchNo", js: "IncOfferedSchNo", typ: u(undefined, "") },
        { json: "NameOfBeneficiaries", js: "NameOfBeneficiaries", typ: "" },
        { json: "NameOfOtherTrustees", js: "NameOfOtherTrustees", typ: "" },
        { json: "NameOfSettlor", js: "NameOfSettlor", typ: "" },
        { json: "NameOfTrust", js: "NameOfTrust", typ: "" },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DetailsOthAssets": o([
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DateOfAcq", js: "DateOfAcq", typ: "" },
        { json: "IncDrvAsset", js: "IncDrvAsset", typ: 0 },
        { json: "IncTaxAmt", js: "IncTaxAmt", typ: 0 },
        { json: "IncTaxSch", js: "IncTaxSch", typ: r("IncTaxSch") },
        { json: "IncTaxSchNo", js: "IncTaxSchNo", typ: "" },
        { json: "NatureOfAsset", js: "NatureOfAsset", typ: "" },
        { json: "NatureOfInc", js: "NatureOfInc", typ: "" },
        { json: "Ownership", js: "Ownership", typ: r("NatureOfInt") },
        { json: "TotalInvestment", js: "TotalInvestment", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DtlsForeignCashValueInsurance": o([
        { json: "CashValOrSurrenderVal", js: "CashValOrSurrenderVal", typ: 0 },
        { json: "ContractDate", js: "ContractDate", typ: "" },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "FinancialInstAddress", js: "FinancialInstAddress", typ: "" },
        { json: "FinancialInstName", js: "FinancialInstName", typ: "" },
        { json: "TotGrossAmtPaidCredited", js: "TotGrossAmtPaidCredited", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DtlsForeignCustodialAcc": o([
        { json: "AccOpenDate", js: "AccOpenDate", typ: "" },
        { json: "AccountNumber", js: "AccountNumber", typ: "" },
        { json: "ClosingBalance", js: "ClosingBalance", typ: 0 },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "FinancialInstAddress", js: "FinancialInstAddress", typ: "" },
        { json: "FinancialInstName", js: "FinancialInstName", typ: "" },
        { json: "GrossAmtPaidCredited", js: "GrossAmtPaidCredited", typ: 0 },
        { json: "NatureOfAmount", js: "NatureOfAmount", typ: r("NatureOfAmount") },
        { json: "PeakBalanceDuringPeriod", js: "PeakBalanceDuringPeriod", typ: 0 },
        { json: "Status", js: "Status", typ: r("OwnerStatus") },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "DtlsForeignEquityDebtInterest": o([
        { json: "AddressOfEntity", js: "AddressOfEntity", typ: "" },
        { json: "ClosingBalance", js: "ClosingBalance", typ: 0 },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "InitialValOfInvstmnt", js: "InitialValOfInvstmnt", typ: 0 },
        { json: "InterestAcquiringDate", js: "InterestAcquiringDate", typ: "" },
        { json: "NameOfEntity", js: "NameOfEntity", typ: "" },
        { json: "NatureOfEntity", js: "NatureOfEntity", typ: "" },
        { json: "PeakBalanceDuringPeriod", js: "PeakBalanceDuringPeriod", typ: 0 },
        { json: "TotGrossAmtPaidCredited", js: "TotGrossAmtPaidCredited", typ: 0 },
        { json: "TotGrossProceeds", js: "TotGrossProceeds", typ: 0 },
        { json: "ZipCode", js: "ZipCode", typ: "" },
    ], false),
    "ScheduleFSI": o([
        { json: "ScheduleFSIDtls", js: "ScheduleFSIDtls", typ: u(undefined, a(r("ScheduleFSIDtls"))) },
    ], false),
    "ScheduleFSIDtls": o([
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "IncCapGain", js: "IncCapGain", typ: r("ScheduleFSIIncType") },
        { json: "IncFromHP", js: "IncFromHP", typ: r("ScheduleFSIIncType") },
        { json: "IncFromSal", js: "IncFromSal", typ: r("ScheduleFSIIncType") },
        { json: "IncOthSrc", js: "IncOthSrc", typ: r("ScheduleFSIIncType") },
        { json: "TaxIdentificationNo", js: "TaxIdentificationNo", typ: "" },
        { json: "TotalCountryWise", js: "TotalCountryWise", typ: r("TotalScheduleFSIIncType") },
    ], false),
    "ScheduleFSIIncType": o([
        { json: "DTAAReliefUs90or90A", js: "DTAAReliefUs90or90A", typ: u(undefined, "") },
        { json: "IncFrmOutsideInd", js: "IncFrmOutsideInd", typ: 0 },
        { json: "TaxPaidOutsideInd", js: "TaxPaidOutsideInd", typ: 0 },
        { json: "TaxPayableinInd", js: "TaxPayableinInd", typ: 0 },
        { json: "TaxReliefinInd", js: "TaxReliefinInd", typ: 0 },
    ], false),
    "TotalScheduleFSIIncType": o([
        { json: "IncFrmOutsideInd", js: "IncFrmOutsideInd", typ: 0 },
        { json: "TaxPaidOutsideInd", js: "TaxPaidOutsideInd", typ: 0 },
        { json: "TaxPayableinInd", js: "TaxPayableinInd", typ: 0 },
        { json: "TaxReliefinInd", js: "TaxReliefinInd", typ: 0 },
    ], false),
    "ScheduleHP": o([
        { json: "PassThroghIncome", js: "PassThroghIncome", typ: u(undefined, 0) },
        { json: "PropertyDetails", js: "PropertyDetails", typ: u(undefined, a(r("PropertyDetails"))) },
        { json: "TotalIncomeChargeableUnHP", js: "TotalIncomeChargeableUnHP", typ: 0 },
    ], false),
    "PropertyDetails": o([
        { json: "AddressDetailWithZipCode", js: "AddressDetailWithZipCode", typ: r("AddressDetailWithZipCode") },
        { json: "AsseseeShareProperty", js: "AsseseeShareProperty", typ: 3.14 },
        { json: "CoOwners", js: "CoOwners", typ: u(undefined, a(r("CoOwners"))) },
        { json: "HPSNo", js: "HPSNo", typ: 0 },
        { json: "PropCoOwnedFlg", js: "PropCoOwnedFlg", typ: r("AssetOutIndiaFlag") },
        { json: "PropertyOwner", js: "PropertyOwner", typ: r("PropertyOwner") },
        { json: "PropertyOwnerOther", js: "PropertyOwnerOther", typ: u(undefined, "") },
        { json: "Rentdetails", js: "Rentdetails", typ: r("Rentdetails") },
        { json: "TenantDetails", js: "TenantDetails", typ: u(undefined, a(r("TenantDetails"))) },
        { json: "ifLetOut", js: "ifLetOut", typ: r("IfLetOut") },
    ], false),
    "AddressDetailWithZipCode": o([
        { json: "AddrDetail", js: "AddrDetail", typ: "" },
        { json: "CityOrTownOrDistrict", js: "CityOrTownOrDistrict", typ: "" },
        { json: "CountryCode", js: "CountryCode", typ: r("CountryCode") },
        { json: "PinCode", js: "PinCode", typ: u(undefined, 0) },
        { json: "StateCode", js: "StateCode", typ: r("StateCode") },
        { json: "ZipCode", js: "ZipCode", typ: u(undefined, "") },
    ], false),
    "CoOwners": o([
        { json: "Aadhaar_CoOwner", js: "Aadhaar_CoOwner", typ: u(undefined, "") },
        { json: "CoOwnersSNo", js: "CoOwnersSNo", typ: 0 },
        { json: "NameCoOwner", js: "NameCoOwner", typ: "" },
        { json: "PAN_CoOwner", js: "PAN_CoOwner", typ: u(undefined, "") },
        { json: "PercentShareProperty", js: "PercentShareProperty", typ: u(undefined, 3.14) },
    ], false),
    "Rentdetails": o([
        { json: "AnnualLetableValue", js: "AnnualLetableValue", typ: 0 },
        { json: "AnnualOfPropOwned", js: "AnnualOfPropOwned", typ: 0 },
        { json: "ArrearsUnrealizedRentRcvd", js: "ArrearsUnrealizedRentRcvd", typ: u(undefined, 0) },
        { json: "BalanceALV", js: "BalanceALV", typ: 0 },
        { json: "IncomeOfHP", js: "IncomeOfHP", typ: 0 },
        { json: "IntOnBorwCap", js: "IntOnBorwCap", typ: u(undefined, 0) },
        { json: "LocalTaxes", js: "LocalTaxes", typ: u(undefined, 0) },
        { json: "RentNotRealized", js: "RentNotRealized", typ: u(undefined, 0) },
        { json: "ThirtyPercentOfBalance", js: "ThirtyPercentOfBalance", typ: 0 },
        { json: "TotalDeduct", js: "TotalDeduct", typ: 0 },
        { json: "TotalUnrealizedAndTax", js: "TotalUnrealizedAndTax", typ: 0 },
    ], false),
    "TenantDetails": o([
        { json: "AadhaarofTenant", js: "AadhaarofTenant", typ: u(undefined, "") },
        { json: "NameofTenant", js: "NameofTenant", typ: "" },
        { json: "PANTANofTenant", js: "PANTANofTenant", typ: u(undefined, "") },
        { json: "PANofTenant", js: "PANofTenant", typ: u(undefined, "") },
        { json: "TenantSNo", js: "TenantSNo", typ: 0 },
    ], false),
    "ScheduleIT": o([
        { json: "TaxPayment", js: "TaxPayment", typ: u(undefined, a(r("TaxPayment"))) },
        { json: "TotalTaxPayments", js: "TotalTaxPayments", typ: 0 },
    ], false),
    "TaxPayment": o([
        { json: "Amt", js: "Amt", typ: 0 },
        { json: "BSRCode", js: "BSRCode", typ: "" },
        { json: "DateDep", js: "DateDep", typ: "" },
        { json: "SrlNoOfChaln", js: "SrlNoOfChaln", typ: 0 },
    ], false),
    "ScheduleOS": o([
        { json: "DividendDTAA", js: "DividendDTAA", typ: r("DateRangeType") },
        { json: "DividendIncUs115A1aA", js: "DividendIncUs115A1aA", typ: u(undefined, r("DateRangeType")) },
        { json: "DividendIncUs115A1ai", js: "DividendIncUs115A1ai", typ: r("DateRangeType") },
        { json: "DividendIncUs115AC", js: "DividendIncUs115AC", typ: r("DateRangeType") },
        { json: "DividendIncUs115ACA", js: "DividendIncUs115ACA", typ: r("DateRangeType") },
        { json: "DividendIncUs115AD1i", js: "DividendIncUs115AD1i", typ: r("DateRangeType") },
        { json: "DividendIncUs115BBDA", js: "DividendIncUs115BBDA", typ: r("DateRangeType") },
        { json: "IncChargeable", js: "IncChargeable", typ: 0 },
        { json: "IncFrmLottery", js: "IncFrmLottery", typ: r("DateRangeType") },
        { json: "IncFrmOnGames", js: "IncFrmOnGames", typ: u(undefined, r("DateRangeType")) },
        { json: "IncFromOwnHorse", js: "IncFromOwnHorse", typ: u(undefined, r("IncFromOwnHorse")) },
        { json: "IncOthThanOwnRaceHorse", js: "IncOthThanOwnRaceHorse", typ: u(undefined, r("IncOthThanOwnRaceHorse")) },
        { json: "NOT89A", js: "NOT89A", typ: r("DateRangeType") },
        { json: "TotOthSrcNoRaceHorse", js: "TotOthSrcNoRaceHorse", typ: u(undefined, 0) },
    ], false),
    "IncFromOwnHorse": o([
        { json: "AmtNotDeductibleUs58", js: "AmtNotDeductibleUs58", typ: u(undefined, 0) },
        { json: "BalanceOwnRaceHorse", js: "BalanceOwnRaceHorse", typ: 0 },
        { json: "DeductSec57", js: "DeductSec57", typ: 0 },
        { json: "ProfitChargTaxUs59", js: "ProfitChargTaxUs59", typ: u(undefined, 0) },
        { json: "Receipts", js: "Receipts", typ: 0 },
    ], false),
    "IncOthThanOwnRaceHorse": o([
        { json: "Aggrtvaluewithoutcons562x", js: "Aggrtvaluewithoutcons562x", typ: 0 },
        { json: "AmtBrwdRepaidOnHundiUs69D", js: "AmtBrwdRepaidOnHundiUs69D", typ: 0 },
        { json: "AmtNotDeductibleUs58", js: "AmtNotDeductibleUs58", typ: u(undefined, 0) },
        { json: "AnyOtherIncome", js: "AnyOtherIncome", typ: 0 },
        { json: "Anyotherpropinadeqcons562x", js: "Anyotherpropinadeqcons562x", typ: 0 },
        { json: "Anyotherpropwithoutcons562x", js: "Anyotherpropwithoutcons562x", typ: 0 },
        { json: "BalanceNoRaceHorse", js: "BalanceNoRaceHorse", typ: 0 },
        { json: "CashCreditsUs68", js: "CashCreditsUs68", typ: 0 },
        { json: "Deductions", js: "Deductions", typ: r("Deductions") },
        { json: "Dividend22e", js: "Dividend22e", typ: u(undefined, 0) },
        { json: "DividendGross", js: "DividendGross", typ: 0 },
        { json: "DividendOthThan22e", js: "DividendOthThan22e", typ: u(undefined, 0) },
        { json: "FamilyPension", js: "FamilyPension", typ: 0 },
        { json: "GrossIncChrgblTaxAtAppRate", js: "GrossIncChrgblTaxAtAppRate", typ: 0 },
        { json: "Immovpropinadeqcons562x", js: "Immovpropinadeqcons562x", typ: 0 },
        { json: "Immovpropwithoutcons562x", js: "Immovpropwithoutcons562x", typ: 0 },
        { json: "IncChargblSplRateOS", js: "IncChargblSplRateOS", typ: u(undefined, r("IncChargblSplRateOS")) },
        { json: "IncChargeableSpecialRates", js: "IncChargeableSpecialRates", typ: 0 },
        { json: "IncChrgblUs115BBE", js: "IncChrgblUs115BBE", typ: 0 },
        { json: "IncChrgblUs115BBJ", js: "IncChrgblUs115BBJ", typ: u(undefined, 0) },
        { json: "IncomeNotified89AOS", js: "IncomeNotified89AOS", typ: 0 },
        { json: "IncomeNotified89ATypeOS", js: "IncomeNotified89ATypeOS", typ: u(undefined, a(r("NOT89AType"))) },
        { json: "IncomeNotifiedOther89AOS", js: "IncomeNotifiedOther89AOS", typ: u(undefined, 0) },
        { json: "IncomeNotifiedPrYr89AOS", js: "IncomeNotifiedPrYr89AOS", typ: u(undefined, 0) },
        { json: "Increliefus89AOS", js: "Increliefus89AOS", typ: u(undefined, 0) },
        { json: "InterestGross", js: "InterestGross", typ: 0 },
        { json: "IntrstFrmIncmTaxRefund", js: "IntrstFrmIncmTaxRefund", typ: 0 },
        { json: "IntrstFrmOthers", js: "IntrstFrmOthers", typ: 0 },
        { json: "IntrstFrmSavingBank", js: "IntrstFrmSavingBank", typ: 0 },
        { json: "IntrstFrmTermDeposit", js: "IntrstFrmTermDeposit", typ: 0 },
        { json: "IntrstSec10XIFirstProviso", js: "IntrstSec10XIFirstProviso", typ: u(undefined, 0) },
        { json: "IntrstSec10XIIFirstProviso", js: "IntrstSec10XIIFirstProviso", typ: u(undefined, 0) },
        { json: "IntrstSec10XIISecondProviso", js: "IntrstSec10XIISecondProviso", typ: u(undefined, 0) },
        { json: "IntrstSec10XISecondProviso", js: "IntrstSec10XISecondProviso", typ: u(undefined, 0) },
        { json: "LtryPzzlChrgblUs115BB", js: "LtryPzzlChrgblUs115BB", typ: 0 },
        { json: "NatofPassThrghIncome", js: "NatofPassThrghIncome", typ: 0 },
        { json: "OthersGross", js: "OthersGross", typ: 0 },
        { json: "OthersGrossDtls", js: "OthersGrossDtls", typ: u(undefined, a(r("OthersGrossDtl"))) },
        { json: "OthersInc", js: "OthersInc", typ: u(undefined, r("IncOthThanOwnRaceHorseOthersInc")) },
        { json: "PTIOthersGrossDtls", js: "PTIOthersGrossDtls", typ: u(undefined, a(r("PTIOthersGrossDtl"))) },
        { json: "PassThrIncOSChrgblSplRate", js: "PassThrIncOSChrgblSplRate", typ: 0 },
        { json: "ProfitChargTaxUs59", js: "ProfitChargTaxUs59", typ: u(undefined, 0) },
        { json: "RentFromMachPlantBldgs", js: "RentFromMachPlantBldgs", typ: 0 },
        { json: "SumRecdPrYrBusTRU562xii", js: "SumRecdPrYrBusTRU562xii", typ: u(undefined, 0) },
        { json: "SumRecdPrYrLifIns562xiii", js: "SumRecdPrYrLifIns562xiii", typ: u(undefined, 0) },
        { json: "TaxAccumulatedBalRecPF", js: "TaxAccumulatedBalRecPF", typ: r("TaxAccumulatedBALRecPF") },
        { json: "Tot562x", js: "Tot562x", typ: 0 },
        { json: "UnDsclsdInvstmntsUs69B", js: "UnDsclsdInvstmntsUs69B", typ: 0 },
        { json: "UnExplndExpndtrUs69C", js: "UnExplndExpndtrUs69C", typ: 0 },
        { json: "UnExplndInvstmntsUs69", js: "UnExplndInvstmntsUs69", typ: 0 },
        { json: "UnExplndMoneyUs69A", js: "UnExplndMoneyUs69A", typ: 0 },
    ], false),
    "Deductions": o([
        { json: "DeductionUs57iia", js: "DeductionUs57iia", typ: 0 },
        { json: "Depreciation", js: "Depreciation", typ: 0 },
        { json: "Expenses", js: "Expenses", typ: 0 },
        { json: "IntExp57", js: "IntExp57", typ: u(undefined, 0) },
        { json: "TotDeductions", js: "TotDeductions", typ: 0 },
        { json: "UsrIntExp57", js: "UsrIntExp57", typ: u(undefined, 0) },
    ], false),
    "IncChargblSplRateOS": o([
        { json: "NRIOsDTAA", js: "NRIOsDTAA", typ: u(undefined, r("NRIincChrUsDTAA")) },
        { json: "TotalAmtTaxUsDTAASchOs", js: "TotalAmtTaxUsDTAASchOs", typ: 0 },
    ], false),
    "NRIincChrUsDTAA": o([
        { json: "NRIDTAADtlsSchOS", js: "NRIDTAADtlsSchOS", typ: u(undefined, a(r("NRIDTAADtlsSchO"))) },
    ], false),
    "NRIDTAADtlsSchO": o([
        { json: "ApplicableRate", js: "ApplicableRate", typ: u(undefined, 3.14) },
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "DTAAamt", js: "DTAAamt", typ: 0 },
        { json: "DTAAarticle", js: "DTAAarticle", typ: "" },
        { json: "ItemNoincl", js: "ItemNoincl", typ: r("NRIDTAADtlsSchOItemNoincl") },
        { json: "NatureOfIncome", js: "NatureOfIncome", typ: r("NatureOfIncome") },
        { json: "RateAsPerITAct", js: "RateAsPerITAct", typ: 3.14 },
        { json: "RateAsPerTreaty", js: "RateAsPerTreaty", typ: 3.14 },
        { json: "TaxRescertifiedFlag", js: "TaxRescertifiedFlag", typ: u(undefined, r("TaxRescertifiedFlag")) },
    ], false),
    "NOT89AType": o([
        { json: "NOT89AAmount", js: "NOT89AAmount", typ: 0 },
        { json: "NOT89ACountrycode", js: "NOT89ACountrycode", typ: r("NOT89ACountrycode") },
    ], false),
    "OthersGrossDtl": o([
        { json: "SourceAmount", js: "SourceAmount", typ: u(undefined, 0) },
        { json: "SourceDescription", js: "SourceDescription", typ: r("OthersGrossDtlSourceDescription") },
    ], false),
    "IncOthThanOwnRaceHorseOthersInc": o([
        { json: "OthersIncDtls", js: "OthersIncDtls", typ: u(undefined, a(r("OthersIncDtlOS"))) },
    ], false),
    "OthersIncDtlOS": o([
        { json: "OthAmount", js: "OthAmount", typ: 0 },
        { json: "OthNatOfInc", js: "OthNatOfInc", typ: "" },
    ], false),
    "PTIOthersGrossDtl": o([
        { json: "SourceAmount", js: "SourceAmount", typ: u(undefined, 0) },
        { json: "SourceDescription", js: "SourceDescription", typ: r("PTIOthersGrossDtlSourceDescription") },
    ], false),
    "TaxAccumulatedBALRecPF": o([
        { json: "TaxAccmltdBalRecPFDtls", js: "TaxAccmltdBalRecPFDtls", typ: u(undefined, a(r("TaxAccmltdBALRecPFDtl"))) },
        { json: "TotalIncomeBenefit", js: "TotalIncomeBenefit", typ: 0 },
        { json: "TotalTaxBenefit", js: "TotalTaxBenefit", typ: 0 },
    ], false),
    "TaxAccmltdBALRecPFDtl": o([
        { json: "AssessmentYear", js: "AssessmentYear", typ: r("AssessmentYear") },
        { json: "IncomeBenefit", js: "IncomeBenefit", typ: 0 },
        { json: "TaxBenefit", js: "TaxBenefit", typ: 0 },
    ], false),
    "SchedulePTI": o([
        { json: "SchedulePTIDtls", js: "SchedulePTIDtls", typ: u(undefined, a(r("SchedulePTIDtls"))) },
    ], false),
    "SchedulePTIDtls": o([
        { json: "BusinessName", js: "BusinessName", typ: "" },
        { json: "BusinessPAN", js: "BusinessPAN", typ: "" },
        { json: "CapitalGainsPTI", js: "CapitalGainsPTI", typ: r("CapitalGainsPTI") },
        { json: "IncClmdPTI", js: "IncClmdPTI", typ: r("IncClmdPTI") },
        { json: "IncFromHP", js: "IncFromHP", typ: r("SchedulePTIType") },
        { json: "IncOthSrc", js: "IncOthSrc", typ: r("SchedulePTITypeOS23FBB") },
        { json: "InvstmntCvrdUs115UA115UB", js: "InvstmntCvrdUs115UA115UB", typ: "" },
        { json: "OS_Dividend", js: "OS_Dividend", typ: r("SchedulePTITypeOS23FBB") },
        { json: "OS_Others", js: "OS_Others", typ: r("SchedulePTITypeOS23FBB") },
    ], false),
    "CapitalGainsPTI": o([
        { json: "LTCG_Others", js: "LTCG_Others", typ: r("SchedulePTIType") },
        { json: "LTCG_Sec112A", js: "LTCG_Sec112A", typ: r("SchedulePTIType") },
        { json: "LongTermCG", js: "LongTermCG", typ: r("SchedulePTIType") },
        { json: "STCG_Others", js: "STCG_Others", typ: r("SchedulePTIType") },
        { json: "STCG_Sec111A", js: "STCG_Sec111A", typ: r("SchedulePTIType") },
        { json: "ShortTermCG", js: "ShortTermCG", typ: r("SchedulePTIType") },
    ], false),
    "SchedulePTIType": o([
        { json: "AmountOfInc", js: "AmountOfInc", typ: 0 },
        { json: "CurrYrLossShareByInvstFund", js: "CurrYrLossShareByInvstFund", typ: 0 },
        { json: "NetIncomeLoss", js: "NetIncomeLoss", typ: 0 },
        { json: "TDSAmount", js: "TDSAmount", typ: 0 },
    ], false),
    "IncClmdPTI": o([
        { json: "Sec23FBB", js: "Sec23FBB", typ: r("SchedulePTITypeOS23FBB") },
        { json: "SecBIncExmptDtl", js: "SecBIncExmptDtl", typ: u(undefined, r("SchedulePTIIncExmtType")) },
        { json: "SecCIncExmptDtl", js: "SecCIncExmptDtl", typ: u(undefined, r("SchedulePTIIncExmtType")) },
        { json: "TotalSec23FBB", js: "TotalSec23FBB", typ: r("SchedulePTITypeOS23FBB") },
    ], false),
    "SchedulePTITypeOS23FBB": o([
        { json: "AmountOfInc", js: "AmountOfInc", typ: 0 },
        { json: "NetIncomeLoss", js: "NetIncomeLoss", typ: 0 },
        { json: "TDSAmount", js: "TDSAmount", typ: 0 },
    ], false),
    "SchedulePTIIncExmtType": o([
        { json: "SecBCIncExmptDtl", js: "SecBCIncExmptDtl", typ: r("SchedulePTITypeOS23FBB") },
        { json: "SectionCode", js: "SectionCode", typ: "" },
    ], false),
    "ScheduleS": o([
        { json: "AllwncExemptUs10", js: "AllwncExemptUs10", typ: u(undefined, r("AllwncExemptUs10")) },
        { json: "AllwncExtentExemptUs10", js: "AllwncExtentExemptUs10", typ: 0 },
        { json: "DeductionUS16", js: "DeductionUS16", typ: 0 },
        { json: "DeductionUnderSection16ia", js: "DeductionUnderSection16ia", typ: 0 },
        { json: "EntertainmntalwncUs16ii", js: "EntertainmntalwncUs16ii", typ: 0 },
        { json: "Increliefus89A", js: "Increliefus89A", typ: u(undefined, 0) },
        { json: "NetSalary", js: "NetSalary", typ: 0 },
        { json: "ProfessionalTaxUs16iii", js: "ProfessionalTaxUs16iii", typ: 0 },
        { json: "Salaries", js: "Salaries", typ: u(undefined, a(r("Salaries"))) },
        { json: "TotIncUnderHeadSalaries", js: "TotIncUnderHeadSalaries", typ: 0 },
        { json: "TotalGrossSalary", js: "TotalGrossSalary", typ: 0 },
    ], false),
    "AllwncExemptUs10": o([
        { json: "AllwncExemptUs10Dtls", js: "AllwncExemptUs10Dtls", typ: u(undefined, a(r("AllwncExemptUs10DtlsType"))) },
    ], false),
    "AllwncExemptUs10DtlsType": o([
        { json: "SalNatureDesc", js: "SalNatureDesc", typ: r("SalNatureDesc") },
        { json: "SalOthAmount", js: "SalOthAmount", typ: 0 },
        { json: "SalOthNatOfInc", js: "SalOthNatOfInc", typ: u(undefined, "") },
    ], false),
    "Salaries": o([
        { json: "AddressDetail", js: "AddressDetail", typ: r("AddressDetail") },
        { json: "NameOfEmployer", js: "NameOfEmployer", typ: "" },
        { json: "NatureOfEmployment", js: "NatureOfEmployment", typ: r("NatureOfEmployment") },
        { json: "Salarys", js: "Salarys", typ: r("Salarys") },
        { json: "TANofEmployer", js: "TANofEmployer", typ: u(undefined, "") },
    ], false),
    "AddressDetail": o([
        { json: "AddrDetail", js: "AddrDetail", typ: "" },
        { json: "CityOrTownOrDistrict", js: "CityOrTownOrDistrict", typ: "" },
        { json: "PinCode", js: "PinCode", typ: u(undefined, 0) },
        { json: "StateCode", js: "StateCode", typ: r("StateCode") },
        { json: "ZipCode", js: "ZipCode", typ: u(undefined, "") },
    ], false),
    "Salarys": o([
        { json: "GrossSalary", js: "GrossSalary", typ: 0 },
        { json: "IncomeNotified89A", js: "IncomeNotified89A", typ: 0 },
        { json: "IncomeNotified89AType", js: "IncomeNotified89AType", typ: u(undefined, a(r("NOT89AType"))) },
        { json: "IncomeNotifiedOther89A", js: "IncomeNotifiedOther89A", typ: 0 },
        { json: "IncomeNotifiedPrYr89A", js: "IncomeNotifiedPrYr89A", typ: u(undefined, 0) },
        { json: "NatureOfPerquisites", js: "NatureOfPerquisites", typ: u(undefined, r("NatureOfPerquisites")) },
        { json: "NatureOfProfitInLieuOfSalary", js: "NatureOfProfitInLieuOfSalary", typ: u(undefined, r("NatureOfProfitInLieuOfSalary")) },
        { json: "NatureOfSalary", js: "NatureOfSalary", typ: u(undefined, r("NatureOfSalary")) },
        { json: "ProfitsinLieuOfSalary", js: "ProfitsinLieuOfSalary", typ: 0 },
        { json: "Salary", js: "Salary", typ: 0 },
        { json: "ValueOfPerquisites", js: "ValueOfPerquisites", typ: 0 },
    ], false),
    "NatureOfPerquisites": o([
        { json: "OthersIncDtls", js: "OthersIncDtls", typ: u(undefined, a(r("NatureOfPerquisitesType"))) },
    ], false),
    "NatureOfPerquisitesType": o([
        { json: "NatureDesc", js: "NatureDesc", typ: r("FluffyNatureDesc") },
        { json: "OthAmount", js: "OthAmount", typ: 0 },
        { json: "OthNatOfInc", js: "OthNatOfInc", typ: u(undefined, "") },
    ], false),
    "NatureOfProfitInLieuOfSalary": o([
        { json: "OthersIncDtls", js: "OthersIncDtls", typ: u(undefined, a(r("NatureOfProfitInLieuOfSalaryType"))) },
    ], false),
    "NatureOfProfitInLieuOfSalaryType": o([
        { json: "NatureDesc", js: "NatureDesc", typ: r("TentacledNatureDesc") },
        { json: "OthAmount", js: "OthAmount", typ: 0 },
        { json: "OthNatOfInc", js: "OthNatOfInc", typ: u(undefined, "") },
    ], false),
    "NatureOfSalary": o([
        { json: "OthersIncDtls", js: "OthersIncDtls", typ: u(undefined, a(r("NatureOfSalaryDtlsType"))) },
    ], false),
    "NatureOfSalaryDtlsType": o([
        { json: "NatureDesc", js: "NatureDesc", typ: r("StickyNatureDesc") },
        { json: "OthAmount", js: "OthAmount", typ: 0 },
        { json: "OthNatOfInc", js: "OthNatOfInc", typ: u(undefined, "") },
    ], false),
    "ScheduleSI": o([
        { json: "SplCodeRateTax", js: "SplCodeRateTax", typ: u(undefined, a(r("SplCodeRateTax"))) },
        { json: "TotSplRateInc", js: "TotSplRateInc", typ: 0 },
        { json: "TotSplRateIncTax", js: "TotSplRateIncTax", typ: 0 },
    ], false),
    "SplCodeRateTax": o([
        { json: "SecCode", js: "SecCode", typ: r("SECCode") },
        { json: "SplRateInc", js: "SplRateInc", typ: 0 },
        { json: "SplRateIncTax", js: "SplRateIncTax", typ: 0 },
        { json: "SplRatePercent", js: "SplRatePercent", typ: 3.14 },
    ], false),
    "ScheduleSPI": o([
        { json: "SpecifiedPerson", js: "SpecifiedPerson", typ: u(undefined, a(r("SpecifiedPerson"))) },
    ], false),
    "SpecifiedPerson": o([
        { json: "AaadhaarOfSpecPerson", js: "AaadhaarOfSpecPerson", typ: u(undefined, "") },
        { json: "AmtIncluded", js: "AmtIncluded", typ: 0 },
        { json: "HeadIncIncluded", js: "HeadIncIncluded", typ: r("HeadIncIncluded") },
        { json: "PANofSpecPerson", js: "PANofSpecPerson", typ: u(undefined, "") },
        { json: "ReltnShip", js: "ReltnShip", typ: "" },
        { json: "SpecifiedPersonName", js: "SpecifiedPersonName", typ: "" },
    ], false),
    "ScheduleTCS": o([
        { json: "TCS", js: "TCS", typ: u(undefined, a(r("Tc"))) },
        { json: "TotalSchTCS", js: "TotalSchTCS", typ: 0 },
    ], false),
    "Tc": o([
        { json: "AmtCarriedFwd", js: "AmtCarriedFwd", typ: u(undefined, 0) },
        { json: "BroughtFwdTDSAmt", js: "BroughtFwdTDSAmt", typ: u(undefined, 0) },
        { json: "DeductedYr", js: "DeductedYr", typ: u(undefined, 0) },
        { json: "EmployerOrDeductorOrCollectTAN", js: "EmployerOrDeductorOrCollectTAN", typ: "" },
        { json: "PANOfSpouseOrOthrPrsn", js: "PANOfSpouseOrOthrPrsn", typ: u(undefined, "") },
        { json: "TCSClaimedThisYearDtls", js: "TCSClaimedThisYearDtls", typ: u(undefined, r("TCSClaimedThisYearDtls")) },
        { json: "TCSCreditOwner", js: "TCSCreditOwner", typ: r("NatureOfDisability") },
        { json: "TCSCurrFYDtls", js: "TCSCurrFYDtls", typ: u(undefined, r("TCSCurrFYDtls")) },
    ], false),
    "TCSClaimedThisYearDtls": o([
        { json: "PANOfSpouseOrOthrPrsn", js: "PANOfSpouseOrOthrPrsn", typ: u(undefined, "") },
        { json: "TCSAmtCollOwnHand", js: "TCSAmtCollOwnHand", typ: u(undefined, 0) },
        { json: "TCSAmtCollSpouseOrOthrHand", js: "TCSAmtCollSpouseOrOthrHand", typ: u(undefined, 0) },
    ], false),
    "TCSCurrFYDtls": o([
        { json: "TCSAmtCollOwnHand", js: "TCSAmtCollOwnHand", typ: u(undefined, 0) },
        { json: "TCSAmtCollSpouseOrOthrHand", js: "TCSAmtCollSpouseOrOthrHand", typ: u(undefined, 0) },
    ], false),
    "ScheduleTDS1": o([
        { json: "TDSonSalary", js: "TDSonSalary", typ: u(undefined, a(r("TDSonSalary"))) },
        { json: "TotalTDSonSalaries", js: "TotalTDSonSalaries", typ: 0 },
    ], false),
    "TDSonSalary": o([
        { json: "EmployerOrDeductorOrCollectDetl", js: "EmployerOrDeductorOrCollectDetl", typ: r("EmployerOrDeductorOrCollectDetl") },
        { json: "IncChrgSal", js: "IncChrgSal", typ: 0 },
        { json: "TotalTDSSal", js: "TotalTDSSal", typ: 0 },
    ], false),
    "EmployerOrDeductorOrCollectDetl": o([
        { json: "EmployerOrDeductorOrCollecterName", js: "EmployerOrDeductorOrCollecterName", typ: "" },
        { json: "TAN", js: "TAN", typ: "" },
    ], false),
    "ScheduleTDS2": o([
        { json: "TDSOthThanSalaryDtls", js: "TDSOthThanSalaryDtls", typ: u(undefined, a(r("TDSOthThanSalaryDtls"))) },
        { json: "TotalTDSonOthThanSals", js: "TotalTDSonOthThanSals", typ: 0 },
    ], false),
    "TDSOthThanSalaryDtls": o([
        { json: "AadhaarOfOtherPerson", js: "AadhaarOfOtherPerson", typ: u(undefined, "") },
        { json: "AmtCarriedFwd", js: "AmtCarriedFwd", typ: 0 },
        { json: "BroughtFwdTDSAmt", js: "BroughtFwdTDSAmt", typ: u(undefined, 0) },
        { json: "DeductedYr", js: "DeductedYr", typ: u(undefined, 0) },
        { json: "GrossAmount", js: "GrossAmount", typ: u(undefined, 0) },
        { json: "HeadOfIncome", js: "HeadOfIncome", typ: u(undefined, r("TDSOthThanSalaryDtlHeadOfIncome")) },
        { json: "PANofOtherPerson", js: "PANofOtherPerson", typ: u(undefined, "") },
        { json: "TANOfDeductor", js: "TANOfDeductor", typ: "" },
        { json: "TDSCreditName", js: "TDSCreditName", typ: r("TDSCreditName") },
        { json: "TaxDeductCreditDtls", js: "TaxDeductCreditDtls", typ: r("TaxDeductCreditDtls") },
    ], false),
    "TaxDeductCreditDtls": o([
        { json: "SpouseOthPrsnAadhaar", js: "SpouseOthPrsnAadhaar", typ: u(undefined, "") },
        { json: "TaxClaimedIncome", js: "TaxClaimedIncome", typ: u(undefined, 0) },
        { json: "TaxClaimedOwnHands", js: "TaxClaimedOwnHands", typ: 0 },
        { json: "TaxClaimedSpouseOthPrsnPAN", js: "TaxClaimedSpouseOthPrsnPAN", typ: u(undefined, "") },
        { json: "TaxClaimedTDS", js: "TaxClaimedTDS", typ: u(undefined, 0) },
        { json: "TaxDeductedIncome", js: "TaxDeductedIncome", typ: u(undefined, 0) },
        { json: "TaxDeductedOwnHands", js: "TaxDeductedOwnHands", typ: u(undefined, 0) },
        { json: "TaxDeductedTDS", js: "TaxDeductedTDS", typ: u(undefined, 0) },
    ], false),
    "ScheduleTDS3": o([
        { json: "TDS3onOthThanSalDtls", js: "TDS3onOthThanSalDtls", typ: u(undefined, a(r("TDS3OnOthThanSalDtls"))) },
        { json: "TotalTDS3OnOthThanSal", js: "TotalTDS3OnOthThanSal", typ: 0 },
    ], false),
    "TDS3OnOthThanSalDtls": o([
        { json: "AadhaarOfBuyerTenant", js: "AadhaarOfBuyerTenant", typ: u(undefined, "") },
        { json: "AadhaarOfOtherPerson", js: "AadhaarOfOtherPerson", typ: u(undefined, "") },
        { json: "AmtCarriedFwd", js: "AmtCarriedFwd", typ: 0 },
        { json: "BroughtFwdTDSAmt", js: "BroughtFwdTDSAmt", typ: u(undefined, 0) },
        { json: "DeductedYr", js: "DeductedYr", typ: u(undefined, 0) },
        { json: "GrossAmount", js: "GrossAmount", typ: u(undefined, 0) },
        { json: "HeadOfIncome", js: "HeadOfIncome", typ: u(undefined, r("TDS3OnOthThanSalDtlHeadOfIncome")) },
        { json: "PANOfBuyerTenant", js: "PANOfBuyerTenant", typ: "" },
        { json: "PANofOtherPerson", js: "PANofOtherPerson", typ: u(undefined, "") },
        { json: "TDSCreditName", js: "TDSCreditName", typ: r("TDSCreditName") },
        { json: "TaxDeductCreditDtls", js: "TaxDeductCreditDtls", typ: r("TaxDeductCreditDtls") },
    ], false),
    "ScheduleTR1": o([
        { json: "AmtTaxRefunded", js: "AmtTaxRefunded", typ: u(undefined, 0) },
        { json: "AssmtYrTaxRelief", js: "AssmtYrTaxRelief", typ: u(undefined, "") },
        { json: "ScheduleTR", js: "ScheduleTR", typ: u(undefined, a(r("ScheduleTR"))) },
        { json: "TaxPaidOutsideIndFlg", js: "TaxPaidOutsideIndFlg", typ: u(undefined, r("AssetOutIndiaFlag")) },
        { json: "TaxReliefOutsideIndiaDTAA", js: "TaxReliefOutsideIndiaDTAA", typ: 0 },
        { json: "TaxReliefOutsideIndiaNotDTAA", js: "TaxReliefOutsideIndiaNotDTAA", typ: 0 },
        { json: "TotalTaxPaidOutsideIndia", js: "TotalTaxPaidOutsideIndia", typ: 0 },
        { json: "TotalTaxReliefOutsideIndia", js: "TotalTaxReliefOutsideIndia", typ: 0 },
    ], false),
    "ScheduleTR": o([
        { json: "CountryCodeExcludingIndia", js: "CountryCodeExcludingIndia", typ: r("CountryCodeExcludingIndia") },
        { json: "CountryName", js: "CountryName", typ: "" },
        { json: "ReliefClaimedUsSection", js: "ReliefClaimedUsSection", typ: u(undefined, r("ReliefClaimedUsSection")) },
        { json: "TaxIdentificationNo", js: "TaxIdentificationNo", typ: "" },
        { json: "TaxPaidOutsideIndia", js: "TaxPaidOutsideIndia", typ: 0 },
        { json: "TaxReliefOutsideIndia", js: "TaxReliefOutsideIndia", typ: 0 },
    ], false),
    "ScheduleVDA": o([
        { json: "ScheduleVDADtls", js: "ScheduleVDADtls", typ: a(r("ScheduleVDADtl")) },
        { json: "TotIncCapGain", js: "TotIncCapGain", typ: 0 },
    ], false),
    "ScheduleVDADtl": o([
        { json: "AcquisitionCost", js: "AcquisitionCost", typ: 0 },
        { json: "ConsidReceived", js: "ConsidReceived", typ: 0 },
        { json: "DateofAcquisition", js: "DateofAcquisition", typ: "" },
        { json: "DateofTransfer", js: "DateofTransfer", typ: "" },
        { json: "HeadUndIncTaxed", js: "HeadUndIncTaxed", typ: r("HeadUndIncTaxed") },
        { json: "IncomeFromVDA", js: "IncomeFromVDA", typ: 0 },
    ], false),
    "ScheduleVIA": o([
        { json: "DeductUndChapVIA", js: "DeductUndChapVIA", typ: r("DeductUndChapVIA") },
        { json: "UsrDeductUndChapVIA", js: "UsrDeductUndChapVIA", typ: r("USRDeductUndChapVIA") },
    ], false),
    "DeductUndChapVIA": o([
        { json: "AnyOthSec80CCH", js: "AnyOthSec80CCH", typ: u(undefined, 0) },
        { json: "Section80C", js: "Section80C", typ: u(undefined, 0) },
        { json: "Section80CCC", js: "Section80CCC", typ: u(undefined, 0) },
        { json: "Section80CCD1B", js: "Section80CCD1B", typ: u(undefined, 0) },
        { json: "Section80CCDEmployeeOrSE", js: "Section80CCDEmployeeOrSE", typ: u(undefined, 0) },
        { json: "Section80CCDEmployer", js: "Section80CCDEmployer", typ: u(undefined, 0) },
        { json: "Section80D", js: "Section80D", typ: 0 },
        { json: "Section80DD", js: "Section80DD", typ: u(undefined, 0) },
        { json: "Section80DDB", js: "Section80DDB", typ: u(undefined, 0) },
        { json: "Section80E", js: "Section80E", typ: u(undefined, 0) },
        { json: "Section80EE", js: "Section80EE", typ: u(undefined, 0) },
        { json: "Section80EEA", js: "Section80EEA", typ: u(undefined, 0) },
        { json: "Section80EEB", js: "Section80EEB", typ: u(undefined, 0) },
        { json: "Section80G", js: "Section80G", typ: 0 },
        { json: "Section80GG", js: "Section80GG", typ: u(undefined, 0) },
        { json: "Section80GGA", js: "Section80GGA", typ: 0 },
        { json: "Section80GGC", js: "Section80GGC", typ: u(undefined, 0) },
        { json: "Section80QQB", js: "Section80QQB", typ: u(undefined, 0) },
        { json: "Section80RRB", js: "Section80RRB", typ: u(undefined, 0) },
        { json: "Section80TTA", js: "Section80TTA", typ: u(undefined, 0) },
        { json: "Section80TTB", js: "Section80TTB", typ: u(undefined, 0) },
        { json: "Section80U", js: "Section80U", typ: u(undefined, 0) },
        { json: "TotalChapVIADeductions", js: "TotalChapVIADeductions", typ: 0 },
    ], false),
    "USRDeductUndChapVIA": o([
        { json: "AnyOthSec80CCH", js: "AnyOthSec80CCH", typ: u(undefined, 0) },
        { json: "Section80C", js: "Section80C", typ: u(undefined, 0) },
        { json: "Section80CCC", js: "Section80CCC", typ: u(undefined, 0) },
        { json: "Section80CCD1B", js: "Section80CCD1B", typ: u(undefined, 0) },
        { json: "Section80CCDEmployeeOrSE", js: "Section80CCDEmployeeOrSE", typ: u(undefined, 0) },
        { json: "Section80CCDEmployer", js: "Section80CCDEmployer", typ: u(undefined, 0) },
        { json: "Section80D", js: "Section80D", typ: u(undefined, 0) },
        { json: "Section80DD", js: "Section80DD", typ: u(undefined, 0) },
        { json: "Section80DDB", js: "Section80DDB", typ: u(undefined, 0) },
        { json: "Section80DDBUsrType", js: "Section80DDBUsrType", typ: u(undefined, r("NatureOfDisability")) },
        { json: "Section80E", js: "Section80E", typ: u(undefined, 0) },
        { json: "Section80EE", js: "Section80EE", typ: u(undefined, 0) },
        { json: "Section80EEA", js: "Section80EEA", typ: u(undefined, 0) },
        { json: "Section80EEB", js: "Section80EEB", typ: u(undefined, 0) },
        { json: "Section80G", js: "Section80G", typ: u(undefined, 0) },
        { json: "Section80GG", js: "Section80GG", typ: u(undefined, 0) },
        { json: "Section80GGA", js: "Section80GGA", typ: u(undefined, 0) },
        { json: "Section80GGC", js: "Section80GGC", typ: u(undefined, 0) },
        { json: "Section80QQB", js: "Section80QQB", typ: u(undefined, 0) },
        { json: "Section80RRB", js: "Section80RRB", typ: u(undefined, 0) },
        { json: "Section80TTA", js: "Section80TTA", typ: u(undefined, 0) },
        { json: "Section80TTB", js: "Section80TTB", typ: u(undefined, 0) },
        { json: "Section80U", js: "Section80U", typ: u(undefined, 0) },
        { json: "TotalChapVIADeductions", js: "TotalChapVIADeductions", typ: u(undefined, 0) },
    ], false),
    "TaxReturnPreparer": o([
        { json: "IdentificationNoOfTRP", js: "IdentificationNoOfTRP", typ: "" },
        { json: "NameOfTRP", js: "NameOfTRP", typ: "" },
        { json: "ReImbFrmGov", js: "ReImbFrmGov", typ: 0 },
    ], false),
    "Verification": o([
        { json: "Capacity", js: "Capacity", typ: r("Capacity") },
        { json: "Date", js: "Date", typ: u(undefined, "") },
        { json: "Declaration", js: "Declaration", typ: r("Declaration") },
        { json: "Place", js: "Place", typ: u(undefined, "") },
    ], false),
    "Declaration": o([
        { json: "AssesseeVerName", js: "AssesseeVerName", typ: "" },
        { json: "AssesseeVerPAN", js: "AssesseeVerPAN", typ: "" },
        { json: "FatherName", js: "FatherName", typ: "" },
    ], false),
    "TaxRescertifiedFlag": [
        "N",
        "Y",
    ],
    "RepCapacity": [
        "G",
        "L",
        "M",
        "O",
    ],
    "CompanyType": [
        "D",
        "F",
    ],
    "SharesTypes": [
        "L",
        "U",
    ],
    "ConditionsResStatus": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ],
    "JurisdictionResidence": [
        "1",
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1242",
        "1246",
        "1264",
        "1268",
        "1284",
        "1340",
        "1345",
        "14",
        "1441",
        "1473",
        "1481",
        "15",
        "1534",
        "1624",
        "1649",
        "1664",
        "1670",
        "1671",
        "1721",
        "1758",
        "1767",
        "1784",
        "1787",
        "1809",
        "1868",
        "1869",
        "1876",
        "2",
        "20",
        "211",
        "212",
        "213",
        "216",
        "218",
        "220",
        "221",
        "222",
        "223",
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
        "241",
        "242",
        "243",
        "244",
        "245",
        "248",
        "249",
        "250",
        "251",
        "252",
        "253",
        "254",
        "255",
        "256",
        "257",
        "258",
        "260",
        "261",
        "262",
        "263",
        "264",
        "265",
        "266",
        "267",
        "268",
        "269",
        "270",
        "28",
        "290",
        "291",
        "297",
        "298",
        "299",
        "30",
        "31",
        "32",
        "33",
        "35",
        "350",
        "352",
        "353",
        "354",
        "355",
        "356",
        "357",
        "358",
        "359",
        "36",
        "370",
        "371",
        "372",
        "373",
        "374",
        "375",
        "376",
        "377",
        "378",
        "380",
        "381",
        "382",
        "385",
        "386",
        "387",
        "389",
        "40",
        "41",
        "420",
        "421",
        "423",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "5",
        "500",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "590",
        "591",
        "592",
        "593",
        "594",
        "595",
        "596",
        "597",
        "598",
        "6",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "670",
        "672",
        "673",
        "674",
        "675",
        "676",
        "677",
        "678",
        "679",
        "680",
        "681",
        "682",
        "683",
        "684",
        "685",
        "686",
        "687",
        "688",
        "689",
        "690",
        "691",
        "692",
        "7",
        "8",
        "81",
        "82",
        "84",
        "850",
        "852",
        "853",
        "855",
        "856",
        "86",
        "880",
        "886",
        "9",
        "90",
        "92",
        "93",
        "94",
        "95",
        "960",
        "961",
        "962",
        "963",
        "964",
        "965",
        "966",
        "967",
        "968",
        "970",
        "971",
        "972",
        "973",
        "974",
        "975",
        "976",
        "977",
        "98",
        "992",
        "993",
        "994",
        "995",
        "996",
        "998",
        "9998",
        "9999",
    ],
    "ResidentialStatus": [
        "NOR",
        "NRI",
        "RES",
    ],
    "NatureOfDisability": [
        "1",
        "2",
    ],
    "CountryCode": [
        "1",
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1242",
        "1246",
        "1264",
        "1268",
        "1284",
        "1340",
        "1345",
        "14",
        "1441",
        "1473",
        "1481",
        "15",
        "1534",
        "1624",
        "1649",
        "1664",
        "1670",
        "1671",
        "1721",
        "1758",
        "1767",
        "1784",
        "1787",
        "1809",
        "1868",
        "1869",
        "1876",
        "2",
        "20",
        "211",
        "212",
        "213",
        "216",
        "218",
        "220",
        "221",
        "222",
        "223",
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
        "241",
        "242",
        "243",
        "244",
        "245",
        "248",
        "249",
        "250",
        "251",
        "252",
        "253",
        "254",
        "255",
        "256",
        "257",
        "258",
        "260",
        "261",
        "262",
        "263",
        "264",
        "265",
        "266",
        "267",
        "268",
        "269",
        "270",
        "28",
        "290",
        "291",
        "297",
        "298",
        "299",
        "30",
        "31",
        "32",
        "33",
        "35",
        "350",
        "352",
        "353",
        "354",
        "355",
        "356",
        "357",
        "358",
        "359",
        "36",
        "370",
        "371",
        "372",
        "373",
        "374",
        "375",
        "376",
        "377",
        "378",
        "380",
        "381",
        "382",
        "385",
        "386",
        "387",
        "389",
        "40",
        "41",
        "420",
        "421",
        "423",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "5",
        "500",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "590",
        "591",
        "592",
        "593",
        "594",
        "595",
        "596",
        "597",
        "598",
        "6",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "670",
        "672",
        "673",
        "674",
        "675",
        "676",
        "677",
        "678",
        "679",
        "680",
        "681",
        "682",
        "683",
        "684",
        "685",
        "686",
        "687",
        "688",
        "689",
        "690",
        "691",
        "692",
        "7",
        "8",
        "81",
        "82",
        "84",
        "850",
        "852",
        "853",
        "855",
        "856",
        "86",
        "880",
        "886",
        "9",
        "90",
        "91",
        "92",
        "93",
        "94",
        "95",
        "960",
        "961",
        "962",
        "963",
        "964",
        "965",
        "966",
        "967",
        "968",
        "970",
        "971",
        "972",
        "973",
        "974",
        "975",
        "976",
        "977",
        "98",
        "992",
        "993",
        "994",
        "995",
        "996",
        "998",
        "9999",
    ],
    "StateCode": [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "99",
    ],
    "Status": [
        "H",
        "I",
    ],
    "AssetOutIndiaFlag": [
        "NO",
        "YES",
    ],
    "AccountType": [
        "CA",
        "CC",
        "CGAS",
        "NRO",
        "OD",
        "OTH",
        "SB",
    ],
    "ShareOnOrBefore": [
        "AE",
        "BE",
    ],
    "DependentType": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
    ],
    "PurpleStateCode": [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
    ],
    "RelevantClauseUndrDedClaimed": [
        "80GGA2a",
        "80GGA2aa",
        "80GGA2b",
        "80GGA2bb",
        "80GGA2c",
        "80GGA2cc",
        "80GGA2d",
        "80GGA2e",
    ],
    "CurrAssYr": [
        "2024-25",
    ],
    "AssYr": [
        "2013-14",
        "2014-15",
        "2015-16",
        "2016-17",
        "2017-18",
        "2018-19",
        "2019-20",
        "2020-21",
        "2021-22",
        "2022-23",
        "2023-24",
    ],
    "CountryCodeExcludingIndia": [
        "1",
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1242",
        "1246",
        "1264",
        "1268",
        "1284",
        "1340",
        "1345",
        "14",
        "1441",
        "1473",
        "1481",
        "15",
        "1534",
        "1624",
        "1649",
        "1664",
        "1670",
        "1671",
        "1721",
        "1758",
        "1767",
        "1784",
        "1787",
        "1809",
        "1868",
        "1869",
        "1876",
        "2",
        "20",
        "211",
        "212",
        "213",
        "216",
        "218",
        "220",
        "221",
        "222",
        "223",
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
        "241",
        "242",
        "243",
        "244",
        "245",
        "248",
        "249",
        "250",
        "251",
        "252",
        "253",
        "254",
        "255",
        "256",
        "257",
        "258",
        "260",
        "261",
        "262",
        "263",
        "264",
        "265",
        "266",
        "267",
        "268",
        "269",
        "270",
        "28",
        "290",
        "291",
        "297",
        "298",
        "299",
        "30",
        "31",
        "32",
        "33",
        "35",
        "350",
        "352",
        "353",
        "354",
        "355",
        "356",
        "357",
        "358",
        "359",
        "36",
        "370",
        "371",
        "372",
        "373",
        "374",
        "375",
        "376",
        "377",
        "378",
        "380",
        "381",
        "382",
        "385",
        "386",
        "387",
        "389",
        "40",
        "41",
        "420",
        "421",
        "423",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "5",
        "500",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "590",
        "591",
        "592",
        "593",
        "594",
        "595",
        "596",
        "597",
        "598",
        "6",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "670",
        "672",
        "673",
        "674",
        "675",
        "676",
        "677",
        "678",
        "679",
        "680",
        "681",
        "682",
        "683",
        "684",
        "685",
        "686",
        "687",
        "688",
        "689",
        "690",
        "691",
        "692",
        "7",
        "8",
        "81",
        "82",
        "84",
        "850",
        "852",
        "853",
        "855",
        "856",
        "86",
        "880",
        "886",
        "9",
        "90",
        "92",
        "93",
        "94",
        "95",
        "960",
        "961",
        "962",
        "963",
        "964",
        "965",
        "966",
        "967",
        "968",
        "970",
        "971",
        "972",
        "973",
        "974",
        "975",
        "976",
        "977",
        "98",
        "992",
        "993",
        "994",
        "995",
        "996",
        "998",
        "9999",
    ],
    "PurpleItemNoincl": [
        "B10",
        "B11a1",
        "B11a2",
        "B11b",
        "B1e",
        "B2e",
        "B3e_112(1)",
        "B3e_115ACA",
        "B4c_112A",
        "B5c",
        "B6e_112(1)(c)",
        "B6e_115AC",
        "B6e_115AD",
        "B7c",
        "B8c",
        "B8f",
        "B9e",
    ],
    "SectionCode": [
        "21ciii",
        "5AC1c",
        "5ADiii",
    ],
    "Proviso112SectionCode": [
        "22",
        "5ACA1b",
    ],
    "ImproveDate": [
        "2001-02",
        "2002-03",
        "2003-04",
        "2004-05",
        "2005-06",
        "2006-07",
        "2007-08",
        "2008-09",
        "2009-10",
        "2010-11",
        "2011-12",
        "2012-13",
        "2013-14",
        "2014-15",
        "2015-16",
        "2016-17",
        "2017-18",
        "2018-19",
        "2019-20",
        "2020-21",
        "2021-22",
        "2022-23",
        "2023-24",
    ],
    "ExemptionSECCode": [
        "54",
        "54B",
        "54EC",
        "54F",
    ],
    "PurplePrvYrInWhichAsstTrnsfrd": [
        "2020-21",
        "2021-22",
        "2022-23",
    ],
    "PurpleSectionClmd": [
        "54",
        "54B",
        "54F",
    ],
    "YrInWhichAssetAcq": [
        "2021",
        "2022",
        "2023",
    ],
    "UnutilizedLtcgFlag": [
        "N",
        "X",
        "Y",
    ],
    "MFSectionCode": [
        "1A",
        "5AD1biip",
    ],
    "FluffyItemNoincl": [
        "A1e",
        "A2e_111A",
        "A2e_115AD",
        "A3a",
        "A3b",
        "A4e",
        "A5e",
        "A6",
        "A7a",
        "A7b",
        "A7c",
    ],
    "FluffyPrvYrInWhichAsstTrnsfrd": [
        "2021-22",
        "2022-23",
    ],
    "FluffySectionClmd": [
        "54B",
    ],
    "AgriLandIrrigatedFlag": [
        "IRG",
        "RF",
    ],
    "AgriLandOwnedFlag": [
        "H",
        "O",
    ],
    "HeadOfIncome": [
        "CG",
        "HP",
        "OS",
        "SA",
    ],
    "PurpleNatureDesc": [
        "DMDP",
        "OTH",
        "10(10BC)",
        "10(10D)",
        "10(11)",
        "10(12)",
        "10(12C)",
        "10(13)",
        "10(16)",
        "10(17)",
        "10(17A)",
        "10(18)",
        "10(19)",
        "10(26)",
        "10(26AAA)",
    ],
    "SecurityType": [
        "FS",
        "NS",
        "PS",
    ],
    "IncTaxSch": [
        "CG",
        "EI",
        "HP",
        "NI",
        "OS",
        "SA",
    ],
    "NatureOfInt": [
        "BENEFICIAL_OWNER",
        "BENIFICIARY",
        "DIRECT",
    ],
    "OwnerStatus": [
        "BENEFICIAL_OWNER",
        "BENIFICIARY",
        "OWNER",
    ],
    "NatureOfAmount": [
        "D",
        "I",
        "N",
        "O",
        "S",
    ],
    "PropertyOwner": [
        "MI",
        "OT",
        "SE",
        "SP",
    ],
    "IfLetOut": [
        "D",
        "L",
        "S",
    ],
    "NRIDTAADtlsSchOItemNoincl": [
        "PTI_5A1aA",
        "PTI_5A1ai",
        "PTI_5A1aii",
        "PTI_5A1aiia",
        "PTI_5A1aiiaa",
        "PTI_5A1aiiaaP",
        "PTI_5A1aiiab",
        "PTI_5A1aiiac",
        "PTI_5A1aiii",
        "PTI_5A1bA",
        "PTI_5AC1ab",
        "PTI_5AC1abD",
        "PTI_5ACA1a",
        "PTI_5AD1i",
        "PTI_5AD1iDiv",
        "PTI_5AD1iP",
        "PTI_5Ea",
        "PTI_5BBA",
        "PTI_5BBF",
        "PTI_5BBG",
        "56",
        "562iii",
        "562x",
        "56i",
        "5A1aA",
        "5A1ai",
        "5A1aii",
        "5A1aiia",
        "5A1aiiaa",
        "5A1aiiaaP",
        "5A1aiiab",
        "5A1aiiac",
        "5A1aiii",
        "5A1bA",
        "5AC1ab",
        "5AC1abD",
        "5ACA1a",
        "5AD1i",
        "5AD1iDiv",
        "5AD1iP",
        "5BB",
        "5BBA",
        "5BBC",
        "5BBF",
        "5BBG",
        "5BBJ",
        "5Ea",
    ],
    "NatureOfIncome": [
        "1a",
        "1b",
        "1c",
        "1d",
        "2ai",
        "2aii",
        "2d",
        "2e",
    ],
    "NOT89ACountrycode": [
        "CA",
        "UK",
        "US",
    ],
    "OthersGrossDtlSourceDescription": [
        "5A1aA",
        "5A1ai",
        "5A1aii",
        "5A1aiia",
        "5A1aiiaa",
        "5A1aiiaaP",
        "5A1aiiab",
        "5A1aiiac",
        "5A1aiii",
        "5A1bA",
        "5AC1ab",
        "5AC1abD",
        "5ACA1a",
        "5AD1i",
        "5AD1iDiv",
        "5AD1iP",
        "5BBA",
        "5BBC",
        "5BBF",
        "5BBG",
        "5Ea",
    ],
    "PTIOthersGrossDtlSourceDescription": [
        "PTI_5A1aA",
        "PTI_5A1ai",
        "PTI_5A1aii",
        "PTI_5A1aiia",
        "PTI_5A1aiiaa",
        "PTI_5A1aiiaaP",
        "PTI_5A1aiiab",
        "PTI_5A1aiiac",
        "PTI_5A1aiii",
        "PTI_5A1bA",
        "PTI_5AC1ab",
        "PTI_5AC1abD",
        "PTI_5ACA1a",
        "PTI_5AD1i",
        "PTI_5AD1iDiv",
        "PTI_5AD1iP",
        "PTI_5Ea",
        "PTI_5BBA",
        "PTI_5BBF",
        "PTI_5BBG",
    ],
    "AssessmentYear": [
        "2000-01",
        "2001-02",
        "2002-03",
        "2003-04",
        "2004-05",
        "2005-06",
        "2006-07",
        "2007-08",
        "2008-09",
        "2009-10",
        "2010-11",
        "2011-12",
        "2012-13",
        "2013-14",
        "2014-15",
        "2015-16",
        "2016-17",
        "2017-18",
        "2018-19",
        "2019-20",
        "2020-21",
        "2021-22",
        "2022-23",
        "2023-24",
    ],
    "SalNatureDesc": [
        "EIC",
        "OTH",
        "10(10)",
        "10(10A)",
        "10(10AA)",
        "10(10B)(i)",
        "10(10B)(ii)",
        "10(10C)",
        "10(10CC)",
        "10(13A)",
        "10(14)(i)",
        "10(14)(i)(115BAC)",
        "10(14)(ii)",
        "10(14)(ii)(115BAC)",
        "10(5)",
        "10(6)",
        "10(7)",
    ],
    "NatureOfEmployment": [
        "CGOV",
        "OTH",
        "PE",
        "PSU",
        "PEO",
        "PEPS",
        "PESG",
        "SGOV",
    ],
    "FluffyNatureDesc": [
        "OTH",
        "1",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "2",
        "21",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ],
    "TentacledNatureDesc": [
        "OTH",
        "1",
        "2",
        "3",
    ],
    "StickyNatureDesc": [
        "OTH",
        "1",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ],
    "SECCode": [
        "DTAALTCG",
        "DTAAOS",
        "DTAASTCG",
        "PTI_5A1aA",
        "PTI_5A1ai",
        "PTI_5A1aii",
        "PTI_5A1aiia",
        "PTI_5A1aiiaa",
        "PTI_5A1aiiaaP",
        "PTI_5A1aiiab",
        "PTI_5A1aiiac",
        "PTI_5A1aiii",
        "PTI_5A1bA",
        "PTI_5AC1ab",
        "PTI_5AC1abD",
        "PTI_5ACA1a",
        "PTI_5AD1i",
        "PTI_5AD1iDiv",
        "PTI_5AD1iP",
        "PTI_5Ea",
        "PTI_5BBA",
        "PTI_5BBF",
        "PTI_5BBG",
        "PTI_LTCG10P",
        "PTI_LTCG10P112A",
        "PTI_LTCG20P",
        "PTI_STCG15P",
        "PTI_STCG30P",
        "1",
        "1A",
        "21",
        "21ciii",
        "22",
        "2A",
        "5A1aA",
        "5A1ai",
        "5A1aii",
        "5A1aiia",
        "5A1aiiaa",
        "5A1aiiaaP",
        "5A1aiiab",
        "5A1aiiac",
        "5A1aiii",
        "5A1bA",
        "5AC1ab",
        "5AC1abD",
        "5AC1c",
        "5ACA1a",
        "5ACA1b",
        "5AD1biip",
        "5AD1i",
        "5AD1iDiv",
        "5AD1iP",
        "5ADii",
        "5ADiii",
        "5ADiiiP",
        "5BB",
        "5BBA",
        "5BBC",
        "5BBE",
        "5BBF",
        "5BBG",
        "5BBH",
        "5BBJ",
        "5Ea",
        "5Eacg",
        "5Eb",
    ],
    "HeadIncIncluded": [
        "CG",
        "EI",
        "HP",
        "OS",
        "SA",
    ],
    "TDSOthThanSalaryDtlHeadOfIncome": [
        "CG",
        "EI",
        "HP",
        "NA",
        "OS",
    ],
    "TDSCreditName": [
        "O",
        "S",
    ],
    "TDS3OnOthThanSalDtlHeadOfIncome": [
        "CG",
        "EI",
        "HP",
        "OS",
    ],
    "ReliefClaimedUsSection": [
        "90",
        "90A",
        "91",
    ],
    "HeadUndIncTaxed": [
        "CG",
    ],
    "Capacity": [
        "A",
        "K",
        "R",
        "S",
    ],
};

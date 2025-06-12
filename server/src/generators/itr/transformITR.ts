import { 
    type Itr2, 
    TDSonSalary, 
    ScheduleIT, 
    Schedule80D, 
    Schedule80G, 
    Verification, 
    ScheduleVIA, 
    IncFromOS, 
    BankAccountDtls, 
    Refund, 
    StateCode, 
    Capacity, 
    BankDetailType, 
    Sec80DSelfFamSrCtznHealth, 
    TaxPaid, 
    DoneeWithPan,
    PersonalInfo,
    FilingStatus,
    Declaration,
    Address,
    TaxesPaid,
    CountryCode,
    TaxRescertifiedFlag
} from '../../types/itr';

import { 
    type Itr1, 
    TDSonOthThanSals, 
    TaxPayments,
    AddressStateCode, 
    EmployerCategory, 
    TdsSection, 
    CollectedYrEnum, 
    UseForRefund, 
    Section80DdbUSRType, 
    DeductUndChapVIAType, 
    USRDeductUndChapVIAType,
} from '../../types/itr-1';

const mapStateCode = (stateCode: StateCode): AddressStateCode => {
    return stateCode as unknown as AddressStateCode;
};

const mapAddress = (address: Address): Address => {
    const newAddress: Address = {
        ...address,
        StateCode: address.StateCode,
        CountryCode: address.CountryCode as CountryCode,
    };
    return newAddress;
};

const mapCapacity = (capacity: Capacity): Capacity => {
    if (capacity === 'A' || capacity === 'K') {
        return Capacity.R;
    }
    return capacity;
};

const mapBankDetails = (bankDetails: BankAccountDtls): BankAccountDtls => {
    return {
        BankDtlsFlag: TaxRescertifiedFlag.Y,
        AddtnlBankDetails: bankDetails.AddtnlBankDetails?.map(detail => ({
            ...detail,
            UseForRefund: 'Y',
        } as BankDetailType))
    }
}

const mapSchedule80D = (schedule80d?: Schedule80D): Schedule80D | undefined => {
    if (!schedule80d?.Sec80DSelfFamSrCtznHealth) {
        return undefined;
    }
    return {
        Sec80DSelfFamSrCtznHealth: {
            ...schedule80d.Sec80DSelfFamSrCtznHealth,
            ParentsSeniorCitizenFlag: schedule80d.Sec80DSelfFamSrCtznHealth.ParentsSeniorCitizenFlag || 'N',
            SeniorCitizenFlag: schedule80d.Sec80DSelfFamSrCtznHealth.SeniorCitizenFlag || 'N'
        } as Sec80DSelfFamSrCtznHealth
    }
}

const mapSchedule80G = (schedule80g?: Schedule80G): Schedule80G | undefined => {
    if (!schedule80g) {
        return undefined;
    }

    const mapDonee = (donee: DoneeWithPan): DoneeWithPan => {
        const { AddressDetail, ...rest } = donee;
        const newAddress = {
            ...AddressDetail,
            StateCode: AddressDetail.StateCode,
        };
        return { ...rest, AddressDetail: newAddress } as DoneeWithPan;
    };
    
    const don100Percent = schedule80g.Don100Percent ? {
        ...schedule80g.Don100Percent,
        DoneeWithPan: schedule80g.Don100Percent.DoneeWithPan?.map(mapDonee)
    } : undefined;

    const don50PercentNoApprReqd = schedule80g.Don50PercentNoApprReqd ? {
        ...schedule80g.Don50PercentNoApprReqd,
        DoneeWithPan: schedule80g.Don50PercentNoApprReqd.DoneeWithPan?.map(mapDonee)
    } : undefined;

    const don100PercentApprReqd = schedule80g.Don100PercentApprReqd ? {
        ...schedule80g.Don100PercentApprReqd,
        DoneeWithPan: schedule80g.Don100PercentApprReqd.DoneeWithPan?.map(mapDonee)
    } : undefined;

    const don50PercentApprReqd = schedule80g.Don50PercentApprReqd ? {
        ...schedule80g.Don50PercentApprReqd,
        DoneeWithPan: schedule80g.Don50PercentApprReqd.DoneeWithPan?.map(mapDonee)
    } : undefined;

    return {
        ...schedule80g,
        Don100Percent: don100Percent,
        Don50PercentNoApprReqd: don50PercentNoApprReqd,
        Don100PercentApprReqd: don100PercentApprReqd,
        Don50PercentApprReqd: don50PercentApprReqd,
    } as Schedule80G;
};

const toTDSonOthThanSals = (itr2: Itr2): TDSonOthThanSals => {
    const tdsOthThanSals: TDSonOthThanSals = {
        TDSonOthThanSal: [],
        TotalTDSonOthThanSals: 0,
    };
    if (itr2.ScheduleTDS2?.TDSOthThanSalaryDtls) {
        tdsOthThanSals.TDSonOthThanSal = itr2.ScheduleTDS2.TDSOthThanSalaryDtls.map(
            (item) => ({
                EmployerOrDeductorOrCollectDetl: {
                    TAN: item.TANOfDeductor,
                    EmployerOrDeductorOrCollecterName: '',
                },
                DeductedYr: item.DeductedYr ? String(item.DeductedYr) as CollectedYrEnum : CollectedYrEnum.The2024,
                AmtForTaxDeduct: item.TaxDeductCreditDtls.TaxDeductedIncome || 0,
                TotTDSOnAmtPaid: item.TaxDeductCreditDtls.TaxDeductedTDS || 0,
                ClaimOutOfTotTDSOnAmtPaid: item.TaxDeductCreditDtls.TaxClaimedTDS || 0,
                TDSSection: TdsSection.The94A
            }),
        );
        tdsOthThanSals.TotalTDSonOthThanSals =
            itr2.ScheduleTDS2.TotalTDSonOthThanSals || 0;
    }
    return tdsOthThanSals;
};

export function transformITR2toITR1(itr2: Itr2): Itr1 {
    const itr1: Partial<Itr1> = {};

    // --- Part 1: Direct Mappings and Basic Info ---
    itr1.CreationInfo = itr2.CreationInfo;
    itr1.PersonalInfo = {
        ...itr2.PartA_GEN1.PersonalInfo,
        Address: mapAddress(itr2.PartA_GEN1.PersonalInfo.Address),
        EmployerCategory: EmployerCategory.Oth,
    } as PersonalInfo;
    
    itr1.FilingStatus = {
        ...itr2.PartA_GEN1.FilingStatus,
    } as FilingStatus;

    itr1.Form_ITR1 = {
        FormName: 'ITR-1',
        Description: 'For Individuals being a Resident (other than Not Ordinarily Resident) having Total Income upto Rs.50 lakhs, having Income from Salaries, One House Property, Other Sources (Interest etc.), and Agricultural Income upto Rs.5,000',
        AssessmentYear: itr2.Form_ITR2.AssessmentYear,
        SchemaVer: 'Ver1.0', 
        FormVer: 'Ver1.0'
    };
    itr1.Verification = {
        ...itr2.Verification,
        Capacity: mapCapacity(itr2.Verification.Capacity),
        Declaration: itr2.Verification.Declaration as Declaration
    } as Verification;

    // --- Part 2: Map Income, Deductions, and Tax ---
    const deductionUs16 = (itr2.ScheduleS?.DeductionUS16 || 0);

    itr1.ITR1_IncomeDeductions = {
        GrossSalary: itr2.ScheduleS?.Salaries?.[0]?.Salarys.GrossSalary || 0,
        Salary: itr2.ScheduleS?.Salaries?.[0]?.Salarys.Salary || 0,
        PerquisitesValue: itr2.ScheduleS?.Salaries?.[0]?.Salarys.ValueOfPerquisites || 0,
        ProfitsInSalary: itr2.ScheduleS?.Salaries?.[0]?.Salarys.ProfitsinLieuOfSalary || 0,
        IncomeFromSal: itr2['PartB-TI']?.Salaries || 0,
        DeductionUs16: deductionUs16,
        DeductionUs16ia: itr2.ScheduleS?.DeductionUnderSection16ia || 0,
        NetSalary: itr2.ScheduleS?.NetSalary || 0,
        TotalIncomeOfHP: itr2.ScheduleHP?.TotalIncomeChargeableUnHP || 0,
        TypeOfHP: itr2.ScheduleHP?.PropertyDetails?.[0]?.ifLetOut, // Assumes only one HP
        IncomeOthSrc: (itr2['PartB-TI'].IncFromOS as IncFromOS).TotIncFromOS,
        GrossTotIncome: itr2['PartB-TI'].GrossTotalIncome,
        DeductUndChapVIA: {
            ...itr2.ScheduleVIA?.DeductUndChapVIA,
            AnyOthSec80CCH: itr2.ScheduleVIA?.DeductUndChapVIA.AnyOthSec80CCH || 0,
            Section80C: itr2.ScheduleVIA?.DeductUndChapVIA.Section80C || 0,
            Section80CCC: itr2.ScheduleVIA?.DeductUndChapVIA.Section80CCC || 0,
            Section80CCD1B: itr2.ScheduleVIA?.DeductUndChapVIA.Section80CCD1B || 0,
            Section80CCDEmployeeOrSE: itr2.ScheduleVIA?.DeductUndChapVIA.Section80CCDEmployeeOrSE || 0,
            Section80CCDEmployer: itr2.ScheduleVIA?.DeductUndChapVIA.Section80CCDEmployer || 0,
            Section80D: itr2.ScheduleVIA?.DeductUndChapVIA.Section80D || 0,
            Section80DD: itr2.ScheduleVIA?.DeductUndChapVIA.Section80DD || 0,
            Section80DDB: itr2.ScheduleVIA?.DeductUndChapVIA.Section80DDB || 0,
            Section80E: itr2.ScheduleVIA?.DeductUndChapVIA.Section80E || 0,
            Section80EE: itr2.ScheduleVIA?.DeductUndChapVIA.Section80EE || 0,
            Section80EEA: itr2.ScheduleVIA?.DeductUndChapVIA.Section80EEA || 0,
            Section80EEB: itr2.ScheduleVIA?.DeductUndChapVIA.Section80EEB || 0,
            Section80G: itr2.ScheduleVIA?.DeductUndChapVIA.Section80G || 0,
            Section80GG: itr2.ScheduleVIA?.DeductUndChapVIA.Section80GG || 0,
            Section80GGA: itr2.ScheduleVIA?.DeductUndChapVIA.Section80GGA || 0,
            Section80GGC: itr2.ScheduleVIA?.DeductUndChapVIA.Section80GGC || 0,
            Section80U: itr2.ScheduleVIA?.DeductUndChapVIA.Section80U || 0,
            Section80TTA: itr2.ScheduleVIA?.DeductUndChapVIA.Section80TTA || 0,
            Section80TTB: itr2.ScheduleVIA?.DeductUndChapVIA.Section80TTB || 0,
            TotalChapVIADeductions: itr2.ScheduleVIA?.DeductUndChapVIA.TotalChapVIADeductions || 0,
        } as DeductUndChapVIAType,
        UsrDeductUndChapVIA: {
            ...itr2.ScheduleVIA?.UsrDeductUndChapVIA,
            AnyOthSec80CCH: itr2.ScheduleVIA?.UsrDeductUndChapVIA.AnyOthSec80CCH || 0,
            Section80C: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80C || 0,
            Section80CCC: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80CCC || 0,
            Section80CCD1B: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80CCD1B || 0,
            Section80CCDEmployeeOrSE: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80CCDEmployeeOrSE || 0,
            Section80CCDEmployer: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80CCDEmployer || 0,
            Section80D: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80D || 0,
            Section80DD: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80DD || 0,
            Section80DDB: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80DDB || 0,
            Section80DDBUsrType: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80DDBUsrType as unknown as Section80DdbUSRType,
            Section80E: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80E || 0,
            Section80EE: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80EE || 0,
            Section80EEA: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80EEA || 0,
            Section80EEB: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80EEB || 0,
            Section80G: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80G || 0,
            Section80GG: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80GG || 0,
            Section80GGA: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80GGA || 0,
            Section80GGC: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80GGC || 0,
            Section80U: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80U || 0,
            Section80TTA: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80TTA || 0,
            Section80TTB: itr2.ScheduleVIA?.UsrDeductUndChapVIA.Section80TTB || 0,
            TotalChapVIADeductions: itr2.ScheduleVIA?.UsrDeductUndChapVIA.TotalChapVIADeductions || 0,
        } as USRDeductUndChapVIAType,
        TotalIncome: itr2['PartB-TI'].TotalIncome,
        AnnualValue: 0,
        DeductionUs57iia: 0,
        GrossTotIncomeIncLTCG112A: 0,
        IncomeNotified89A: 0,
        StandardDeduction: 0,
    };
    
    itr1.ITR1_TaxComputation = {
        GrossTaxLiability: itr2.PartB_TTI.ComputationOfTaxLiability.GrossTaxLiability,
        Rebate87A: itr2.PartB_TTI.ComputationOfTaxLiability.Rebate87A,
        NetTaxLiability: itr2.PartB_TTI.ComputationOfTaxLiability.NetTaxLiability,
        IntrstPay: itr2.PartB_TTI.ComputationOfTaxLiability.IntrstPay,
        EducationCess: itr2.PartB_TTI.HealthEduCess,
        Section89: itr2.PartB_TTI.ComputationOfTaxLiability.TaxRelief?.Section89 || 0,
        TaxPayableOnRebate: 0,
        TotTaxPlusIntrstPay: 0,
        TotalIntrstPay: 0,
        TotalTaxPayable: 0
    };

    // --- Part 3: Map Schedules ---
    itr1.TDSonSalaries = itr2.ScheduleTDS1 as unknown as import('../../types/itr-1').TDSonSalaries;
    itr1.TDSonOthThanSals = toTDSonOthThanSals(itr2);
    itr1.TaxPayments = itr2.ScheduleIT as TaxPayments;
    itr1.Refund = {
        BankAccountDtls: mapBankDetails(itr2.PartB_TTI.Refund.BankAccountDtls),
        RefundDue: itr2.PartB_TTI.Refund.RefundDue,
    };

    const totalTDS = (itr2.ScheduleTDS1?.TotalTDSonSalaries || 0) + (itr2.ScheduleTDS2?.TotalTDSonOthThanSals || 0) + (itr2.ScheduleTDS3?.TotalTDS3OnOthThanSal || 0)
    const totalTCS = itr2.ScheduleTCS?.TotalSchTCS || 0
    const totalIT = itr2.ScheduleIT?.TotalTaxPayments || 0
    const totalTaxesPaid = totalTDS + totalTCS + totalIT

    itr1.TaxPaid = {
        TaxesPaid: {
            TDS: totalTDS,
            TCS: totalTCS,
            AdvanceTax: totalIT,
            SelfAssessmentTax: 0, // Assuming all from IT is Advance tax for now
            TotalTaxesPaid: totalTaxesPaid,
        } as TaxesPaid,
        BalTaxPayable: 0,
    }

    itr1.Schedule80D = mapSchedule80D(itr2.Schedule80D);
    if (itr2.Schedule80G) {
        itr1.Schedule80G = mapSchedule80G(itr2.Schedule80G);
    }

    return itr1 as Itr1;
} 
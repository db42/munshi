import { Form16 } from '../../types/form16';
import { CountryCode, PartAGEN1, ResidentialStatus, StateCode, Status, TaxRescertifiedFlag } from '../../types/itr';

export const processPartAGEN1 = (form16: Form16): PartAGEN1 => ({
    PersonalInfo: {
        AssesseeName: {
            FirstName: form16.employee.name,
            SurNameOrOrgName: form16.employee.name // You might want to split name properly
        },
        PAN: form16.employee.pan,
        Address: {
            ResidenceNo: "1234", // These would come from actual data
            LocalityOrArea: form16.employee.address.addrDetail,
            CityOrTownOrDistrict: form16.employee.address.cityOrTownOrDistrict,
            StateCode: String(form16.employee.address.stateCode) as StateCode,
            CountryCode: CountryCode.The91,
            PinCode: form16.employee.address.pinCode,
            CountryCodeMobile: 91,
            MobileNo: 1234567890,
            EmailAddress: "email@example.com"
        },
        DOB: "1990-01-01", // Should come from actual data
        Status: Status.I,
    },
    FilingStatus: {
      FiiFpiFlag: TaxRescertifiedFlag.N,
      ResidentialStatus: ResidentialStatus.Res,
        // ... other required fields
      HeldUnlistedEqShrPrYrFlg: TaxRescertifiedFlag.N,
      ItrFilingDueDate: "2024-07-31",
      OptOutNewTaxRegime: TaxRescertifiedFlag.N,
      ReturnFileSec: 139,
      SeventhProvisio139: TaxRescertifiedFlag.N,
    }
});
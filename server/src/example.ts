import { CountryCode, Itr, ResidentialStatus, StateCode, Status, TaxRescertifiedFlag  } from './types/itr';
import { itrValidator, ValidationError } from './services/validations';

// Example data
const itrData: Itr = {
    ITR: {
        ITR2: {
            CreationInfo: {
                SWVersionNo: "1.0",
                SWCreatedBy: "SW12345678",
                JSONCreatedBy: "SW12345678",
                JSONCreationDate: "2024-03-20",
                IntermediaryCity: "Delhi",
                Digest: "some-digest-value"
            },
            PartA_GEN1: {
                PersonalInfo: {
                    AssesseeName: {
                        SurNameOrOrgName: "Doe"
                    },
                    PAN: "ABCDE1234F",
                    Address: {
                        ResidenceNo: "123",
                        LocalityOrArea: "Some Area",
                        CityOrTownOrDistrict: "Some City",
                        StateCode: StateCode.The01,
                        CountryCode: CountryCode.The91,
                        PinCode: 110001,
                        Phone: {
                            STDcode: 11,
                            PhoneNo: "1234567890"
                        },
                        CountryCodeMobile: 91,
                        MobileNo: 9876543210,
                        EmailAddress: "test@example.com"
                    },
                    DOB: "1990-01-01",
                    Status: Status.I
                },
                //generate FilingStatus here with all the required fields
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
                // ... other required fields
            }
            // ... other required fields
        }
    }
};

// Validate complete ITR
try {
    const validatedITR = itrValidator.validateITR(itrData);
    console.log('ITR is valid');
} catch (error) {
    if (error instanceof ValidationError) {
        console.error('Validation failed:', error.errors);
    } else {
        console.error('Unexpected error:', error);
    }
}

// Validate just personal info section
try {
    const personalInfo = itrData.ITR?.ITR2.PartA_GEN1.PersonalInfo;
    const validatedPersonalInfo = itrValidator.validateSection('PersonalInfo', personalInfo);
    console.log('Personal info is valid');
} catch (error) {
    if (error instanceof ValidationError) {
        console.error('Personal info validation failed:', error.errors);
    }
}
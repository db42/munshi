import { Form16 } from '../types/form16';
import { FormITR2 } from '../types/itr';

export const processFormITR2 = (form16: Form16): FormITR2 => ({
    FormName: "ITR-2",
    Description: "For Individuals and HUFs not having income from profits and gains of business or profession",
    AssessmentYear: "2024",
    SchemaVer: "Ver1.0",
    FormVer: "Ver1.0"
});
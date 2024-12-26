import { Form16 } from '../../types/form16';
import { CreationInfo } from '../../types/itr';

export const processCreationInfo = (form16: Form16): CreationInfo => ({
    SWVersionNo: "1.0",
    SWCreatedBy: "SW12345678",
    JSONCreatedBy: "SW12345678",
    JSONCreationDate: new Date().toISOString().split('T')[0],
    IntermediaryCity: "Delhi",
    Digest: "-"
});
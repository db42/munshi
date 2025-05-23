import Ajv from "ajv-draft-04";
import type { Itr } from '../types/itr';
import * as schema from '../../schema/ITR-2_2024_Main_V1.2.json';
import { CurrentOptions } from "ajv/dist/core";

// Custom error class for validation errors
export class ValidationError extends Error {
    constructor(
        message: string,
        public errors: Array<{ 
            path: string; 
            message: string;
            value?: any;
        }>
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Types for better type safety
type ValidationResult<T> = T;

// Default configuration
const DEFAULT_CONFIG: CurrentOptions = {
    allErrors: true,        // Report all errors, not just the first
    verbose: true,          // Include data in errors
    useDefaults: true,      // Apply default values from schema
    coerceTypes: true,      // Try to coerce value types
    strict: false           // Allow additional properties
};

// Pure function to add custom formats to AJV instance
const addCustomFormats = (ajv: Ajv): Ajv => {
    // Add custom format for PAN
    ajv.addFormat('pan', {
        type: 'string',
        validate: (str: string) => /[A-Z]{5}[0-9]{4}[A-Z]/.test(str)
    });

    // Add other custom formats as needed
    return ajv;
};

// Pure function to create AJV instance with configuration
const createAjvInstance = (config: CurrentOptions = DEFAULT_CONFIG): Ajv => {
    const ajv = new Ajv(config);
    
    // Add custom formats
    return addCustomFormats(ajv);
};

// Pure function to format validation errors
const formatValidationErrors = (errors: any[]): Array<{ path: string; message: string; value?: any }> => {
    return errors.map((err: any) => ({
        path: err.instancePath,
        message: err.message,
        value: err.data
    }));
};

// Higher-order function that creates a validator for a specific schema
const createValidator = (validationSchema: any, config?: CurrentOptions) => {
    const ajv = createAjvInstance(config);
    const validate = ajv.compile(validationSchema);
    
    return <Itr>(data: Itr): ValidationResult<Itr> => {
        const valid = validate(data);
        
        if (!valid && validate.errors) {
            const errors = formatValidationErrors(validate.errors);
            throw new ValidationError('Validation failed', errors);
        }
        
        return data;
    };
};

// Main ITR validator function
export const validateITR = createValidator(schema);

// Function to validate specific sections of the schema
export const validateSection = <T>(sectionName: string, data: T): ValidationResult<T> => {
    const sectionSchema = (schema as any).definitions?.[sectionName];
    
    if (!sectionSchema) {
        throw new Error(`Schema not found for section: ${sectionName}`);
    }
    
    const validator = createValidator(sectionSchema);
    return validator(data);
};

// Specialized validator functions for common use cases
export const validatePersonalInfo = (personalInfo: any) => {
    if (!personalInfo) {
        throw new ValidationError('PersonalInfo is required', []);
    }
    return validateSection('PersonalInfo', personalInfo);
};

// Utility function to check if data is valid without throwing
export const isValidITR = (data: Itr): boolean => {
    try {
        validateITR(data);
        return true;
    } catch {
        return false;
    }
};
import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { Itr } from '../types/itr';
import * as schema from '../../schema/ITR-2_2024_Main_V1.2.json';

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

export class ITRValidator {
    private ajv: Ajv;
    private validate: any;

    constructor() {
        // Initialize AJV with options
        this.ajv = new Ajv({
            allErrors: true,        // Report all errors, not just the first
            verbose: true,          // Include data in errors
            useDefaults: true,      // Apply default values from schema
            coerceTypes: true,      // Try to coerce value types
            strict: false           // Allow additional properties
        });

        // Add formats like date, email etc.
        addFormats(this.ajv);

        // Add custom formats if needed
        this.addCustomFormats();

        // Compile schema
        this.validate = this.ajv.compile(schema);
    }

    private addCustomFormats() {
        // Add custom format for PAN
        this.ajv.addFormat('pan', {
            type: 'string',
            validate: (str: string) => /[A-Z]{5}[0-9]{4}[A-Z]/.test(str)
        });

        // Add other custom formats as needed
    }

    validateITR(data: Itr) {
        const valid = this.validate(data);

        if (!valid) {
            const errors = this.validate.errors.map((err: any) => ({
                path: err.instancePath,
                message: err.message,
                value: err.data
            }));

            throw new ValidationError('ITR validation failed', errors);
        }

        return data;
    }

    // Helper method to validate specific sections
    validateSection<T>(sectionName: string, data: T) {
        const sectionSchema = (schema as any).definitions[sectionName];
        if (!sectionSchema) {
            throw new Error(`Schema not found for section: ${sectionName}`);
        }

        const validate = this.ajv.compile(sectionSchema);
        const valid = validate(data);

        if (!valid) {
            const errors = validate.errors.map((err: any) => ({
                path: err.instancePath,
                message: err.message,
                value: err.data
            }));

            throw new ValidationError(`Validation failed for section: ${sectionName}`, errors);
        }

        return data;
    }
}

// Example usage:
export const validatePersonalInfo = (personalInfo: Itr['ITR']['ITR2']['PartA_GEN1']['PersonalInfo']) => {
    const validator = new ITRValidator();
    return validator.validateSection('PersonalInfo', personalInfo);
};

// Create singleton instance
export const itrValidator = new ITRValidator();
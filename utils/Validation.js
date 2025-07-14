import validator from 'validator';
import xss from 'xss';

export const validateInput = (inputs) => {
    const errors = [];
    let isValid = true;

    for (const [field, config] of Object.entries(inputs)) {
        const { value, type, required, min, max } = config;

        // Check required fields
        if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            errors.push(`${field} is required`);
            isValid = false;
            continue;
        }

        // Skip validation if field is not required and empty
        if (!required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            continue;
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                if (!validator.isEmail(value)) {
                    errors.push(`${field} must be a valid email`);
                    isValid = false;
                }
                break;

            case 'password':
                if (value.length < 8) {
                    errors.push(`${field} must be at least 8 characters long`);
                    isValid = false;
                }
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    errors.push(`${field} must contain at least one uppercase letter, one lowercase letter, and one number`);
                    isValid = false;
                }
                break;

            case 'name':
                if (value.length < 2 || value.length > 50) {
                    errors.push(`${field} must be between 2 and 50 characters`);
                    isValid = false;
                }
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errors.push(`${field} must contain only letters and spaces`);
                    isValid = false;
                }
                break;

            case 'string':
                if (typeof value !== 'string') {
                    errors.push(`${field} must be a string`);
                    isValid = false;
                }
                break;

            case 'number':
                const num = parseFloat(value);
                if (isNaN(num)) {
                    errors.push(`${field} must be a number`);
                    isValid = false;
                } else {
                    if (min !== undefined && num < min) {
                        errors.push(`${field} must be at least ${min}`);
                        isValid = false;
                    }
                    if (max !== undefined && num > max) {
                        errors.push(`${field} must be at most ${max}`);
                        isValid = false;
                    }
                } 
                break;

            case 'time':
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                    errors.push(`${field} must be in HH:MM format`);
                    isValid = false;
                }
                break;

            case 'array':
                if (!Array.isArray(value)) {
                    errors.push(`${field} must be an array`);
                    isValid = false;
                }
                break;
        }
    }

    return { isValid, errors };
};

export const sanitizeInput = (input, type) => {
    if (!input) return input;

    switch (type) {
        case 'email':
            return validator.normalizeEmail(input);
        case 'string':
        case 'name':
            return xss(input.trim());
        case 'time':
            return input.trim();
        default:
            return input;
    }
};
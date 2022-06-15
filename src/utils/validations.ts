namespace App {
    export interface Validator {
        value: string | number;
        required?: boolean;
        min?: number;
        max?: number;
        positive?: boolean;
    }
    
    export function validate(validInput: Validator) {
        let isValid = true;
        if (validInput.required) {
            isValid = isValid && !!validInput.value.toString().trim().length;
        }
        if (validInput.positive) {
            isValid = isValid && validInput.value > 0;
        }
        if (validInput.min) {
            isValid = isValid && validInput.value > validInput.min;
        }
        if (validInput.max) {
            isValid = isValid && validInput.value < validInput.max;
        }
    
        return isValid;
    }
}
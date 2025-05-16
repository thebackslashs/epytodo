import { EnumCriteria, ValidationResult } from './types';

export function enumValidator(criteria: EnumCriteria) {
  return (data: unknown): ValidationResult => {
    if (data === undefined && criteria.optional) {
      return { valid: true, errors: [] };
    }

    if (typeof data !== 'string') {
      return { valid: false, errors: ['Expected a string'] };
    }

    if (!criteria.values.includes(data)) {
      return {
        valid: false,
        errors: [`Value must be one of: ${criteria.values.join(', ')}`],
      };
    }

    return { valid: true, errors: [] };
  };
}

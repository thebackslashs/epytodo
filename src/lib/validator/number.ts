import {
  NumberCriteria,
  NumberValidator,
  ValidationResult,
} from '@/lib/validator/types';

const parseNumber = (
  data: unknown,
  criteria: NumberCriteria
): ValidationResult => {
  if (criteria.optional && data === undefined) {
    return { valid: true, errors: [] };
  }
  if (typeof data !== 'number') {
    return { valid: false, errors: ['Expected a number'] };
  }
  if (criteria.min !== undefined && data < criteria.min) {
    return { valid: false, errors: ['Number is too small'] };
  }
  if (criteria.max !== undefined && data > criteria.max) {
    return { valid: false, errors: ['Number is too large'] };
  }
  return { valid: true, errors: [] };
};

export const createNumber = (criteria: NumberCriteria): NumberValidator => {
  return (data: unknown) => parseNumber(data, criteria);
};

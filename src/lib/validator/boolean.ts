import {
  BooleanCriteria,
  BooleanValidator,
  ValidationResult,
} from '@/lib/validator/types';

export const parseBoolean = (
  data: unknown,
  criteria: BooleanCriteria
): ValidationResult => {
  if (criteria.optional && data === undefined) {
    return { valid: true, errors: [] };
  }
  if (typeof data !== 'boolean') {
    return { valid: false, errors: ['Expected a boolean'] };
  }
  return { valid: true, errors: [] };
};

export const createBoolean = (criteria: BooleanCriteria): BooleanValidator => {
  return (data: unknown) => parseBoolean(data, criteria);
};

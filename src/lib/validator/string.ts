import {
  StringCriteria,
  StringValidator,
  ValidationResult,
} from '@/lib/validator/types';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const parseString = (
  data: unknown,
  criteria: StringCriteria
): ValidationResult => {
  if (criteria.optional && data === undefined) {
    return { valid: true, errors: [] };
  }
  if (typeof data !== 'string') {
    return { valid: false, errors: ['Expected a string'] };
  }
  if (criteria.minLength && data.length < criteria.minLength) {
    return { valid: false, errors: ['String is too short'] };
  }
  if (criteria.maxLength && data.length > criteria.maxLength) {
    return { valid: false, errors: ['String is too long'] };
  }
  if (criteria.isEmail && !isValidEmail(data)) {
    return { valid: false, errors: ['Invalid email'] };
  }
  return { valid: true, errors: [] };
};

export const createString = (criteria: StringCriteria): StringValidator => {
  return (data: unknown) => parseString(data, criteria);
};

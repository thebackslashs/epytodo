import {
  StringCriteria,
  StringValidator,
  ValidationResult,
} from '@/lib/validator/types';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidDate = (date: string): boolean => {
  const dateRegex =
    /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
  return dateRegex.test(date);
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
  if (criteria.isDate && !isValidDate(data)) {
    return { valid: false, errors: ['Invalid date'] };
  }
  return { valid: true, errors: [] };
};

export const createString = (criteria: StringCriteria): StringValidator => {
  return (data: unknown) => parseString(data, criteria);
};

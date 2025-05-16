import {
  ObjectCriteria,
  ObjectValidator,
  ValidationResult,
} from '@/lib/validator/types';

export const parseObject = (
  data: unknown,
  criteria: ObjectCriteria
): ValidationResult => {
  if (criteria.optional && data === undefined) {
    return { valid: true, errors: [] };
  }
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Expected an object'] };
  }
  const errors: string[] = [];

  // Check required fields
  for (const [key, validator] of Object.entries(criteria.fields)) {
    const value = (data as Record<string, unknown>)[key];
    const result = validator(value);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  // Check for unknown fields
  for (const key in data) {
    if (!(key in criteria.fields)) {
      errors.push(`Unknown field '${key}'`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true, errors: [] };
};

export const createObject = (criteria: ObjectCriteria): ObjectValidator => {
  return (data: unknown) => parseObject(data, criteria);
};

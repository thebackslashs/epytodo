export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface StringCriteria {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isDate?: boolean;
  optional?: boolean;
}

export interface NumberCriteria {
  min?: number;
  max?: number;
  optional?: boolean;
}

export interface BooleanCriteria {
  optional?: boolean;
}

export interface ObjectCriteria {
  fields: Record<string, Schema>;
  optional?: boolean;
}

export type StringValidator = (data: unknown) => ValidationResult;
export type NumberValidator = (data: unknown) => ValidationResult;
export type BooleanValidator = (data: unknown) => ValidationResult;
export type ObjectValidator = (data: unknown) => ValidationResult;

export type Schema =
  | ObjectValidator
  | StringValidator
  | NumberValidator
  | BooleanValidator;

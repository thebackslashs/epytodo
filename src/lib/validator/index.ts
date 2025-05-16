import { createString } from './string';
import { createNumber } from './number';
import { createBoolean } from './boolean';
import { createObject } from './object';
import { enumValidator } from './enum';

import type {
  BooleanCriteria,
  EnumCriteria,
  NumberCriteria,
  ObjectCriteria,
  Schema,
  StringCriteria,
  ValidationResult,
} from './types';

function validate(schema: Schema, data: unknown): ValidationResult {
  if (typeof schema !== 'function') {
    throw new Error('Invalid schema');
  }
  return schema(data);
}

const string = createString;
const number = createNumber;
const boolean = createBoolean;
const object = createObject;
const enum_ = enumValidator;

export { validate, string, number, boolean, object, enum_ as enum };

export type {
  StringCriteria,
  NumberCriteria,
  BooleanCriteria,
  ObjectCriteria,
  EnumCriteria,
  ValidationResult,
  Schema,
};

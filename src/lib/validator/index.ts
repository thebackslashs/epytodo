import { createString } from './string';
import { createNumber } from './number';
import { createBoolean } from './boolean';
import { createObject } from './object';

import type {
  BooleanCriteria,
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

export { validate, string, number, boolean, object };

export type {
  StringCriteria,
  NumberCriteria,
  BooleanCriteria,
  ObjectCriteria,
  ValidationResult,
  Schema,
};

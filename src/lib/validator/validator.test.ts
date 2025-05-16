/* eslint-disable */

import * as v from '@/lib/validator';
import { validate } from '@/lib/validator';

describe('Validation Builder', () => {
  describe('String Validation', () => {
    const stringValidator = v.string({ minLength: 2, maxLength: 5 });

    it('should validate valid string', () => {
      const result = validate(stringValidator, 'test');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject too short string', () => {
      const result = validate(stringValidator, 'a');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('String is too short');
    });

    it('should reject too long string', () => {
      const result = validate(stringValidator, 'toolong');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('String is too long');
    });

    it('should reject non-string input', () => {
      const result = validate(stringValidator, 123);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Expected a string');
    });

    it('should handle optional string', () => {
      const optionalValidator = v.string({
        minLength: 2,
        maxLength: 5,
        optional: true,
      });
      const result = validate(optionalValidator, undefined);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid date', () => {
      const result = validate(
        v.string({ isDate: true }),
        '2021-01-01 12:00:00'
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid date', () => {
      const result = validate(v.string({ isDate: true }), '2021-01-01');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should reject invalid date with invalid day', () => {
      const result = validate(
        v.string({ isDate: true }),
        '2021-01-45 12:00:00'
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should reject invalid date with invalid month', () => {
      const result = validate(
        v.string({ isDate: true }),
        '2021-13-01 12:00:00'
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should reject invalid date with invalid hour', () => {
      const result = validate(
        v.string({ isDate: true }),
        '2021-01-01 25:00:00'
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should reject invalid date with invalid minute', () => {
      const result = validate(
        v.string({ isDate: true }),
        '2021-01-01 12:60:00'
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should reject invalid date with invalid second', () => {
      const result = validate(
        v.string({ isDate: true }),
        '2021-01-01 12:00:60'
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should validate valid email', () => {
      const result = validate(v.string({ isEmail: true }), 'test@example.com');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid email', () => {
      const result = validate(v.string({ isEmail: true }), 'invalid-email');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid email');
    });
  });

  describe('Number Validation', () => {
    const numberValidator = v.number({ min: 0, max: 100 });

    it('should validate valid number', () => {
      const result = validate(numberValidator, 50);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject too small number', () => {
      const result = validate(numberValidator, -1);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Number is too small');
    });

    it('should reject too large number', () => {
      const result = validate(numberValidator, 101);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Number is too large');
    });

    it('should reject non-number input', () => {
      const result = validate(numberValidator, '123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Expected a number');
    });

    it('should handle optional number', () => {
      const optionalValidator = v.number({
        min: 0,
        max: 100,
        optional: true,
      });
      const result = validate(optionalValidator, undefined);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Boolean Validation', () => {
    const booleanValidator = v.boolean({});

    it('should validate true', () => {
      const result = validate(booleanValidator, true);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate false', () => {
      const result = validate(booleanValidator, false);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-boolean input', () => {
      const result = validate(booleanValidator, 'true');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Expected a boolean');
    });

    it('should handle optional boolean', () => {
      const optionalValidator = v.boolean({ optional: true });
      const result = validate(optionalValidator, undefined);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Object Validation', () => {
    const objectValidator = v.object({
      fields: {
        name: v.string({ minLength: 2, maxLength: 50 }),
        age: v.number({ min: 0, max: 120 }),
        isActive: v.boolean({}),
        email: v.string({ minLength: 5, maxLength: 100, optional: true }),
      },
    });

    it('should validate valid object', () => {
      const result = validate(objectValidator, {
        name: 'John',
        age: 25,
        isActive: true,
        email: 'john@example.com',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate object with missing optional field', () => {
      const result = validate(objectValidator, {
        name: 'John',
        age: 25,
        isActive: true,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid object', () => {
      const result = validate(objectValidator, {
        name: 'J',
        age: 150,
        isActive: 'yes',
        email: 'invalid',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('String is too short');
      expect(result.errors).toContain('Number is too large');
      expect(result.errors).toContain('Expected a boolean');
    });

    it('should reject non-object input', () => {
      const result = validate(objectValidator, 'not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Expected an object');
    });

    it('should handle optional object', () => {
      const optionalValidator = v.object({
        optional: true,
        fields: {
          name: v.string({ minLength: 2, maxLength: 50 }),
        },
      });
      const result = validate(optionalValidator, undefined);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

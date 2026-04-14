import { IsJsonObjectConstraint } from './is-json-object.validator';

const makeValidator = () => new IsJsonObjectConstraint();

describe('IsJsonObjectConstraint', () => {
  describe('validate', () => {
    it('should return true for a plain object', () => {
      expect(makeValidator().validate({ key: 'value' })).toBe(true);
    });

    it('should return true for an empty object', () => {
      expect(makeValidator().validate({})).toBe(true);
    });

    it('should return true for a nested object', () => {
      expect(makeValidator().validate({ nested: { a: 1 } })).toBe(true);
    });

    it('should return false for null', () => {
      expect(makeValidator().validate(null)).toBe(false);
    });

    it('should return false for an array', () => {
      expect(makeValidator().validate([1, 2, 3])).toBe(false);
    });

    it('should return false for a string', () => {
      expect(makeValidator().validate('string')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(makeValidator().validate(42)).toBe(false);
    });

    it('should return false for a boolean', () => {
      expect(makeValidator().validate(true)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(makeValidator().validate(undefined)).toBe(false);
    });

    it('should return false for an object with a circular reference', () => {
      const circular: Record<string, unknown> = {};
      circular['self'] = circular;
      expect(makeValidator().validate(circular)).toBe(false);
    });

    it('should return false for an object containing a BigInt value', () => {
      expect(makeValidator().validate({ value: BigInt(1) })).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the expected message string', () => {
      expect(makeValidator().defaultMessage()).toBe(
        '$property must be a JSON serializable object',
      );
    });
  });
});

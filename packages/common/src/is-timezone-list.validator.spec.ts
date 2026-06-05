import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  IsTimezoneList,
  IsTimezoneListConstraint,
} from './is-timezone-list.validator';

class TestDto {
  @IsTimezoneList()
  timezones: string[];
}

const makeValidator = () => new IsTimezoneListConstraint();

describe('IsTimezoneListConstraint', () => {
  describe('validate', () => {
    it('should return true for a single valid timezone', () => {
      expect(makeValidator().validate(['UTC'])).toBe(true);
    });

    it('should return true for multiple valid timezones', () => {
      expect(
        makeValidator().validate(['UTC', 'Europe/Paris', 'America/New_York']),
      ).toBe(true);
    });

    it('should return false for an empty array', () => {
      expect(makeValidator().validate([])).toBe(false);
    });

    it('should return false for an invalid timezone string', () => {
      expect(makeValidator().validate(['Not/ATimezone'])).toBe(false);
    });

    it('should return false if any element is invalid', () => {
      expect(makeValidator().validate(['UTC', 'Not/ATimezone'])).toBe(false);
    });

    it('should return false for an empty string element', () => {
      expect(makeValidator().validate([''])).toBe(false);
    });

    it('should return false for a whitespace-only element', () => {
      expect(makeValidator().validate(['   '])).toBe(false);
    });

    it('should return false for a non-array value', () => {
      expect(makeValidator().validate('UTC')).toBe(false);
    });

    it('should return false for null', () => {
      expect(makeValidator().validate(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(makeValidator().validate(undefined)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the expected message string', () => {
      expect(makeValidator().defaultMessage()).toBe(
        '$property must be a non-empty comma-separated list of valid IANA timezones',
      );
    });
  });
});

describe('IsTimezoneList', () => {
  const make = (value: unknown) =>
    plainToInstance(TestDto, { timezones: value });

  describe('Transform', () => {
    it('should split a comma-separated string into an array', () => {
      expect(make('UTC,Europe/Paris').timezones).toEqual([
        'UTC',
        'Europe/Paris',
      ]);
    });

    it('should wrap a single timezone string into a one-element array', () => {
      expect(make('UTC').timezones).toEqual(['UTC']);
    });

    it('should return undefined for a non-string value', () => {
      expect(make(123).timezones).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass for a valid comma-separated list', async () => {
      const errors = await validate(make('UTC,Europe/Paris'));
      expect(errors).toHaveLength(0);
    });

    it('should fail when the field is missing', async () => {
      const errors = await validate(plainToInstance(TestDto, {}));
      expect(errors).toHaveLength(1);
    });

    it('should fail for an invalid timezone in the list', async () => {
      const errors = await validate(make('UTC,Not/ATimezone'));
      expect(errors).toHaveLength(1);
    });

    it('should fail for a non-string value', async () => {
      const errors = await validate(make(123));
      expect(errors).toHaveLength(1);
    });
  });
});

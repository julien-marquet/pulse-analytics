import { createConfigServiceMock } from '../config.service.mock';
import { IsAllowedTimezoneConstraint } from './is-allowed-timezone.validator';

const makeValidator = (timezones: string[]) => {
  const config = createConfigServiceMock({ TIMEZONES: timezones });
  return new IsAllowedTimezoneConstraint(config);
};

describe('IsAllowedTimezoneConstraint', () => {
  it('should return true for a timezone in the configured list', () => {
    const validator = makeValidator(['UTC', 'Europe/Paris']);
    expect(validator.validate('UTC')).toBe(true);
  });

  it('should return true for any timezone in the list', () => {
    const validator = makeValidator(['UTC', 'Europe/Paris']);
    expect(validator.validate('Europe/Paris')).toBe(true);
  });

  it('should return false for a timezone not in the configured list', () => {
    const validator = makeValidator(['UTC']);
    expect(validator.validate('America/New_York')).toBe(false);
  });

  it('should return false for an empty string', () => {
    const validator = makeValidator(['UTC']);
    expect(validator.validate('')).toBe(false);
  });

  it('should return false when the configured list is empty', () => {
    const validator = makeValidator([]);
    expect(validator.validate('UTC')).toBe(false);
  });

  it('should return the expected message string', () => {
    const validator = makeValidator([]);
    expect(validator.defaultMessage()).toBe(
      '$property must be one of the configured timezones',
    );
  });
});

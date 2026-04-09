import { BadRequestException } from '@nestjs/common';
import { useContainer, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateAndTransformPayload } from '../../utils/validation.utils';
import { GetStatsByDayQueryParamsDto } from './get-stats-by-day.request.dto';
import { setupIsAllowedTimezoneContainer } from '../../utils/is-allowed-timezone.test-helpers';

const makeValidPayload = () => ({
  timeZone: 'UTC',
  date: '2026-01-01',
});

describe('GetStatsByDayQueryParamsDto', () => {
  beforeEach(() => setupIsAllowedTimezoneContainer(['UTC', 'Europe/Paris']));
  afterEach(() => useContainer(null!));

  it('should pass for a valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetStatsByDayQueryParamsDto,
    );
    expect(result).toBeInstanceOf(GetStatsByDayQueryParamsDto);
  });

  it('should use default value of UTC when timeZone is absent', async () => {
    const instance = plainToInstance(
      GetStatsByDayQueryParamsDto,
      { date: '2026-01-01' },
      { exposeDefaultValues: true },
    );
    const errors = await validate(instance);
    expect(errors).toHaveLength(0);
    expect(instance.timeZone).toBe('UTC');
  });

  it('should pass for a timezone in the configured list', async () => {
    const result = await validateAndTransformPayload(
      { ...makeValidPayload(), timeZone: 'Europe/Paris' },
      GetStatsByDayQueryParamsDto,
    );
    expect(result.timeZone).toBe('Europe/Paris');
  });

  it('should throw when timeZone is not in the configured list', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), timeZone: 'America/New_York' },
        GetStatsByDayQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when timeZone is an empty string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), timeZone: '' },
        GetStatsByDayQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when date is missing', async () => {
    await expect(
      validateAndTransformPayload(
        { timeZone: 'UTC' },
        GetStatsByDayQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when date is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), date: 'not-a-date' },
        GetStatsByDayQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should pass when date is a valid ISO date string', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetStatsByDayQueryParamsDto,
    );
    expect(result.date).toBe('2026-01-01');
  });
});

import { BadRequestException } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { validateAndTransformPayload } from '../../utils/validation.utils';
import { GetStatsByDayQueryParamsDto } from './get-stats-by-day.request.dto';
import { setupIsAllowedTimezoneContainer } from '../../utils/is-allowed-timezone.test-helpers';

const makeValidPayload = () => ({
  timeZone: 'UTC',
  from: '2026-01-01',
  to: '2026-01-31',
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
    const { timeZone: _, ...payload } = makeValidPayload();
    const result = await validateAndTransformPayload(
      payload,
      GetStatsByDayQueryParamsDto,
    );
    expect(result.timeZone).toBe('UTC');
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

  it('should throw when from is missing', async () => {
    const { from: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, GetStatsByDayQueryParamsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when from is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), from: 'not-a-date' },
        GetStatsByDayQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when to is missing', async () => {
    const { to: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, GetStatsByDayQueryParamsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when to is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), to: 'not-a-date' },
        GetStatsByDayQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});

import { BadRequestException } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { validateAndTransformPayload } from '../../utils/validation.utils';
import { GetStatsOverviewQueryParamsDto } from './get-stats-overview.request.dto';
import { setupIsAllowedTimezoneContainer } from '../../utils/is-allowed-timezone.test-helpers';

const makeValidPayload = () => ({
  timeZone: 'UTC',
  from: '2026-01-01',
  to: '2026-01-31',
});

describe('GetStatsOverviewQueryParamsDto', () => {
  beforeEach(() => setupIsAllowedTimezoneContainer(['UTC', 'Europe/Paris']));
  afterEach(() => useContainer(null!));

  it('should pass for a valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetStatsOverviewQueryParamsDto,
    );
    expect(result).toBeInstanceOf(GetStatsOverviewQueryParamsDto);
  });

  it('should use default value of UTC when timeZone is absent', async () => {
    const { timeZone: _, ...payload } = makeValidPayload();
    const result = await validateAndTransformPayload(
      payload,
      GetStatsOverviewQueryParamsDto,
    );
    expect(result.timeZone).toBe('UTC');
  });

  it('should pass for a timezone in the configured list', async () => {
    const result = await validateAndTransformPayload(
      { ...makeValidPayload(), timeZone: 'Europe/Paris' },
      GetStatsOverviewQueryParamsDto,
    );
    expect(result.timeZone).toBe('Europe/Paris');
  });

  it('should throw when timeZone is not in the configured list', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), timeZone: 'America/New_York' },
        GetStatsOverviewQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when timeZone is an empty string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), timeZone: '' },
        GetStatsOverviewQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when from is missing', async () => {
    const { from: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, GetStatsOverviewQueryParamsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when from is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), from: 'not-a-date' },
        GetStatsOverviewQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should pass when from is a valid ISO date string', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetStatsOverviewQueryParamsDto,
    );
    expect(result.from).toBe('2026-01-01');
  });

  it('should throw when to is missing', async () => {
    const { to: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, GetStatsOverviewQueryParamsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when to is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), to: 'not-a-date' },
        GetStatsOverviewQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should pass when to is a valid ISO date string', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetStatsOverviewQueryParamsDto,
    );
    expect(result.to).toBe('2026-01-31');
  });
});

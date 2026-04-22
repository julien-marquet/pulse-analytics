import { BadRequestException } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { validateAndTransformPayload } from '../../utils/validation.utils';
import { GetStatsByTypeQueryParamsDto } from './get-stats-by-type.request.dto';
import { setupIsAllowedTimezoneContainer } from '../../utils/is-allowed-timezone.test-helpers';

const makeValidPayload = () => ({
  from: '2021-02-01',
  to: '2021-02-04',
});

describe('GetStatsByTypeQueryParamsDto', () => {
  beforeEach(() => setupIsAllowedTimezoneContainer(['UTC', 'Europe/Paris']));
  afterEach(() => useContainer(null!));

  it('should pass for a valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetStatsByTypeQueryParamsDto,
    );
    expect(result).toBeInstanceOf(GetStatsByTypeQueryParamsDto);
  });

  it('should use default value of UTC when timeZone is absent', async () => {
    const { ...payload } = makeValidPayload();
    const result = await validateAndTransformPayload(
      payload,
      GetStatsByTypeQueryParamsDto,
    );
    expect(result.timeZone).toBe('UTC');
  });

  it('should pass for a timezone in the configured list', async () => {
    const result = await validateAndTransformPayload(
      { ...makeValidPayload(), timeZone: 'Europe/Paris' },
      GetStatsByTypeQueryParamsDto,
    );
    expect(result.timeZone).toBe('Europe/Paris');
  });

  it('should throw when timeZone is not in the configured list', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), timeZone: 'America/New_York' },
        GetStatsByTypeQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when timeZone is an empty string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), timeZone: '' },
        GetStatsByTypeQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when from is absent', async () => {
    const { from: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, GetStatsByTypeQueryParamsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should pass when from is a valid ISO date string', async () => {
    const result = await validateAndTransformPayload(
      { ...makeValidPayload(), from: '2026-01-01' },
      GetStatsByTypeQueryParamsDto,
    );
    expect(result.from).toBe('2026-01-01');
  });

  it('should throw when from is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), from: 'not-a-date' },
        GetStatsByTypeQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when to is absent', async () => {
    const { to: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, GetStatsByTypeQueryParamsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should pass when to is a valid ISO date string', async () => {
    const result = await validateAndTransformPayload(
      { ...makeValidPayload(), to: '2026-01-31' },
      GetStatsByTypeQueryParamsDto,
    );
    expect(result.to).toBe('2026-01-31');
  });

  it('should throw when to is not a valid date string', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), to: 'not-a-date' },
        GetStatsByTypeQueryParamsDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});

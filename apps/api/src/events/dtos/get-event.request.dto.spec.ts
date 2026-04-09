import { BadRequestException } from '@nestjs/common';
import { EventTypes } from '@app/contracts';
import { validateAndTransformPayload } from '../../utils/validation.utils';
import { GetEventsQueryParamsDto } from './get-events.request.dto';

const makeValidPayload = () => ({
  page: 1,
  pageSize: 10,
});

describe('GetEventsQueryParamsDto', () => {
  it('should pass for a minimal valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      GetEventsQueryParamsDto,
    );
    expect(result).toBeInstanceOf(GetEventsQueryParamsDto);
  });

  describe('page', () => {
    it('should use default value of 1 when page is absent', async () => {
      const result = await validateAndTransformPayload(
        { pageSize: 10 },
        GetEventsQueryParamsDto,
      );
      expect(result.page).toBe(1);
    });

    it('should throw when page is less than 1', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), page: 0 },
          GetEventsQueryParamsDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should coerce a string page to a number', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), page: '2' },
        GetEventsQueryParamsDto,
      );
      expect(result.page).toBe(2);
    });
  });

  describe('pageSize', () => {
    it('should use default value of 50 when pageSize is absent', async () => {
      const result = await validateAndTransformPayload(
        { page: 1 },
        GetEventsQueryParamsDto,
      );
      expect(result.pageSize).toBe(50);
    });

    it('should throw when pageSize is less than 1', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), pageSize: 0 },
          GetEventsQueryParamsDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when pageSize is greater than 100', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), pageSize: 101 },
          GetEventsQueryParamsDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should pass when pageSize is exactly 100', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), pageSize: 100 },
        GetEventsQueryParamsDto,
      );
      expect(result.pageSize).toBe(100);
    });
  });

  describe('from / to', () => {
    it('should pass when from and to are absent', async () => {
      const result = await validateAndTransformPayload(
        makeValidPayload(),
        GetEventsQueryParamsDto,
      );
      expect(result.from).toBeUndefined();
      expect(result.to).toBeUndefined();
    });

    it('should coerce from string to a Date instance', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), from: '2026-01-01T00:00:00.000Z' },
        GetEventsQueryParamsDto,
      );
      expect(result.from).toBeInstanceOf(Date);
    });

    it('should coerce to string to a Date instance', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), to: '2026-01-31T23:59:59.999Z' },
        GetEventsQueryParamsDto,
      );
      expect(result.to).toBeInstanceOf(Date);
    });

    it('should throw when from is not a valid date string', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), from: 'not-a-date' },
          GetEventsQueryParamsDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('type', () => {
    it('should pass when type is absent', async () => {
      const result = await validateAndTransformPayload(
        makeValidPayload(),
        GetEventsQueryParamsDto,
      );
      expect(result.type).toBeUndefined();
    });

    it('should split a comma-separated type string into an array', async () => {
      const result = await validateAndTransformPayload(
        {
          ...makeValidPayload(),
          type: `${EventTypes.PAGE_VIEWED},${EventTypes.BUTTON_CLICKED}`,
        },
        GetEventsQueryParamsDto,
      );
      expect(result.type).toEqual([
        EventTypes.PAGE_VIEWED,
        EventTypes.BUTTON_CLICKED,
      ]);
    });

    it('should pass when type contains a single valid event type', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), type: EventTypes.PAGE_VIEWED },
        GetEventsQueryParamsDto,
      );
      expect(result.type).toEqual([EventTypes.PAGE_VIEWED]);
    });

    it('should throw when type contains an unknown event type', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), type: 'unknown-type' },
          GetEventsQueryParamsDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

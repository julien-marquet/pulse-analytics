import { BadRequestException } from '@nestjs/common';
import { validateAndTransformPayload } from '../../../utils/validation.utils';
import { CreateEventRequestDto } from './create-event.request.dto';

const makeValidPayload = () => ({
  type: 'PAGE_VIEWED',
  emittedAt: '2026-01-01T00:00:00.000Z',
});

describe('CreateEventRequestDto', () => {
  it('should pass for a minimal valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      CreateEventRequestDto,
    );
    expect(result).toBeInstanceOf(CreateEventRequestDto);
  });

  describe('type', () => {
    it('should throw when type is missing', async () => {
      const { type: _, ...payload } = makeValidPayload();
      await expect(
        validateAndTransformPayload(payload, CreateEventRequestDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when type is an empty string', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), type: '' },
          CreateEventRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('emittedAt', () => {
    it('should accept an ISO string', async () => {
      const result = await validateAndTransformPayload(
        makeValidPayload(),
        CreateEventRequestDto,
      );
      expect(result.emittedAt).toBe('2026-01-01T00:00:00.000Z');
    });

    it('should throw when field is not a valid ISO string', async () => {
      await expect(
        validateAndTransformPayload(
          {
            type: 'PAGE_VIEWED',
            emittedAt: '2026-01:00:00.000Z',
          },
          CreateEventRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when emittedAt is missing', async () => {
      const { emittedAt: _, ...payload } = makeValidPayload();
      await expect(
        validateAndTransformPayload(payload, CreateEventRequestDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('properties', () => {
    it('should default to an empty object when absent', async () => {
      const result = await validateAndTransformPayload(
        makeValidPayload(),
        CreateEventRequestDto,
      );
      expect(result.properties).toEqual({});
    });

    it('should pass for a valid JSON object', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), properties: { key: 'value', count: 1 } },
        CreateEventRequestDto,
      );
      expect(result.properties).toEqual({ key: 'value', count: 1 });
    });

    it('should pass for a nested JSON object', async () => {
      const result = await validateAndTransformPayload(
        { ...makeValidPayload(), properties: { nested: { a: 1 } } },
        CreateEventRequestDto,
      );
      expect(result.properties).toEqual({ nested: { a: 1 } });
    });

    it('should throw when properties is a string', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), properties: 'not-an-object' },
          CreateEventRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when properties is an array', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), properties: [1, 2, 3] },
          CreateEventRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

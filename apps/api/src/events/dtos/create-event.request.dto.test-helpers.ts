import { BadRequestException } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { validateAndTransformPayload } from '../../utils/validation.utils';

export function describeBaseCreateEventRequestDto<T extends object>(
  DtoClass: ClassConstructor<T>,
  makeValidPayload: () => object,
) {
  describe('base fields (inherited)', () => {
    it('should throw when type is missing', async () => {
      const { type: _, ...payload } = makeValidPayload() as Record<
        string,
        unknown
      >;
      await expect(
        validateAndTransformPayload(payload, DtoClass),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when type is not a valid EventType', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), type: 'unknown' },
          DtoClass,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when emittedAt is missing', async () => {
      const { emittedAt: _, ...payload } = makeValidPayload() as Record<
        string,
        unknown
      >;
      await expect(
        validateAndTransformPayload(payload, DtoClass),
      ).rejects.toThrow(BadRequestException);
    });

    it('should coerce emittedAt string to a Date instance', async () => {
      const result = (await validateAndTransformPayload(
        makeValidPayload(),
        DtoClass,
      )) as { emittedAt: unknown };
      expect(result.emittedAt).toBeInstanceOf(Date);
    });

    it('should pass when optional id is provided', async () => {
      const result = (await validateAndTransformPayload(
        { ...makeValidPayload(), id: 'my-id' },
        DtoClass,
      )) as { id: unknown };
      expect(result.id).toBe('my-id');
    });

    it('should pass when optional id is absent', async () => {
      const result = (await validateAndTransformPayload(
        makeValidPayload(),
        DtoClass,
      )) as { id: unknown };
      expect(result.id).toBeUndefined();
    });

    it('should throw when id is an empty string', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), id: '' },
          DtoClass,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when extra fields are present', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), extra: 'unwanted' },
          DtoClass,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
}

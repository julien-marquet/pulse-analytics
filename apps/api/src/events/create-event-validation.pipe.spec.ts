import { BadRequestException } from '@nestjs/common';
import { CreateEventValidationPipe } from './create-event-validation.pipe';
import {
  ButtonClickedCreateEventRequestDto,
  PageViewedCreateEventRequestDto,
} from './dtos/create-event.request.dto';
import { EventTypes } from '@app/contracts';

const makePageViewedPayload = () => ({
  type: EventTypes.PAGE_VIEWED,
  emittedAt: '2026-01-01T00:00:00.000Z',
  properties: { source: 'web', page: '/home' },
});

const makeButtonClickedPayload = () => ({
  type: EventTypes.BUTTON_CLICKED,
  emittedAt: '2026-01-01T00:00:00.000Z',
  properties: { source: 'web', button: 'submit' },
});

describe('CreateEventValidationPipe', () => {
  let pipe: CreateEventValidationPipe;

  beforeEach(() => {
    pipe = new CreateEventValidationPipe();
  });

  describe('transform', () => {
    it('should throw BadRequestException when type is missing', async () => {
      await expect(pipe.transform({})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when type is unknown', async () => {
      await expect(pipe.transform({ type: 'unknown-type' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should include the invalid type in the error message', async () => {
      let exception: BadRequestException | undefined;
      try {
        await pipe.transform({ type: 'invalid' });
      } catch (e) {
        exception = e as BadRequestException;
      }

      expect(exception!.message).toBe('Invalid event type: invalid');
    });

    it('should return a PageViewedCreateEventRequestDto instance for a valid page-viewed payload', async () => {
      const result = await pipe.transform(makePageViewedPayload());
      expect(result).toBeInstanceOf(PageViewedCreateEventRequestDto);
    });

    it('should return a ButtonClickedCreateEventRequestDto instance for a valid button-clicked payload', async () => {
      const result = await pipe.transform(makeButtonClickedPayload());
      expect(result).toBeInstanceOf(ButtonClickedCreateEventRequestDto);
    });

    it('should throw BadRequestException when required properties are missing for page-viewed', async () => {
      await expect(
        pipe.transform({
          type: EventTypes.PAGE_VIEWED,
          emittedAt: '2026-01-01T00:00:00.000Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when required properties are missing for button-clicked', async () => {
      await expect(
        pipe.transform({
          type: EventTypes.BUTTON_CLICKED,
          emittedAt: '2026-01-01T00:00:00.000Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when emittedAt is missing', async () => {
      const { emittedAt: _, ...payload } = makePageViewedPayload();
      await expect(pipe.transform(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

import { BadRequestException } from '@nestjs/common';
import { EventTypes } from '@app/contracts';
import {
  PageViewedCreateEventRequestDto,
  ButtonClickedCreateEventRequestDto,
} from './create-event.request.dto';
import { describeBaseCreateEventRequestDto } from './create-event.request.dto.test-helpers';
import { validateAndTransformPayload } from '../../utils/validation.utils';

describe('PageViewedCreateEventRequestDto', () => {
  const makeValidPayload = () => ({
    type: EventTypes.PAGE_VIEWED,
    emittedAt: '2026-01-01T00:00:00.000Z',
    properties: { source: 'web', page: '/home' },
  });

  describeBaseCreateEventRequestDto(
    PageViewedCreateEventRequestDto,
    makeValidPayload,
  );

  it('should pass for a valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      PageViewedCreateEventRequestDto,
    );
    expect(result).toBeInstanceOf(PageViewedCreateEventRequestDto);
  });

  it('should throw when properties is missing', async () => {
    const { properties: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, PageViewedCreateEventRequestDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when properties.source is missing', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), properties: { page: '/home' } },
        PageViewedCreateEventRequestDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when properties.page is missing', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), properties: { source: 'web' } },
        PageViewedCreateEventRequestDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});

describe('ButtonClickedCreateEventRequestDto', () => {
  const makeValidPayload = () => ({
    type: EventTypes.BUTTON_CLICKED,
    emittedAt: '2026-01-01T00:00:00.000Z',
    properties: { source: 'web', button: 'submit' },
  });

  describeBaseCreateEventRequestDto(
    ButtonClickedCreateEventRequestDto,
    makeValidPayload,
  );

  it('should pass for a valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      ButtonClickedCreateEventRequestDto,
    );
    expect(result).toBeInstanceOf(ButtonClickedCreateEventRequestDto);
  });

  it('should throw when properties is missing', async () => {
    const { properties: _, ...payload } = makeValidPayload();
    await expect(
      validateAndTransformPayload(payload, ButtonClickedCreateEventRequestDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when properties.button is missing', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), properties: { source: 'web' } },
        ButtonClickedCreateEventRequestDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw when properties.source is missing', async () => {
    await expect(
      validateAndTransformPayload(
        { ...makeValidPayload(), properties: { button: 'submit' } },
        ButtonClickedCreateEventRequestDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});

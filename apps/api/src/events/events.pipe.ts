import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { EventDto, GetDtoClassByEventType } from './events.dto';
import { validateAndTransformPayload } from 'apps/api/src/utils/validation.utils';

interface RawEventPayload {
  eventType?: string;
  [key: string]: unknown;
}

@Injectable()
export class EventValidationPipe implements PipeTransform<
  RawEventPayload,
  Promise<EventDto>
> {
  async transform(payload: RawEventPayload): Promise<EventDto> {
    const dtoClass = GetDtoClassByEventType(payload.eventType);

    if (!dtoClass) {
      throw new BadRequestException(`Invalid event type: ${payload.eventType}`);
    }

    return validateAndTransformPayload(payload, dtoClass);
  }
}

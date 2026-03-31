import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { EventDto, GetDtoClassByType } from './events.dto';
import { validateAndTransformPayload } from 'apps/api/src/utils/validation.utils';

interface RawEventPayload {
  type?: string;
  [key: string]: unknown;
}

@Injectable()
export class EventValidationPipe implements PipeTransform<
  RawEventPayload,
  Promise<EventDto>
> {
  async transform(payload: RawEventPayload): Promise<EventDto> {
    const dtoClass = GetDtoClassByType(payload.type);

    if (!dtoClass) {
      throw new BadRequestException(`Invalid event type: ${payload.type}`);
    }

    return validateAndTransformPayload(payload, dtoClass);
  }
}

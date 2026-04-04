import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateEventRequestDto,
  CreateEventRequestTypeDtoMap,
} from '../dtos/create-event.request.dto';
import { validateAndTransformPayload } from 'apps/api/src/utils/validation.utils';
import { EventType } from 'apps/api/src/events/dtos/event.types';

interface RawEventPayload {
  eventType?: string;
  [key: string]: unknown;
}

@Injectable()
export class CreateEventValidationPipe implements PipeTransform<
  RawEventPayload,
  Promise<CreateEventRequestDto>
> {
  async transform(payload: RawEventPayload): Promise<CreateEventRequestDto> {
    const dtoClass =
      CreateEventRequestTypeDtoMap[payload.eventType as EventType] ?? null;
    if (!dtoClass) {
      throw new BadRequestException(`Invalid event type: ${payload.eventType}`);
    }

    return validateAndTransformPayload(payload, dtoClass);
  }
}

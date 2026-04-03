import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  AddEventRequestDto,
  GetDtoClassByEventType,
} from './dtos/addEvent.request.dto';
import { validateAndTransformPayload } from 'apps/api/src/utils/validation.utils';

interface RawEventPayload {
  eventType?: string;
  [key: string]: unknown;
}

@Injectable()
export class AddEventValidationPipe implements PipeTransform<
  RawEventPayload,
  Promise<AddEventRequestDto>
> {
  async transform(payload: RawEventPayload): Promise<AddEventRequestDto> {
    const dtoClass = GetDtoClassByEventType(payload.eventType);

    if (!dtoClass) {
      throw new BadRequestException(`Invalid event type: ${payload.eventType}`);
    }

    return validateAndTransformPayload(payload, dtoClass);
  }
}

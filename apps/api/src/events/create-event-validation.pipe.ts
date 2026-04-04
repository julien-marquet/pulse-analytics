import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateEventRequestDto,
  CreateEventRequestTypeDtoMap,
} from './dtos/create-event.request.dto';
import { validateAndTransformPayload } from 'apps/api/src/utils/validation.utils';
import { EventType } from '@app/contracts';

interface RawEventPayload {
  type?: string;
  [key: string]: unknown;
}

@Injectable()
export class CreateEventValidationPipe implements PipeTransform<
  RawEventPayload,
  Promise<CreateEventRequestDto>
> {
  async transform(payload: RawEventPayload): Promise<CreateEventRequestDto> {
    const dtoClass =
      CreateEventRequestTypeDtoMap[payload.type as EventType] ?? null;
    if (!dtoClass) {
      throw new BadRequestException(`Invalid event type: ${payload.type}`);
    }

    return validateAndTransformPayload(payload, dtoClass);
  }
}

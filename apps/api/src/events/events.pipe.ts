import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { EventDto, GetDtoClassByType } from './events.dto';

interface RawEventPayload {
  type?: string;
  [key: string]: unknown;
}

@Injectable()
export class EventPipe implements PipeTransform<
  RawEventPayload,
  Promise<EventDto>
> {
  async transform(payload: RawEventPayload): Promise<EventDto> {
    const dtoClass = GetDtoClassByType(payload.type);

    if (!dtoClass) {
      throw new BadRequestException(`Invalid event type: ${payload.type}`);
    }

    const instance = plainToInstance(
      dtoClass as ClassConstructor<EventDto>,
      payload,
      {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
    ) as EventDto;
    const errors = (await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      skipMissingProperties: false,
    })) as ValidationError[];

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return instance;
  }
}

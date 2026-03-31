import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { validateAndTransformPayload } from 'apps/api/src/utils/validation.utils';
import { ClassConstructor } from 'class-transformer';

@Injectable()
export class ValidationPipe<
  TDto extends object,
  TPayload = Record<string, any>,
> implements PipeTransform<TPayload, Promise<TDto>> {
  async transform(value: TPayload, metadata: ArgumentMetadata): Promise<TDto> {
    const ctor = metadata.metatype as ClassConstructor<TDto>;
    return validateAndTransformPayload(value, ctor);
  }
}

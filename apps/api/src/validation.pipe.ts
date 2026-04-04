import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { validateAndTransformPayload } from './utils/validation.utils';

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

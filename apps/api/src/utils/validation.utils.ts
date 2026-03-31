import { BadRequestException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateAndTransformPayload<
  TPayload,
  TDto extends object,
>(payload: TPayload, classConstructor: ClassConstructor<TDto>) {
  const instance = plainToInstance(classConstructor, payload, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
  const errors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: { target: false },
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return instance;
}

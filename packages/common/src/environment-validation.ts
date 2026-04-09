import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Type } from '@nestjs/common';

export function validateEnvironment<T extends object>(
  Variables: Type<T>,
  payload: Record<string, unknown>,
) {
  const validated = plainToInstance(Variables, payload, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: true,
    validationError: { target: false },
  });
  if (errors.length > 0) {
    throw new Error(
      `Environment Validations Failed:\n${errors.map((err) => err.toString()).join('\n')}`,
    );
  }

  return validated;
}

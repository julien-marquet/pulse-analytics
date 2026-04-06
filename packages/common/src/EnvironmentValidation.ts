import dotenv from 'dotenv';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Type } from '@nestjs/common';

export class ValidatedEnvironment<TEnvironmentVariables extends object> {
  private readonly env: TEnvironmentVariables;

  constructor(EnvironmentVariables: Type<TEnvironmentVariables>) {
    dotenv.config();

    this.env = validateEnvironment(EnvironmentVariables, process.env);
  }

  get<K extends keyof TEnvironmentVariables>(key: K): TEnvironmentVariables[K] {
    return this.env[key];
  }
}

export function validateEnvironment<T extends object>(
  Variables: Type<T>,
  payload: Record<string, unknown>,
) {
  const validated = plainToInstance(Variables, payload, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    validationError: { target: false },
  });
  if (errors.length > 0) {
    console.error(`${errors.map((err) => err.toString()).join('\n')}`);
    throw new Error('Environment Validations Failed');
  }

  return validated;
}

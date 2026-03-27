import dotenv from 'dotenv';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Type } from '@nestjs/common';

export class ValidatedEnv<TEnvironmentVariables extends object> {
  private readonly env: TEnvironmentVariables;

  constructor(EnvironmentVariables: Type<TEnvironmentVariables>) {
    dotenv.config();

    const validated = plainToInstance(EnvironmentVariables, process.env, {
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

    this.env = validated;
  }
  get<K extends keyof TEnvironmentVariables>(key: K): TEnvironmentVariables[K] {
    return this.env[key];
  }
}
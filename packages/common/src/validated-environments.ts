import { Type } from '@nestjs/common';
import dotenv from 'dotenv';
import { validateEnvironment } from './environment-validation';

export class ValidatedEnvironment<TEnvironmentVariables extends object> {
  private readonly env: TEnvironmentVariables;

  constructor(EnvironmentVariables: Type<TEnvironmentVariables>) {
    dotenv.config({ quiet: true });

    this.env = validateEnvironment(EnvironmentVariables, process.env);
  }

  get<K extends keyof TEnvironmentVariables>(key: K): TEnvironmentVariables[K] {
    return this.env[key];
  }
}

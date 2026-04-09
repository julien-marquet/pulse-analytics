import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ValidatedEnvironment } from '@app/common';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  EVENT_QUEUE_NAME: string;

  @IsString()
  @IsNotEmpty()
  ADD_EVENT_JOB_NAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}

export const environment = new ValidatedEnvironment(EnvironmentVariables);

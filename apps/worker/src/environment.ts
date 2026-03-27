import { IsNotEmpty, IsString } from 'class-validator';
import { ValidatedEnv } from '@app/common';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;

  @IsString()
  @IsNotEmpty()
  EVENT_QUEUE_NAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  ADD_EVENT_JOB_NAME: string;
}

export const environment = new ValidatedEnv(EnvironmentVariables);

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidatedEnvironment } from '@app/common';

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

  @IsString()
  @IsOptional()
  LOG_LEVEL?: string = 'info';

  @IsString()
  @IsOptional()
  NODE_ENV?: string = 'development';
}

export const environment = new ValidatedEnvironment(EnvironmentVariables);

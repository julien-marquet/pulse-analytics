import { IsDefined, IsNotEmpty, IsString, IsTimeZone } from 'class-validator';
import { ValidatedEnv } from '@app/common';
import { Transform } from 'class-transformer';

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

  @IsDefined()
  @IsTimeZone({ each: true })
  @IsDefined({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : undefined,
  )
  TIMEZONES: string[];
}

export const environment = new ValidatedEnv(EnvironmentVariables);

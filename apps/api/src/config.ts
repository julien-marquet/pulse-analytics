import { Transform } from 'class-transformer';
import { IsDefined, IsTimeZone, IsNotEmpty } from 'class-validator';

export class ConfigVariables {
  @IsDefined()
  @IsTimeZone({ each: true })
  @IsDefined({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : undefined,
  )
  TIMEZONES: string[];
}

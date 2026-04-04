import { environment } from 'apps/api/src/environment';

import { IsIn, IsDateString, IsOptional } from 'class-validator';
import { EventTypes } from '@app/common';
import type { EventType } from '@app/common';

export class GetStatsByTypeQueryParamsDto {
  @IsIn(Object.values(EventTypes))
  eventType: EventType;

  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

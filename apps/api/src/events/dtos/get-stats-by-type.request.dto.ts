import { environment } from 'apps/api/src/environment';
import { EventTypes } from 'apps/api/src/events/dtos/event.types';
import type { EventType } from 'apps/api/src/events/dtos/event.types';
import { IsIn, IsDateString, IsOptional } from 'class-validator';

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

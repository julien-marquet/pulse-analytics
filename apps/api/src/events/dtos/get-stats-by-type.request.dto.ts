import { IsIn, IsDateString, IsOptional } from 'class-validator';
import { EventTypes } from '@app/contracts';
import type { EventType } from '@app/contracts';
import { environment } from '../../environment';

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

import { environment } from 'apps/api/src/environment';
import { IsArrayOfAllowedValues } from 'apps/api/src/events/dto.decorators';
import type { EventType } from 'apps/api/src/events/events.dto';
import { EventTypes } from 'apps/api/src/events/events.dto';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class GetStatsByDayQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  date: string;
}

export class GetStatsByTypeQueryParamsDto {
  @IsIn(Object.values(EventTypes))
  eventType: EventType;

  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  from?: string;

  @IsDateString()
  to?: string;
}

export class GetEventsQueryParamsDto {
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize: number = 50;

  @IsDate()
  @IsOptional()
  from?: Date;

  @IsDate()
  @IsOptional()
  to?: Date;

  @IsArrayOfAllowedValues(Object.values(EventTypes))
  @IsOptional()
  type?: EventType[];
}

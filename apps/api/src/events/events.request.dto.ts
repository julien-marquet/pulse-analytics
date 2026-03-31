import { environment } from 'apps/api/src/environment';
import type { EventDto, EventType } from 'apps/api/src/events/events.dto';
import { EventTypes } from 'apps/api/src/events/events.dto';
import { IsDateString, IsDefined, IsIn } from 'class-validator';

export class GetStatsByDayParamsDto {
  @IsDateString()
  @IsDefined()
  date: string;
}

export class GetStatsByDayQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';
}

export class GetStatsByTypeParamsDto {
  @IsDefined()
  @IsIn(Object.values(EventTypes))
  eventType: EventType;
}

export class GetStatsByTypeQueryParamsDto {
  @IsDateString()
  @IsDefined()
  from: string;

  @IsDateString()
  @IsDefined()
  to: string;
}

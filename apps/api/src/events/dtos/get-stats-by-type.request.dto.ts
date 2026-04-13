import { IsIn, IsDateString, IsOptional } from 'class-validator';
import { EventTypes } from '@app/contracts';
import type { EventType } from '@app/contracts';
import { IsAllowedTimezone } from '../../utils/dto.decorators';

export class GetStatsByTypeQueryParamsDto {
  @IsIn(Object.values(EventTypes))
  eventType: EventType;

  @IsOptional()
  @IsAllowedTimezone()
  timeZone: string = 'UTC';

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

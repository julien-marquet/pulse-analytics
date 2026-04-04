import { EventTypes, EventType } from 'apps/api/src/events/dtos/event.types';
import { IsArrayOfAllowedValues } from 'apps/api/src/utils/dto.decorators';
import { IsNumber, Min, Max, IsDate, IsOptional } from 'class-validator';

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

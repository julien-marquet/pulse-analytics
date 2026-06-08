import { IsDateString, IsOptional } from 'class-validator';
import { IsAllowedTimezone } from '../../../utils/dto.decorators';

export class GetStatsByDayQueryParamsDto {
  @IsOptional()
  @IsAllowedTimezone()
  timeZone: string = 'UTC';

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

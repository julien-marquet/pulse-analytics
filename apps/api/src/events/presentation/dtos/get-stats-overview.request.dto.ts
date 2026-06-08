import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { IsAllowedTimezone } from '../../../utils/dto.decorators';

export class GetStatsOverviewQueryParamsDto {
  @IsOptional()
  @IsAllowedTimezone()
  timeZone: string = 'UTC';

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nSelectedTopEvents: number = 3;
}

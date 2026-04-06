import { IsDateString } from 'class-validator';
import { IsAllowedTimezone } from '../../utils/dto.decorators';

export class GetStatsOverviewQueryParamsDto {
  @IsAllowedTimezone()
  timeZone: string = 'UTC';

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

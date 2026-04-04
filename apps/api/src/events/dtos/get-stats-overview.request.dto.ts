import { IsIn, IsDateString } from 'class-validator';
import { environment } from '../../environment';

export class GetStatsOverviewQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

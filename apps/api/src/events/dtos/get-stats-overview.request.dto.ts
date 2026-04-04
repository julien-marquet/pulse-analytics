import { environment } from 'apps/api/src/environment';
import { IsIn, IsDateString } from 'class-validator';

export class GetStatsOverviewQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

import { environment } from 'apps/api/src/environment';
import { IsIn, IsDateString } from 'class-validator';

export class GetStatsByDayQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  date: string;
}

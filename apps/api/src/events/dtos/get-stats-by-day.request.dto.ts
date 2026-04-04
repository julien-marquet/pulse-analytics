import { IsIn, IsDateString } from 'class-validator';
import { environment } from '../../environment';

export class GetStatsByDayQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';

  @IsDateString()
  date: string;
}

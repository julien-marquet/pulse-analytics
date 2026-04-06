import { IsDateString } from 'class-validator';
import { IsAllowedTimezone } from '../../utils/dto.decorators';

export class GetStatsByDayQueryParamsDto {
  @IsAllowedTimezone()
  timeZone: string = 'UTC';

  @IsDateString()
  date: string;
}

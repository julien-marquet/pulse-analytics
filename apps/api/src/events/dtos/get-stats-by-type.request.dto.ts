import {
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { IsAllowedTimezone } from '../../utils/dto.decorators';

export class GetStatsByTypeQueryParamsDto {
  @IsNotEmpty()
  @IsString()
  eventType: string;

  @IsOptional()
  @IsAllowedTimezone()
  timeZone: string = 'UTC';

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

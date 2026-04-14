import { IsNumber, Min, Max, IsDate, IsOptional } from 'class-validator';
import { IsStringArray } from '../../utils/dto.decorators';

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

  @IsStringArray()
  @IsOptional()
  type?: string[];
}

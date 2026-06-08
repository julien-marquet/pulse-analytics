import {
  IsNumber,
  Min,
  Max,
  IsDate,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { IsStringArray } from '../../../utils/dto.decorators';
import { Transform } from 'class-transformer';

export class GetEventsQueryParamsDto {
  @IsNumber()
  @Min(1)
  page: number;

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

  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    if (obj[key] === 'true') return true;
    if (obj[key] === 'false') return false;
    return obj[key];
  })
  @IsOptional()
  @IsBoolean()
  sortAsc?: boolean;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsIn(['emittedAt', 'type'])
  sortBy?: 'emittedAt' | 'type';
}

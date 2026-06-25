import {
  IsNumber,
  Min,
  IsDate,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { IsStringArray } from '../../../utils/dto.decorators';
import { Transform } from 'class-transformer';
import {
  SORTABLE_EVENT_FIELDS,
  type SortableEventField,
} from '../../application/event.finder';

export class GetEventsQueryParamsDto {
  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  pageSize: number;

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
  @IsIn(SORTABLE_EVENT_FIELDS)
  sortBy?: SortableEventField;
}

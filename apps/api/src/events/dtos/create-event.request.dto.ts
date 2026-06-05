import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { IsJsonObject } from '../../utils/dto.decorators';

export class CreateEventRequestDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  emittedAt: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string | undefined;

  @IsOptional()
  @IsJsonObject()
  properties: Record<string, unknown> = {};
}

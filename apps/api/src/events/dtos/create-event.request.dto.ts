import { IsDate, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { IsJsonObject } from '../../utils/dto.decorators';

export class CreateEventRequestDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDate()
  emittedAt: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string | undefined;

  @IsOptional()
  @IsJsonObject()
  properties: Record<string, unknown> = {};
}

import { ClassConstructor, Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventTypes } from '@app/common/src/EventTypes';
import type { EventType } from '@app/common/src/EventTypes';

abstract class BaseCreateEventRequestDto {
  @IsIn(Object.values(EventTypes))
  type: EventType;

  @IsDate()
  emittedAt: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string | undefined;
}

class PageViewedPropertiesDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  page: string;
}

export class PageViewedCreateEventRequestDto extends BaseCreateEventRequestDto {
  declare type: typeof EventTypes.PAGE_VIEWED;

  @ValidateNested()
  @IsDefined()
  @Type(() => PageViewedPropertiesDto)
  properties: PageViewedPropertiesDto;
}

class ButtonClickedPropertiesDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  button: string;
}

export class ButtonClickedCreateEventRequestDto extends BaseCreateEventRequestDto {
  declare type: typeof EventTypes.BUTTON_CLICKED;

  @ValidateNested()
  @IsDefined()
  @Type(() => ButtonClickedPropertiesDto)
  properties: ButtonClickedPropertiesDto;
}

export type CreateEventRequestDto =
  | PageViewedCreateEventRequestDto
  | ButtonClickedCreateEventRequestDto;

export const CreateEventRequestTypeDtoMap: Record<
  EventType,
  ClassConstructor<CreateEventRequestDto>
> = {
  [EventTypes.PAGE_VIEWED]: PageViewedCreateEventRequestDto,
  [EventTypes.BUTTON_CLICKED]: ButtonClickedCreateEventRequestDto,
};

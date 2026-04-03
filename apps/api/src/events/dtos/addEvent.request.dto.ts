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

export const EventTypes = {
  PAGE_VIEWED: 'page-viewed',
  BUTTON_CLICKED: 'button-clicked',
} as const;
export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

abstract class BaseEventDto {
  @IsIn(Object.values(EventTypes))
  eventType: EventType;

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

export class PageViewedEventDto extends BaseEventDto {
  declare eventType: typeof EventTypes.PAGE_VIEWED;

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

export class ButtonClickedEventDto extends BaseEventDto {
  declare eventType: typeof EventTypes.BUTTON_CLICKED;

  @ValidateNested()
  @IsDefined()
  @Type(() => ButtonClickedPropertiesDto)
  properties: ButtonClickedPropertiesDto;
}

export type AddEventRequestDto = PageViewedEventDto | ButtonClickedEventDto;

export function GetDtoClassByEventType(
  type: string | null | undefined,
): ClassConstructor<AddEventRequestDto> | null {
  switch (type) {
    case EventTypes.PAGE_VIEWED:
      return PageViewedEventDto;
    case EventTypes.BUTTON_CLICKED:
      return ButtonClickedEventDto;
    default:
      return null;
  }
}

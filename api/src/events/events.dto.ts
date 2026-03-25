import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export const EventTypes = {
  PAGE_VIEWED: 'page-viewed',
  BUTTON_CLICKED: 'button-clicked',
} as const;
type EventType = (typeof EventTypes)[keyof typeof EventTypes];

abstract class BaseEventDto {
  @IsIn(Object.values(EventTypes))
  type: EventType;
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

export class ButtonClickedEventDto extends BaseEventDto {
  declare type: typeof EventTypes.BUTTON_CLICKED;

  @ValidateNested()
  @IsDefined()
  @Type(() => ButtonClickedPropertiesDto)
  properties: ButtonClickedPropertiesDto;
}

export type EventDto = PageViewedEventDto | ButtonClickedEventDto;

export function GetDtoClassByType(type: string | null | undefined) {
  switch (type) {
    case EventTypes.PAGE_VIEWED:
      return PageViewedEventDto;
    case EventTypes.BUTTON_CLICKED:
      return ButtonClickedEventDto;
    default:
      return null;
  }
}

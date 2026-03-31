import { environment } from 'apps/api/src/environment';
import { ClassConstructor, Type } from 'class-transformer';
import {
  IsDateString,
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
type EventType = (typeof EventTypes)[keyof typeof EventTypes];

abstract class BaseEventDto {
  @IsIn(Object.values(EventTypes))
  eventType: EventType;

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

export type EventDto = PageViewedEventDto | ButtonClickedEventDto;

export function GetDtoClassByEventType(
  type: string | null | undefined,
): ClassConstructor<EventDto> | null {
  switch (type) {
    case EventTypes.PAGE_VIEWED:
      return PageViewedEventDto;
    case EventTypes.BUTTON_CLICKED:
      return ButtonClickedEventDto;
    default:
      return null;
  }
}

export class GetStatsByDayParamsDto {
  @IsDateString()
  @IsDefined()
  date: string;
}

export class GetStatsByDayQueryParamsDto {
  @IsIn(environment.get('TIMEZONES'))
  timeZone: string = 'UTC';
}

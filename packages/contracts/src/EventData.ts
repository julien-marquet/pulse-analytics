import { EventTypes } from './EventTypes';

interface PageViewedProperties {
  source: string;
  page: string;
}

interface ButtonClickedProperties {
  source: string;
  button: string;
}

interface BaseEventData<T extends string, P> {
  type: T;
  emittedAt: Date;
  properties: P;
}

export type PageViewedEventData = BaseEventData<
  typeof EventTypes.PAGE_VIEWED,
  PageViewedProperties
>;

export type ButtonClickedEventData = BaseEventData<
  typeof EventTypes.BUTTON_CLICKED,
  ButtonClickedProperties
>;

export type EventData = PageViewedEventData | ButtonClickedEventData;
